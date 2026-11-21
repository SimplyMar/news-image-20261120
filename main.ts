import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1_048_576;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const here = fileURLToPath(new URL('.', import.meta.url));
const src = join(here, 'entry.png');

if (!existsSync(src)) {
  throw new Error(`missing entry.png at ${src}`);
}

function assertValidImageBytes(file: string): number {
  const bytes = statSync(file).size;
  if (bytes <= 0 || bytes > MAX_BYTES) {
    throw new Error(`entry.png size out of bounds: ${bytes} bytes (max ${MAX_BYTES})`);
  }
  const head = readFileSync(file).subarray(0, 8);
  if (!head.equals(PNG_MAGIC)) {
    throw new Error('entry.png does not begin with a valid PNG signature');
  }
  return bytes;
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'entry.png');
copyFileSync(src, dest);
const size = assertValidImageBytes(dest);
process.stdout.write(`wrote ${dest} (${size} bytes)\n`);
