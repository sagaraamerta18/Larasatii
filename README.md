# Website Ulang Tahun — Panduan Setup

## 1. Struktur project
```
/
├── index.html          Page 1 — landing
├── countdown.html       Page 2 — countdown & gift reveal
├── hub.html              Page 3 — galeri, dropdown menu
├── assets/
│   ├── css/style.css
│   ├── js/countdown.js
│   ├── js/hub.js
│   └── photos/          ← taruh foto asli di sini
└── data/
    ├── photos.json      ← daftar nama file foto
    └── quotes.json       ← daftar teks ucapan
```

## 2. Menambahkan foto asli
1. Copy foto ke folder `assets/photos/`.
2. Beri nama sesuai `data/photos.json` (default: `1.jpg`, `2.jpg`, ... `10.jpg`), **atau**
   edit `data/photos.json` supaya `src` mengarah ke nama file Anda yang sebenarnya.
3. Kalau foto belum ada / nama tidak cocok, halaman otomatis menampilkan kartu placeholder
   gradient pink (tidak error/blank).

Tambah/kurangi jumlah foto: tinggal tambah/hapus entri di `data/photos.json`, tidak perlu ubah kode.

## 3. Mengubah ucapan
Edit teks di `data/quotes.json`, tambah/kurangi entri sesuai kebutuhan.

## 4. Mengubah tanggal target countdown
Buka `assets/js/countdown.js`, baris pertama:
```js
const TARGET_DATE = new Date('2026-10-01T00:00:00+07:00');
```
Ubah tahun/tanggal sesuai kebutuhan. Format harus tetap ISO dengan offset `+07:00` (WIB).
