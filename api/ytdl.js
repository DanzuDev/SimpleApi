import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Parameter ?url= wajib diisi' });
  }

  try {
    // Ambil token CSRF dari Clipto
    const csrfRes = await axios.get('https://www.clipto.com/api/csrf', {
      headers: {
        'referer': 'https://www.clipto.com/id/media-downloader/youtube-downloader',
        'user-agent': 'Mozilla/5.0',
        'accept': 'application/json',
      }
    });

    const csrftoken = csrfRes.data.token;
    const cookies = `XSRF-TOKEN=${csrftoken};`;

    // Kirim POST ke Clipto untuk proses download
    const downloadRes = await axios.post('https://www.clipto.com/api/youtube', { url }, {
      headers: {
        'cookie': cookies,
        'origin': 'https://www.clipto.com',
        'referer': 'https://www.clipto.com/id/media-downloader/youtube-downloader',
        'x-xsrf-token': csrftoken,
        'user-agent': 'Mozilla/5.0',
        'content-type': 'application/json',
        'accept': 'application/json',
      }
    });

    const data = downloadRes.data;

    if (!data || !data.streams) {
      return res.status(500).json({ error: 'Gagal mengambil data dari Clipto' });
    }

    res.status(200).json({
      status: 'success',
      title: data.title,
      thumbnail: data.thumbnail,
      duration: data.duration,
      download: data.streams.map(stream => ({
        format: stream.format,
        quality: stream.quality,
        size: stream.size,
        url: stream.url
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil video', detail: error.message });
  }
}
