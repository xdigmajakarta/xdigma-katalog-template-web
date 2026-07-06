# Xdigma Template Catalog

Katalog bilingual untuk produk template website gratis dan premium. Website
bersifat statis, dapat dipasang di GitHub Pages, dan tidak membutuhkan database.

## Cara kerjanya

Setiap template mempunyai satu `template.json`. Script build membaca seluruh
manifest tersebut, memvalidasinya, lalu menghasilkan `data/templates.json` yang
digunakan website katalog.

Jangan mengedit `data/templates.json` secara manual.

```text
folder-template-1/
├── index.html
└── template.json

templates/
└── template-baru/
    ├── index.html
    ├── thumbnail.webp
    └── template.json
```

## Menambahkan template

Pastikan Node.js versi 20 atau lebih baru sudah tersedia, kemudian jalankan:

```bash
npm run new-template
```

Form terminal akan menanyakan:

- Nama dan slug template.
- Gratis atau premium.
- Kategori, tipe, dan style.
- Deskripsi Bahasa Indonesia dan Inggris.
- Harga serta tautan pembelian untuk template premium.
- Status `draft` atau `published`.

Perintah tersebut membuat folder baru di `templates/<slug>/` dan langsung
memperbarui data katalog.

Setelah itu:

1. Ganti starter `index.html` dengan template final.
2. Tambahkan `thumbnail.webp`.
3. Isi field `thumbnail` di `template.json`, misalnya
   `./templates/nama-template/thumbnail.webp`.
4. Jalankan pemeriksaan:

```bash
npm run build:catalog
npm run check:catalog
```

## Gratis dan premium

Template gratis harus mempunyai `sourceUrl`. Nilainya dapat berupa file ZIP,
GitHub Release, repository publik, atau file HTML mandiri.

Template premium harus mempunyai `purchaseUrl`. Source template premium jangan
dimasukkan ke repository publik ini. Simpan source aslinya di repository private
terpisah.

Jika harga premium belum ingin ditampilkan, gunakan:

```json
{
  "price": null
}
```

Kartu katalog akan menampilkan “Tanya harga” atau “Ask for price”.

## Workflow GitHub yang disarankan

```bash
git switch -c template/nama-template
npm run new-template
npm run check:catalog
git add .
git commit -m "Add nama template"
git push -u origin template/nama-template
```

Setelah itu buat Pull Request di GitHub. Workflow `Validate template catalog`
akan memeriksa manifest dan data katalog. Setelah Pull Request digabungkan ke
`main`, workflow `Deploy catalog to GitHub Pages` akan melakukan build dan
deploy otomatis.

## Mengaktifkan GitHub Pages

Di repository GitHub:

1. Buka **Settings → Pages**.
2. Pada **Build and deployment**, pilih **GitHub Actions**.
3. Push atau merge perubahan ke branch `main`.
4. Lihat prosesnya pada tab **Actions**.

## Perintah tersedia

```bash
npm run new-template    # Membuat template baru melalui form terminal
npm run build:catalog   # Menghasilkan data/templates.json
npm run check:catalog   # Validasi tanpa mengubah file
```
