import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const divisionsFile = path.join(root, 'src', 'lib', 'divisions.ts');
const source = fs.readFileSync(divisionsFile, 'utf8');

// Using the same list mapping logic as validate-divisions
const rows = [...source.matchAll(/slug:\s*'([^']+)',\s*name:\s*'([^']+)'/g)].map((match) => ({
  slug: match[1],
  name: match[2],
  description: "Synchronized division via v4 registry.",
}));

const sql = rows
  .map((row) => `insert into divisions (slug, name, description, grid_signature) values ('${row.slug}', '${row.name.replace(/'/g, "''")}', '${row.description}', '9x9x9') on conflict (slug) do update set name = excluded.name, description = excluded.description;`)
  .join('\n');

const outDir = path.join(root, 'src', 'db', 'seeds');
const outPath = path.join(outDir, 'generated_divisions.sql');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, sql);
console.log(`Wrote ${rows.length} division seed statements to ${outPath}`);
