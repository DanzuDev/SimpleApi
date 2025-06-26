import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Parameter ?url= wajib diisi' });
  }

  try {
    const csrfres = await axios.get('https://www.clipto.com/api/csrf', {
      headers: {
        'referer': 'https://www.clipto.com/id/media-downloader/youtube-downloader',
        'user-agent': 'Mozilla/5.0',
        'accept': 'application/json',
      }
    });

    const csrftoken = csrfres.data.token;
    const cookies = `XSRF-TOKEN=${csrftoken};`;

    const dres = await axios.post('https://www.clipto.com/api/youtube', {
      url: url
    }, {
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

    res.status(200).json(dres.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
