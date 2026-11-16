import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const collections = ['projects', 'tools', 'notebook', 'pages', 'cv'];
const errors = [];
const records = Object.fromEntries(collections.map((name) => [name, []]));
const globalIds = new Map();

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) return walk(full);
    return /\.(md|mdx)$/i.test(item.name) ? [full] : [];
  });
}

for (const collection of collections) {
  const dir = path.join(root, 'src', 'content', collection);
  for (const file of walk(dir)) {
    try {
      const parsed = matter(fs.readFileSync(file, 'utf8'));
      const data = parsed.data ?? {};
      if (!data.id || typeof data.id !== 'string') errors.push(`${path.relative(root, file)}: missing string id`);
      if (!data.title || typeof data.title !== 'string') errors.push(`${path.relative(root, file)}: missing title`);
      records[collection].push({ file, data });
      if (typeof data.id === 'string' && globalIds.has(data.id)) errors.push(`duplicate global id \"${data.id}\" in ${path.relative(root, file)} and ${path.relative(root, globalIds.get(data.id))}`);
      else if (typeof data.id === 'string') globalIds.set(data.id, file);
      if (collection === 'pages' && (!data.slug || typeof data.slug !== 'string')) errors.push(`${path.relative(root, file)}: pages require a slug`);
      if (collection === 'cv' && !['education','experience','research','publication','award','certification', 'skill', 'leadership', 'reference'].includes(data.section)) errors.push(`${path.relative(root, file)}: invalid CV section`);
    } catch (error) {
      errors.push(`${path.relative(root, file)}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  const ids = new Map();
  const slugs = new Map();
  for (const record of records[collection]) {
    const { id, slug } = record.data;
    if (ids.has(id)) errors.push(`${collection}: duplicate id "${id}" in ${path.relative(root, record.file)} and ${path.relative(root, ids.get(id))}`);
    else ids.set(id, record.file);
    const effectiveSlug = slug ?? path.relative(path.join(root, 'src', 'content', collection), record.file).replace(/\.(md|mdx)$/i, '');
    if (effectiveSlug) {
      if (slugs.has(effectiveSlug)) errors.push(`${collection}: duplicate effective slug "${effectiveSlug}"`);
      else slugs.set(effectiveSlug, record.file);
    }
  }
}

// Validate explicit custom-page routes and cross-collection references.
const reservedSlugs = new Set(['projects', 'tools', 'notebook', 'cv', 'search']);
for (const record of records.pages) {
  const firstSegment = String(record.data.slug ?? '').split('/')[0];
  if (reservedSlugs.has(firstSegment)) errors.push(`pages: slug "${record.data.slug}" conflicts with a built-in route`);
}
const projectIds = new Set(records.projects.filter((item) => item.data.draft !== true).map((item) => item.data.id));
const noteIds = new Set(records.notebook.filter((item) => item.data.draft !== true).map((item) => item.data.id));
for (const record of records.notebook.filter((item) => item.data.draft !== true)) {
  for (const id of record.data.relatedProjects ?? []) if (!projectIds.has(id)) errors.push(`${path.relative(root, record.file)}: relatedProjects references unknown or unpublished project id "${id}"`);
  for (const id of record.data.relatedNotes ?? []) if (!noteIds.has(id)) errors.push(`${path.relative(root, record.file)}: relatedNotes references unknown or unpublished note id "${id}"`);
}

const moduleRoot = path.join(root, 'src', 'interactive');
if (fs.existsSync(moduleRoot)) {
  for (const item of fs.readdirSync(moduleRoot, { withFileTypes: true })) {
    if (!item.isDirectory()) continue;
    const manifestPath = path.join(moduleRoot, item.name, 'manifest.json');
    const clientPath = path.join(moduleRoot, item.name, 'client.ts');
    if (!fs.existsSync(manifestPath)) errors.push(`interactive/${item.name}: missing manifest.json`);
    else {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        if (manifest.id !== item.name) errors.push(`interactive/${item.name}: manifest id must match directory name`);
      } catch (error) { errors.push(`interactive/${item.name}: invalid manifest.json (${error})`); }
    }
    if (!fs.existsSync(clientPath)) errors.push(`interactive/${item.name}: missing client.ts`);
  }
}

const moduleIds = new Set();
if (fs.existsSync(moduleRoot)) {
  for (const item of fs.readdirSync(moduleRoot, { withFileTypes: true })) {
    if (!item.isDirectory()) continue;
    const manifestPath = path.join(moduleRoot, item.name, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      try { moduleIds.add(JSON.parse(fs.readFileSync(manifestPath, 'utf8')).id); } catch { /* reported above */ }
    }
  }
}
for (const collection of ['projects', 'tools', 'notebook', 'pages']) {
  for (const record of records[collection]) {
    if (path.extname(record.file).toLowerCase() !== '.mdx') continue;
    const source = fs.readFileSync(record.file, 'utf8');
    for (const match of source.matchAll(/<Interactive\s+[^>]*?id=["']([^"']+)["']/g)) {
      if (!moduleIds.has(match[1])) errors.push(`${path.relative(root, record.file)}: Interactive references unknown module id "${match[1]}"`);
    }
  }
}

if (errors.length) {
  console.error('\nContent validation failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log('Content validation passed.');
for (const collection of collections) console.log(`  ${collection}: ${records[collection].filter((item) => item.data.draft !== true).length} published / ${records[collection].length} total record(s)`);
