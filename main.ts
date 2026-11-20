import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const src = join(here, 'entry.png');
if (!existsSync(src)) throw new Error('missing entry.png');
function verifyOutputSize(file: string): number {
  const bytes = statSync(file).size;
  if (bytes <= 0 || bytes > 1048576) throw new Error(`invalid size: ${bytes}`);
  return bytes;
}
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(out, { recursive: true });
copyFileSync(src, join(out, 'entry.png'));
process.stdout.write(`wrote ${join(out, 'entry.png')} (${verifyOutputSize(src)} bytes)\n`);
