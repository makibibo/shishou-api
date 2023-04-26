// const axios = require('axios');
const { gotScraping } = require('got-scraping');
const format_array = [
    "title",
    "image",
    "author",
    "genre",
    "status",
    "description"
]

async function get_page(url) {
    return gotScraping
        .get({
            url: url,
            headerGeneratorOptions: {
                browsers: [
                    {
                        name: 'chrome',
                        minVersion: 87,
                        maxVersion: 89
                    }
                ],
                devices: ['mobile'],
                locales: ['de-DE', 'en-US'],
                operatingSystems: ['android'],
            }
        })
        .then(({ body }) => {
            return body
        })


}

async function get_pageXML(url) {
    return gotScraping
        .get({
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 Edg/107.0.1418.62",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        .then(({ body }) => {
            return body
        })


}

async function get_page1(url) {
    const myURL = new URL(url);
    try {
        const response = await axios.get(url,
            {
                headers: {
                    //'Content-Type': 'text/html; charset=utf-8',
                    'Accept-Encoding': "application/json",
                    "sec-ch-ua": '"Microsoft Edge";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": '"Android"',
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 Edg/107.0.1418.62"
                }
            });
        // console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}





module.exports = { get_page, get_pageXML, format_array }
