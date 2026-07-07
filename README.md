# Xdigma Website Design Catalog

Katalog bilingual untuk pilihan desain website Xdigma. Website ini berfungsi
sebagai etalase desain: client melihat preview, memilih arah desain, lalu
menghubungi Xdigma untuk custom website final.

Website bersifat statis, dapat dipasang di GitHub Pages, dan tidak membutuhkan
database.

## Cara kerjanya

Setiap desain mempunyai satu `template.json`. Script build membaca seluruh
manifest tersebut, memvalidasinya, lalu menghasilkan `data/templates.json` yang
digunakan website katalog.

Jangan mengedit `data/templates.json` secara manual.

```text
template-arunika/
├── index.html
└── template.json

templates/
└── desain-baru/
    ├── index.html
    ├── thumbnail.webp
    └── template.json
```

## Menambahkan desain baru

Versi paling gampangnya:

```text
1. Jalankan npm run new-template
2. Isi data desain di terminal
3. Masukkan file preview website ke folder desain yang dibuat
4. Jalankan npm run build:catalog
5. Push ke GitHub
```

Pastikan Node.js versi 20 atau lebih baru sudah tersedia, kemudian jalankan:

```bash
npm run new-template
```

Form terminal akan menanyakan:

- Nama dan slug desain.
- Gratis atau premium.
- Kategori, tipe, dan style.
- Deskripsi Bahasa Indonesia dan Inggris.
- Harga untuk desain premium jika ingin ditampilkan.
- Link order/WhatsApp untuk tombol **Pilih desain ini**.
- Status `draft` atau `published`.

Perintah tersebut membuat folder baru di `templates/<slug>/` dan langsung
memperbarui data katalog.

Contoh pengisian:

```text
Nama desain: Website Laundry
Slug: website-laundry
Akses: paid
Kategori: bisnis
Tipe: landing-page
Styles: clean, modern
Deskripsi ID: Landing page modern untuk jasa laundry.
Deskripsi EN: Modern landing page for laundry services.
Featured: n
Status: published
Accent: #ff3b30
Harga: 150000
Link order/WhatsApp: https://wa.me/628131770613
```

Setelah form selesai, folder baru akan dibuat seperti ini:

```text
templates/
└── website-laundry/
    ├── index.html
    └── template.json
```

Kalau sudah punya file website/download template yang mau dijadikan preview,
masukkan semua file preview ke folder tersebut. Contohnya:

```text
templates/
└── website-laundry/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── thumbnail.webp
    ├── template.json
    └── assets/
        └── hero.webp
```

Lalu:

1. Ganti starter `index.html` dengan halaman preview final.
2. Tambahkan `thumbnail.webp`.
3. Isi field `thumbnail` di `template.json`, misalnya
   `./templates/nama-desain/thumbnail.webp`.
4. Jalankan pemeriksaan:

```bash
npm run build:catalog
npm run check:catalog
```

Kalau tidak ada error, desain baru sudah masuk ke katalog.

## Tombol katalog

Card katalog tidak menampilkan tombol **Source Code**. Tombol yang dipakai:

```text
Live Preview      → membuka demo desain
Pilih desain ini  → membuka WhatsApp/order
```

Field yang dipakai untuk tombol order adalah:

```json
{
  "orderUrl": "https://wa.me/628131770613?text=Halo%20Xdigma..."
}
```

## Gratis dan premium

Field `access` masih bisa memakai `free` atau `paid`, tetapi di katalog ini
artinya hanya untuk pengelompokan desain/paket. Katalog tidak dipakai untuk
menjual ulang source template.

Penting: file yang dipakai untuk live preview tetap bisa dilihat orang lewat
browser. Jadi kalau memakai aset/template pihak ketiga, masukkan hanya versi
preview yang memang aman dipublikasikan dan tetap patuhi license dari author
aslinya.

Jika harga premium belum ingin ditampilkan, gunakan:

```json
{
  "price": null
}
```

Kartu katalog akan menampilkan “Tanya harga” atau “Ask for price”.

## Catatan lisensi template pihak ketiga

Kalau desain awal berasal dari template pihak ketiga:

```text
1. Cek license/README dari author asli.
2. Pastikan boleh dipakai untuk commercial/client work.
3. Jangan klaim template mentah sebagai karya original Xdigma.
4. Jangan tampilkan tombol download/source code.
5. Gunakan sebagai arah desain yang akan dicustom menjadi website final client.
```

Jika license tidak jelas, lebih aman skip atau rebuild sendiri dengan karakter
Xdigma.

## Workflow GitHub yang disarankan

```bash
git switch -c design/nama-desain
npm run new-template
npm run check:catalog
git add .
git commit -m "Add nama desain"
git push -u origin design/nama-desain
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
npm run new-template    # Membuat desain baru melalui form terminal
npm run build:catalog   # Menghasilkan data/templates.json
npm run check:catalog   # Validasi tanpa mengubah file
```
