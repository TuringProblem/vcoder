import { readdirSync, existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir, onFile) {
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, dirent.name)
    if (dirent.isDirectory()) walk(p, onFile)
    else onFile(p)
  }
}

const removed = []
walk('src', (p) => {
  if (!p.endsWith('.js')) return
  const base = p.slice(0, -3)
  if (existsSync(base + '.ts') || existsSync(base + '.tsx')) {
    unlinkSync(p)
    removed.push(p)
  }
})

console.log(removed.length ? `Removed:\n${removed.join('\n')}` : 'No redundant .js files found')


