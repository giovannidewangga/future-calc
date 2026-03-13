# Simulasi Nilai Pensiun

Kalkulator untuk mensimulasikan daya beli uang pensiun di masa depan, dibandingkan dengan nilai emas dan konteks harga nyata.

## Struktur Project

```
/
├── index.html       ← Frontend kalkulator
├── api/
│   └── gold.js      ← Serverless proxy (fetch harga Antam)
├── vercel.json      ← Konfigurasi Vercel
└── README.md
```

## Deploy ke GitHub + Vercel

### Langkah 1 — Push ke GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

### Langkah 2 — Connect ke Vercel

1. Buka [vercel.com](https://vercel.com) → Login dengan akun GitHub
2. Klik **"Add New Project"**
3. Pilih repository ini → Klik **"Deploy"**
4. Selesai — Vercel otomatis detect `vercel.json`

### Cara kerja

- `index.html` di-serve sebagai static file
- `/api/gold` → `api/gold.js` berjalan sebagai serverless function
- Serverless function scrape harga dari `logammulia.com` lalu return JSON
- Jika scraping gagal, otomatis fallback ke harga hardcode terakhir
- Cache 1 jam (`s-maxage=3600`) — tidak overload server Antam

### Update harga fallback

Jika ingin update harga fallback manual, edit baris ini di `api/gold.js`:

```js
harga_per_gram: 3042000,   // ← ganti angka ini
tanggal: '13 Maret 2026',  // ← ganti tanggal ini
```

Dan di `index.html`:

```js
var HEMAS = 3042000;
var HEMAS_TANGGAL = '13 Maret 2026';
```
