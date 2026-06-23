type LexicalNode = {
  type?: unknown
  text?: unknown
  children?: unknown
  [key: string]: unknown
}

type LexicalDocument = {
  root?: LexicalNode
}

function makeTextNode(text: string) {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  }
}

function makeParagraphNode(text: string) {
  return {
    type: 'paragraph',
    children: [makeTextNode(text)],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
    textFormat: 0,
    textStyle: '',
  }
}

export function makeLexicalFromPlainText(template: string) {
  const paragraphs = template
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => makeParagraphNode(paragraph))

  return {
    root: {
      type: 'root',
      children: paragraphs.length ? paragraphs : [makeParagraphNode('')],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function extractPlainText(value: unknown): string {
  if (typeof value === 'string') return value

  if (Array.isArray(value)) {
    return value.map(extractPlainText).filter(Boolean).join('\n')
  }

  if (value && typeof value === 'object') {
    const node = value as LexicalNode

    if (typeof node.text === 'string') return node.text
    if (Array.isArray(node.children)) {
      return node.children.map(extractPlainText).filter(Boolean).join('\n')
    }
  }

  return ''
}

function isValidLexicalNode(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false

  const node = value as LexicalNode

  if (typeof node.type !== 'string') return false

  if (node.type === 'text') {
    return typeof node.text === 'string'
  }

  if ('children' in node) {
    return Array.isArray(node.children) && node.children.every(isValidLexicalNode)
  }

  return true
}

function isValidLexicalDocument(value: unknown): value is LexicalDocument {
  if (!value || typeof value !== 'object') return false

  const doc = value as LexicalDocument
  if (!doc.root || typeof doc.root !== 'object') return false

  const root = doc.root as LexicalNode
  if (root.type !== 'root') return false
  if (!Array.isArray(root.children)) return false

  return root.children.every(isValidLexicalNode)
}

export function normalizeLexicalValue(value: unknown) {
  if (!value) {
    return {
      root: {
        type: 'root',
        children: [makeParagraphNode('')],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  if (isValidLexicalDocument(value)) {
    return value
  }

  const plainText = extractPlainText(value)
  return makeLexicalFromPlainText(plainText)
}
