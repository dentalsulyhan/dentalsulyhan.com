import fs from 'node:fs'
import path from 'node:path'

import { CopyObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'
import pg from 'pg'

const { Client } = pg

const rootDir = process.cwd()
const env = loadEnv(path.join(rootDir, '.env'))

const bucket = env.R2_BUCKET
const endpoint = normalizeEndpoint(env.R2_ENDPOINT || (env.R2_ACCOUNT_ID ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : ''))
const accessKeyId = env.R2_ACCESS_KEY_ID
const secretAccessKey = env.R2_SECRET_ACCESS_KEY
const publicBaseUrl = stripTrailingSlash(env.R2_PUBLIC_BASE_URL)
const apply = process.argv.includes('--apply')

if (!bucket || !endpoint || !accessKeyId || !secretAccessKey || !publicBaseUrl) {
  throw new Error('Missing R2 configuration in .env')
}

const s3 = new S3Client({
  region: env.R2_REGION || 'auto',
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

const db = new Client({
  database: process.env.PGDATABASE || 'sulyhan-backend',
})

await db.connect()

try {
  const result = await db.query(`
    select
      id,
      filename,
      coalesce(prefix, '') as prefix,
      coalesce(url, '') as url,
      coalesce(media_category, 'general') as media_category,
      created_at
    from media
    order by id
  `)

  const rows = result.rows
  const mapping = buildMappings(rows, publicBaseUrl)
  const changed = mapping.filter((row) => row.oldKey !== row.newKey || row.oldFilename !== row.newFilename || row.oldPrefix !== row.newPrefix || row.oldCategory !== row.newCategory || row.oldUrl !== row.newUrl)

  const backupDir = path.join(rootDir, 'tmp')
  fs.mkdirSync(backupDir, { recursive: true })
  const backupPath = path.join(backupDir, `media-r2-migration-backup-${Date.now()}.json`)
  fs.writeFileSync(backupPath, JSON.stringify(mapping, null, 2))

  console.log(`Total media rows: ${rows.length}`)
  console.log(`Rows needing update: ${changed.length}`)
  console.log(`Backup written to: ${backupPath}`)

  if (!apply) {
    console.log('')
    console.log('Dry run preview:')
    for (const row of changed.slice(0, 12)) {
      console.log(`${row.id}: ${row.oldKey} -> ${row.newKey} [${row.newCategory}]`)
    }
    console.log('')
    console.log('Run with --apply to copy objects in R2 and update Postgres.')
    process.exit(0)
  }

  for (const row of changed) {
    await ensureObjectExists(row.oldKey)

    if (!(await objectExists(row.newKey))) {
      await s3.send(
        new CopyObjectCommand({
          Bucket: bucket,
          CopySource: `${bucket}/${encodeCopySource(row.oldKey)}`,
          Key: row.newKey,
          ContentType: guessContentType(row.newFilename),
        }),
      )
    }

    await ensureObjectExists(row.newKey)
  }

  await db.query('begin')

  for (const row of changed) {
    await db.query(
      `
        update media
        set
          filename = $2,
          prefix = $3,
          media_category = $4,
          url = $5,
          updated_at = now()
        where id = $1
      `,
      [row.id, row.newFilename, row.newPrefix, row.newCategory, row.newUrl],
    )
  }

  await db.query('commit')

  console.log('')
  console.log(`Updated ${changed.length} media rows.`)
  console.log('Old R2 objects were kept in place as fallback backup.')
} catch (error) {
  try {
    await db.query('rollback')
  } catch {
    // noop
  }

  throw error
} finally {
  await db.end()
}

function buildMappings(rows, publicBaseUrl) {
  const usedNamesByPrefix = new Map()

  return rows.map((row) => {
    const newCategory = row.media_category || detectCategory(row.filename)
    const newPrefix = buildLegacyPrefix(newCategory, row.created_at)
    const newFilename = buildUniqueFilename({
      filename: row.filename,
      id: row.id,
      prefix: newPrefix,
      usedNamesByPrefix,
    })

    return {
      id: row.id,
      oldCategory: row.media_category || 'general',
      newCategory,
      oldFilename: row.filename,
      newFilename,
      oldPrefix: row.prefix || '',
      newPrefix,
      oldKey: row.prefix ? `${row.prefix}/${row.filename}` : row.filename,
      newKey: `${newPrefix}/${newFilename}`,
      oldUrl: row.url || '',
      newUrl: `${publicBaseUrl}/${newPrefix}/${newFilename}`,
    }
  })
}

function buildRowMapping(row, publicBaseUrl) {
  const newCategory = row.media_category || detectCategory(row.filename)
  const newPrefix = buildLegacyPrefix(newCategory, row.created_at)
  const newFilename = normalizeLegacyFilename(row.filename, row.id)

  return {
    id: row.id,
    oldCategory: row.media_category || 'general',
    newCategory,
    oldFilename: row.filename,
    newFilename,
    oldPrefix: row.prefix || '',
    newPrefix,
    oldKey: row.prefix ? `${row.prefix}/${row.filename}` : row.filename,
    newKey: `${newPrefix}/${newFilename}`,
    oldUrl: row.url || '',
    newUrl: `${publicBaseUrl}/${newPrefix}/${newFilename}`,
  }
}

function buildLegacyPrefix(category, createdAt) {
  const date = createdAt ? new Date(createdAt) : new Date()
  const year = String(date.getUTCFullYear())
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')

  return `${category}/${year}/${month}`
}

function normalizeLegacyFilename(filename, id) {
  const dotIndex = filename.lastIndexOf('.')
  const rawBase = dotIndex > 0 ? filename.slice(0, dotIndex) : filename
  const rawExtension = dotIndex > 0 ? filename.slice(dotIndex + 1) : ''
  const baseWithoutSyntheticSuffix = rawBase.replace(new RegExp(`-${id}$`), '')
  const base = slugify(baseWithoutSyntheticSuffix) || 'file'
  const extension = slugify(rawExtension).toLowerCase()

  return extension ? `${base}.${extension}` : base
}

function buildUniqueFilename({ filename, id, prefix, usedNamesByPrefix }) {
  const desiredFilename = normalizeLegacyFilename(filename, id)
  const dotIndex = desiredFilename.lastIndexOf('.')
  const base = dotIndex > 0 ? desiredFilename.slice(0, dotIndex) : desiredFilename
  const extension = dotIndex > 0 ? desiredFilename.slice(dotIndex + 1) : ''
  const key = prefix

  if (!usedNamesByPrefix.has(key)) {
    usedNamesByPrefix.set(key, new Set())
  }

  const usedNames = usedNamesByPrefix.get(key)
  let candidate = desiredFilename
  let counter = 2

  while (usedNames.has(candidate)) {
    candidate = extension ? `${base}-${counter}.${extension}` : `${base}-${counter}`
    counter += 1
  }

  usedNames.add(candidate)

  return candidate
}

function detectCategory(filename) {
  const value = filename.toLowerCase()

  if (value.includes('logo') || value.includes('favicon')) return 'branding'
  if (value.includes('juneoffers') || value.includes('offer')) return 'promotions'
  if (
    value.includes('diagnostico') ||
    value.includes('conservative') ||
    value.includes('odontopediatria') ||
    value.includes('aesthetic') ||
    value.includes('surgery') ||
    value.includes('dental_implants')
  ) {
    return 'services'
  }
  if (
    value.includes('kristina') ||
    value.includes('blanca') ||
    value.includes('lilian') ||
    value.includes('lana') ||
    value.includes('alla') ||
    value.includes('natalia') ||
    value.includes('oksana')
  ) {
    return 'team'
  }
  if (
    value.includes('main') ||
    value.includes('advantages') ||
    value.includes('about_us') ||
    value.includes('philosophy') ||
    value.includes('galery') ||
    value.includes('404')
  ) {
    return 'site'
  }

  return 'general'
}

function loadEnv(filePath) {
  const result = {}

  if (!fs.existsSync(filePath)) {
    return result
  }

  const content = fs.readFileSync(filePath, 'utf8')

  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()
    result[key] = stripQuotes(value)
  }

  return result
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, '')
}

function normalizeEndpoint(value) {
  if (!value) return ''

  try {
    const url = new URL(value)
    return `${url.protocol}//${url.host}`
  } catch {
    return stripTrailingSlash(value)
  }
}

function encodeCopySource(key) {
  return key
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}

async function objectExists(key) {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )

    return true
  } catch {
    return false
  }
}

async function ensureObjectExists(key) {
  if (!(await objectExists(key))) {
    throw new Error(`R2 object not found: ${key}`)
  }
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function guessContentType(filename) {
  const value = filename.toLowerCase()

  if (value.endsWith('.jpg') || value.endsWith('.jpeg')) return 'image/jpeg'
  if (value.endsWith('.png')) return 'image/png'
  if (value.endsWith('.svg')) return 'image/svg+xml'
  if (value.endsWith('.webp')) return 'image/webp'
  if (value.endsWith('.gif')) return 'image/gif'

  return undefined
}
