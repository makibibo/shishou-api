const cheerio = require("cheerio");
const getPage = require('./method');

const obj = {
    "url": "https://www.manganato.com",
    "logo": "https://www.manganato.com/themes/hm/images/logo.png",
    "title": "Manganato",
    "popular": "&orby=topview",
    "updated": "",
    "new": "&orby=newest"
};

const fetch = require('node-fetch');

const option = {
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-G998N Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/111.0.5563.15 Mobile Safari/537.3',
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br"
    },
    body: null,
    redirect: 'follow',
    signal: null,
    follow: 20,
    compress: true,
}
const getFetch = async (url) => {
    const res = await fetch(url, option);
    return await res.text()
}

const genreNovel = "";


const update = async (typePages, pages = "1") => {
    let urlUpdate = `${obj.url}/advanced_search?s=all${obj[typePages]}&page=${pages}`
    console.log(urlUpdate);
    const novel = [];
    try {
        const web = await getFetch(urlUpdate);
        const $ = cheerio.load(web);
        // const listItems = $("section>ul.novel-list");
        const listItems = $("div.panel-content-genres>div.content-genres-item");
        listItems.each((idx, el) => {
            // console.log($(el).find('img').attr('data-src'));
            const data = { title: "", image: "", link: "" };
            data.title = $(el).find("a").attr('title');
            data.image = $(el).find("a>img").attr('src');
            data.link = $(el).find("a").attr('href');
            if (data.title) {
                novel.push(data);
            }

        });
        return novel;
    } catch (err) {
        console.error(err);
    }
}

//-->templating
// title
// image
// author
// genre [array]
// status
// description



const getNovel = async (url) => {
    const novel = [];
    try {
        const web = await getFetch(url);
        const jsonFormatter = getPage.format_array;
        const $ = cheerio.load(web);
        const data = {};
        data.title = $("div.story-info-right").find("h1").text().trim();
        data.image = $("div.story-info-left>span.info-image>img").attr("src");
        data.description = $("div.panel-story-info-description").text().trim();
        data.author = $("table>tbody>tr:nth-child(2)>td:nth-child(2)>a").text().trim();
        data.status = $("table>tbody>tr:nth-child(3)>td:nth-child(2)").text().trim();
        const genre = $("table>tbody>tr:nth-child(4)>td:nth-child(2)>a");

        // console.log(genre.length);
        let value = [];
        genre.each((idx, el) => {
            value.push($(el).text().trim());
        });
        data.genre = value;

        return data;
    } catch (err) {
        console.error(err);
    }
}

//{title : "", link : ""}
const daw = () => {

}
const getChapter = async (url) => {
    try {
        var novel = [];
        const web = await getFetch(url);
        const $ = cheerio.load(web);
        const listChapter = [...$("ul.row-content-chapter>li")].reverse();
        for (var y = 0; y < listChapter.length; y++) {
            const chapter = { title: "", link: "", date: "" }
            chapter.title = $(listChapter[y]).find("a").text().trim();
            chapter.link = $(listChapter[y]).find("a").attr('href');
            chapter.date = $(listChapter[y]).find("span.chapter-time").attr('title');

            novel.push(chapter);

        }
        return novel;





        // return novel.reverse();
    } catch (err) {
        console.error(err);
    }

}

const readChapter = async (url) => {
    const novel = [];
    try {
        const data = { chapterTitle: "", chapter: "" };
        const web = await getFetch(url);
        const $ = cheerio.load(web);
        data.chapterTitle = $('div.panel-chapter-info-top>h1').text().trim();
        const listChapter = $("div.container-chapter-reader>img");
        const chapterArr = [];
        listChapter.each((idx, el) => {
            chapterArr.push($(el).attr('src'));
        })
        data.chapter = chapterArr;


        //console.log(data.chapter);


        return data;
    } catch (err) {
        console.error(err);
    }
}
module.exports = { update, obj, getNovel, getChapter, readChapter }
