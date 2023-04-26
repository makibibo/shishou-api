const axios = require('axios');
const { got, gotScraping } = require('got-scraping');
const format_array = [
    "title",
    "image",
    "author",
    "genre",
    "status",
    "description"
]

async function get_page(url) {
    try {
        const response = await gotScraping({
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
        });
        console.log(response.body);
        return response.body;
    } catch (error) {
        console.error(error);
    }
}

async function get_image(url) {
    try {
        const response = await gotScraping(url, { responseType: 'buffer' });
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function get_image1(url) {
    const myURL = new URL(url);
    try {
        const response = await axios.get({
            url: url,
            responseType: 'arraybuffer',
        });
        // console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
}





module.exports = { get_page, format_array, get_image }