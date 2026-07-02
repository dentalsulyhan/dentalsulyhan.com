export function requireEnv(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getBooleanEnv(name: string, defaultValue: boolean) {
  const value = process.env[name]?.trim().toLowerCase()

  if (value === undefined || value === '') {
    return defaultValue
  }

  if (value === 'true') return true
  if (value === 'false') return false

  return defaultValue
}
