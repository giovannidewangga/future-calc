export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  // Data historis harga emas Antam (rata-rata tahunan IDR/gram)
  // Sumber: logammulia.com, seputarforex.org, data publik
  const historis = {
    2005: 413000,
    2010: 588667,
    2015: 594667,
    2020: 978000,
  };

  function cagr(awal, akhir, tahun) {
    return Math.pow(akhir / awal, 1 / tahun) - 1;
  }

  try {
    const response = await fetch('https://www.logammulia.com/id/harga-emas-hari-ini', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'id-ID,id;q=0.9',
      },
    });

    const html = await response.text();
    const match =
      html.match(/1\s*gram[\s\S]{0,300}?([\d]{1,2}\.[\d]{3}\.[\d]{3})/i) ||
      html.match(/Rp\s*([\d]{1,2}\.[\d]{3}\.[\d]{3})/);

    if (match) {
      const harga = parseInt(match[1].replace(/\./g, ''));
      if (harga > 500000 && harga < 20000000) {
        const thn = new Date().getFullYear();
        return res.status(200).json({
          status: 'live',
          source: 'logammulia.com',
          harga_per_gram: harga,
          tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          historis: { ...historis, [thn]: harga },
          cagr: {
            n21: cagr(historis[2005], harga, thn - 2005),  // konservatif
            n16: cagr(historis[2010], harga, thn - 2010),  // moderat
            n11: cagr(historis[2015], harga, thn - 2015),  // agresif
          },
        });
      }
    }
    throw new Error('Parse gagal');

  } catch (err) {
    const harga = 3179000;
    const thn = 2026;
    return res.status(200).json({
      status: 'fallback',
      source: 'hardcode',
      harga_per_gram: harga,
      tanggal: '13 Maret 2026',
      error: err.message,
      historis: { ...historis, [thn]: harga },
      cagr: {
        n21: cagr(historis[2005], harga, 21),
        n16: cagr(historis[2010], harga, 16),
        n11: cagr(historis[2015], harga, 11),
      },
    });
  }
}
