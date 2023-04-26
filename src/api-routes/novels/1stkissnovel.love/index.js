const cheerio = require("cheerio");
const getPage = require('./method');


//-->templating
// title
// image
// author
// genre [array]
// status
// description



const obj = {
    "url": "https://1stkissnovel.love",
    "logo": "https://1stkissnovel.love/wp-content/uploads/2017/10/1STKISS_NOVEL.jpg",
    "title": "1st Kiss",
    "popular": "rating",
    "new": "new-manga",
    "hot": "trending",
    "updated": "latest-release-novels",
    "top_views": "views"

};


const genreNovel = "";

// const update = async () => {
//     const response = await gotScraping({
//         url: 'https://httpbin.org/get',
//         headerGeneratorOptions: {
//             browsers: [
//                 {
//                     name: 'chrome',
//                     minVersion: 87,
//                     maxVersion: 89
//                 }
//             ],
//             devices: ['mobile'],
//             locales: ['de-DE', 'en-US'],
//             operatingSystems: ['android'],
//         }
//     });
//     console.log(response.body);
// }


const update = async (typePages, pages = "1") => {
    const urlUpdate = obj.url + "/novel/?m_orderby=" + obj[typePages];
    const novel = [];
    try {
        const web = await getPage.get_page(urlUpdate);
        console.log(web);
        const $ = cheerio.load(web);
        const listItems = $("div.page-content-listing div.page-listing-item");

        listItems.each((idx, el) => {

            const anotherListing = $(el).children("div.row").children("div.badge-pos-1");
            anotherListing.each((idx, el) => {
                const data = { title: "", image: "", link: "" };
                data.title = $(el).children("div.page-item-detail").children("div.item-summary").children("div.post-title").children("h3").children("a").text()

                data.image = $(el).children("div.page-item-detail").children("div.item-thumb").children("a").children("img").attr('src');
                data.link = $(el).children("div.page-item-detail").children("div.item-summary").children("div.post-title").children("h3").children("a").attr('href');
                if (data.title) {
                    novel.push(data);
                }
            });

        });
        return novel;
    } catch (err) {
        console.error(err);
    }
}


const getNovel = async (url) => {
    const novel = [];
    try {
        const web = await getPage.get_page(url);
        const jsonFormatter = getPage.format_array;
        const $ = cheerio.load(web);
        const data = { title: "", image: "", description: "" };
        data.title = $("div.post-title").children("h1").text().trim();
        data.image = $("div.summary_image").children("a").children("img").attr("src");
        data.description = $("div.summary__content").text().trim();
        data.author = $("div.author-content a").text();
        data.status = $("div.post-status>div.post-content_item:nth-child(2)>div.summary-content").text().trim();
        const genrer = $("div.genres-content>a");
        let value = [];
        genrer.each((idx, el) => {
            value.push($(el).text());
        });
        data.genre = value;
        return data;
    } catch (err) {
        console.error(err);
    }
}

//{title : "", link : ""}
const getChapter = async (url) => {
    const novel = [];
    try {
        const web = await getPage.get_page(url);
        const $ = cheerio.load(web);

        const listItems = $("div.page-content-listing");
        console.log(listItems.text());
        listItems.each((idx, el) => {
            const data = { title: "", link: "", date: "" };
            data.link = $(el).children('a').attr('href');
            data.title = $(el).children('a').text().trim();
            data.date = $(el).children('div.chapter-release-date>i').text().trim();
            if (data.title) {
                novel.push(data);
            }
        });

        return novel.reverse();
    } catch (err) {
        console.error(err);
    }
}

const readChapter = async (url) => {
    const novel = [];
    try {
        const data = { chapterTitle: "", chapter: "", prev: "", next: "" };
        const web = await getPage.get_page(url);
        const $ = cheerio.load(web);
        data.chapterTitle = $('.chapter').text();
        data.chapter = $(".txt").text();
        data.prev = obj.url + $('#prev_url').attr('href');
        data.next = obj.url + $('#next_url').attr('href');

        //console.log(data.chapter);


        return data;
    } catch (err) {
        console.error(err);
    }
}
module.exports = { update, obj, getNovel, getChapter, readChapter }
