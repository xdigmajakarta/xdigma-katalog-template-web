import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { spawnSync } from "node:child_process";
import { stdin as input, stdout as output } from "node:process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "data", "templates.json");
const terminal = createInterface({ input, output });

const ask = async (question, defaultValue = "") => {
  const suffix = defaultValue ? ` (${defaultValue})` : "";
  const answer = (await terminal.question(`${question}${suffix}: `)).trim();
  return answer || defaultValue;
};

const choose = async (question, options, defaultValue) => {
  while (true) {
    const answer = (await ask(`${question} [${options.join("/")}]`, defaultValue))
      .toLowerCase();

    if (options.includes(answer)) {
      return answer;
    }

    console.log(`Pilih salah satu: ${options.join(", ")}`);
  }
};

const confirm = async (question, defaultValue = false) => {
  const answer = await choose(question, ["y", "n"], defaultValue ? "y" : "n");
  return answer === "y";
};

const makeSlug = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const catalog = JSON.parse(await readFile(catalogPath, "utf8").catch(() => "{}"));
const highestId = Math.max(
  0,
  ...(catalog.templates ?? []).map((template) => {
    const match = template.id?.match(/\d+$/);
    return match ? Number(match[0]) : 0;
  }),
);

console.log("\nTambah template baru ke Xdigma Catalog\n");

const name = await ask("Nama template");
const slug = await ask("Slug", makeSlug(name));
const accessType = await choose("Akses", ["free", "paid"], "free");
const category = await ask("Kategori", "portfolio");
const templateType = await ask("Tipe", "landing-page");
const styles = (await ask("Style, pisahkan dengan koma", "modern"))
  .split(",")
  .map((style) => makeSlug(style.trim()))
  .filter(Boolean);
const descriptionId = await ask("Deskripsi Bahasa Indonesia");
const descriptionEn = await ask("English description");
const featured = await confirm("Jadikan featured?", false);
const status = await choose("Status", ["draft", "published"], "published");
const accent = await ask("Warna aksen HEX", "#E13B32");
const id = `XD-TMP-${String(highestId + 1).padStart(3, "0")}`;
const relativeDirectory = `templates/${slug}`;
const templateDirectory = path.join(root, relativeDirectory);
const previewUrl = `./${relativeDirectory}/index.html`;

let price = 0;
let sourceUrl = previewUrl;
let purchaseUrl = "";

if (accessType === "free") {
  sourceUrl = await ask("Link source/download", previewUrl);
} else {
  const priceInput = await ask("Harga IDR, kosongkan jika belum ditampilkan");
  price = priceInput ? Number(priceInput.replace(/\D/g, "")) : null;
  sourceUrl = "";
  purchaseUrl = await ask(
    "Link pembelian",
    `https://wa.me/628131770613?text=${encodeURIComponent(
      `Halo Xdigma, saya tertarik dengan template ${name}.`,
    )}`,
  );
}

const manifest = {
  id,
  order: highestId + 1,
  slug,
  name,
  access: accessType,
  price,
  currency: "IDR",
  category: makeSlug(category),
  styles,
  type: makeSlug(templateType),
  featured,
  status,
  description: {
    id: descriptionId,
    en: descriptionEn,
  },
  previewUrl,
  thumbnail: "",
  accent,
  sourceUrl,
  purchaseUrl,
};

const starterHtml = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        display: grid;
        min-height: 100vh;
        margin: 0;
        padding: 32px;
        color: #f6f6f4;
        background: #0a0a0a;
        font-family: system-ui, sans-serif;
        place-items: center;
        text-align: center;
      }
      h1 { margin: 0; font-size: clamp(3rem, 10vw, 8rem); line-height: .9; }
      p { color: #a6a39d; }
      a { color: #e13b32; }
    </style>
  </head>
  <body>
    <main>
      <p>${id}</p>
      <h1>${name}</h1>
      <p>Ganti halaman starter ini dengan kode template final.</p>
      <a href="../../index.html">Kembali ke katalog</a>
    </main>
  </body>
</html>
`;

try {
  await mkdir(path.dirname(templateDirectory), { recursive: true });
  await mkdir(templateDirectory);
  await writeFile(
    path.join(templateDirectory, "template.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  await writeFile(path.join(templateDirectory, "index.html"), starterHtml);
} catch (error) {
  terminal.close();
  console.error(`\nGagal membuat template: ${error.message}`);
  process.exit(1);
}

terminal.close();

const buildResult = spawnSync(
  process.execPath,
  [path.join(root, "scripts", "build-catalog.mjs")],
  { cwd: root, stdio: "inherit" },
);

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1);
}

console.log(`\nSelesai. Template dibuat di ${relativeDirectory}/`);
console.log("Berikutnya: ganti index.html dan tambahkan thumbnail.webp.");
