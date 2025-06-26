const axios = require('axios');

async function ytdl(url) {
    try {
        const csrfres = await axios.get('https://www.clipto.com/api/csrf', {
            headers: {
                'authority': 'www.clipto.com',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'referer': 'https://www.clipto.com/id/media-downloader/youtube-downloader',
                'sec-ch-ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
            }
        });
        
        const csrftoken = csrfres.data.token;
        const kuki = `NEXT_LOCALE=id; uu=89bf21d8ab064e72aef89e0669d8fa16; bucket=83; XSRF-TOKEN=${csrftoken}`;
        
        const dres = await axios.post('https://www.clipto.com/api/youtube', {
            url: url
        }, {
            headers: {
                'authority': 'www.clipto.com',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': 'application/json',
                'cookie': kuki,
                'origin': 'https://www.clipto.com',
                'referer': 'https://www.clipto.com/id/media-downloader/youtube-downloader',
                'sec-ch-ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
                'x-xsrf-token': csrftoken
            }
        });
        
        return dres.data;
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

module.exports = ytdl;
