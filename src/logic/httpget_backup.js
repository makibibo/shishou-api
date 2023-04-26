const https = require('https');
const cheerio = require("cheerio");
const fs = require("fs");
const getPage = require('./method');
const url = "https://novelbin.net/sort/update/";


async function scrapeData() {
    const novel = [];
    try {
        const web = getPage.get_page(url);
        console.log(web);
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const $ = cheerio.load(data);
                const listItems = $(".list-novel .row");

                listItems.each((idx, el) => {
                    const country = { title: "", image: "" };
                    country.image = $(el).children(".col-xs-3").children("div").children(".cover").attr('src');
                    country.title = $(el).children(".col-xs-7").children("div").children(".novel-title").children("a").attr('title');
                    novel.push(country);

                });

            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
        return novel;


    } catch (err) {
        console.error(err);
    }
}

module.exports = scrapeData()