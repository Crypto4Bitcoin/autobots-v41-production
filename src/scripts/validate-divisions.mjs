import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const divisionsFile = path.join(root, 'src', 'lib', 'divisions.ts');
const source = fs.readFileSync(divisionsFile, 'utf8');
const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);

const missing = slugs.filter((slug) => {
    // Check both src/app/... and src/app/(brains)/...
    return !fs.existsSync(path.join(root, 'src', 'app', slug, 'page.tsx')) && 
           !fs.existsSync(path.join(root, 'src', 'app', '(brains)', slug, 'page.tsx'));
});

if (missing.length) {
  console.error('Missing route page for divisions:', missing.join(', '));
  process.exit(1);
}

console.log(`Validated ${slugs.length} division routes.`);
