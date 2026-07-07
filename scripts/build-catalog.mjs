import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "data", "templates.json");
const checkOnly = process.argv.includes("--check");
const ignoredDirectories = new Set([
  ".git",
  ".github",
  "data",
  "node_modules",
  "scripts",
]);

const fileExists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const findManifests = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const manifests = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || ignoredDirectories.has(entry.name)) {
      continue;
    }

    const childDirectory = path.join(directory, entry.name);
    const manifestPath = path.join(childDirectory, "template.json");

    if (await fileExists(manifestPath)) {
      manifests.push(manifestPath);
    }

    manifests.push(...(await findManifests(childDirectory)));
  }

  return manifests;
};

const assert = (condition, message, errors) => {
  if (!condition) {
    errors.push(message);
  }
};

const validateLocalFile = async (url, label, manifestPath, errors) => {
  if (!url?.startsWith("./")) {
    return;
  }

  const absolutePath = path.join(root, url.slice(2));
  assert(
    await fileExists(absolutePath),
    `${label} tidak ditemukan: ${url} (${path.relative(root, manifestPath)})`,
    errors,
  );
};

const validateManifest = async (template, manifestPath) => {
  const errors = [];
  const location = path.relative(root, manifestPath);
  const requiredStrings = [
    "id",
    "slug",
    "name",
    "access",
    "category",
    "type",
    "status",
    "previewUrl",
    "orderUrl",
  ];

  for (const field of requiredStrings) {
    assert(
      typeof template[field] === "string" && template[field].trim(),
      `${location}: field "${field}" wajib diisi.`,
      errors,
    );
  }

  assert(
    /^XD-TMP-\d{3,}$/.test(template.id ?? ""),
    `${location}: id harus memakai format XD-TMP-001.`,
    errors,
  );
  assert(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(template.slug ?? ""),
    `${location}: slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.`,
    errors,
  );
  assert(
    ["free", "paid"].includes(template.access),
    `${location}: access harus "free" atau "paid".`,
    errors,
  );
  assert(
    ["draft", "published"].includes(template.status),
    `${location}: status harus "draft" atau "published".`,
    errors,
  );
  assert(
    typeof template.description?.id === "string" &&
      template.description.id.trim() &&
      typeof template.description?.en === "string" &&
      template.description.en.trim(),
    `${location}: description.id dan description.en wajib diisi.`,
    errors,
  );
  assert(
    Array.isArray(template.styles),
    `${location}: styles harus berupa array.`,
    errors,
  );
  assert(
    typeof template.featured === "boolean",
    `${location}: featured harus berupa boolean.`,
    errors,
  );

  if (template.access === "paid") {
    assert(
      template.price === null ||
        (typeof template.price === "number" && template.price >= 0),
      `${location}: price harus angka positif atau null jika harga belum ditampilkan.`,
      errors,
    );
  }

  await validateLocalFile(template.previewUrl, "Preview", manifestPath, errors);
  await validateLocalFile(template.thumbnail, "Thumbnail", manifestPath, errors);

  return errors;
};

const manifestPaths = await findManifests(root);
const templates = [];
const errors = [];
const ids = new Set();
const slugs = new Set();

for (const manifestPath of manifestPaths) {
  let template;

  try {
    template = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    errors.push(
      `${path.relative(root, manifestPath)} tidak dapat dibaca: ${error.message}`,
    );
    continue;
  }

  errors.push(...(await validateManifest(template, manifestPath)));

  if (ids.has(template.id)) {
    errors.push(`ID duplikat ditemukan: ${template.id}`);
  }
  if (slugs.has(template.slug)) {
    errors.push(`Slug duplikat ditemukan: ${template.slug}`);
  }

  ids.add(template.id);
  slugs.add(template.slug);

  if (template.status === "published") {
    templates.push(template);
  }
}

if (!manifestPaths.length) {
  errors.push("Tidak ada template.json yang ditemukan.");
}

if (errors.length) {
  console.error("\nCatalog validation gagal:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

templates.sort(
  (a, b) =>
    (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER) ||
    a.name.localeCompare(b.name),
);

const output = `${JSON.stringify({ version: 1, templates }, null, 2)}\n`;

if (checkOnly) {
  const existingOutput = await readFile(outputPath, "utf8").catch(() => "");

  if (existingOutput !== output) {
    console.error(
      'data/templates.json belum sinkron. Jalankan "npm run build:catalog".',
    );
    process.exit(1);
  }

  console.log(`Catalog valid: ${templates.length} template published.`);
} else {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output);
  console.log(`Catalog dibuat: ${templates.length} template published.`);
}
