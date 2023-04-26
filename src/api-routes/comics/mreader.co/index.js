const cheerio = require("cheerio");
const getPage = require('./method');


const obj = {
    "url1": "https://mreader.co",
    "url": "https://www.mreader.co",
    "logo": "https://www.mreader.co/static/img/logo_200x200.png",
    "title": "M-Reader",
    "popular": "views",
    "updated": "Updated",
    "new": "New",
    "completed": "completed-novels"
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
    let urlUpdate = `${obj.url}/browse-comics/?results=${pages}&filter=${obj[typePages]}`
    const novel = [];
    try {
        const web = await getFetch(urlUpdate);
        const $ = cheerio.load(web);
        // const listItems = $("section>ul.novel-list");
        const listItems = $("ul.novel-list>li.novel-item");
        listItems.each((idx, el) => {
            // console.log($(el).find('img').attr('src'));
            const data = { title: "", image: "", link: "" };
            data.title = $(el).children("a").children("h4").text().trim();
            data.image = $(el).find('img').attr('src');
            data.link = obj.url + $(el).children("a").attr('href');
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
        const data = { title: "", image: "", description: "" };
        data.title = $("div.main-head").find("h1.novel-title").text().trim();
        data.image = $("header.novel-header").find("img").attr("src");
        data.description = $("p.description").text().trim();
        data.author = $("div.author").find("a.property-item").text().trim();
        const genre = $("div.categories>ul>li");
        console.log(genre.length);
        let value = [];
        genre.each((idx, el) => {
            value.push($(el).children("a").text().trim());
        });
        data.genre = value;
        data.status = $("div.header-stats>span:nth-child(4)").find("strong").text().trim();

        return data;
    } catch (err) {
        console.error(err);
    }
}

//{title : "", link : ""}
const getChapter = async (url) => {
    try {
        const novel = [];
        const web = await getFetch(`${url}all-chapters/`);
        const $ = cheerio.load(web);
        const listChapter = $("section#chapters").find("ul.chapter-list>li");
        listChapter.each((idx, el) => {
            const chapter = { title: "", link: "", date: "" }
            chapter.title = $(el).children("a").find("strong.chapter-title").text().trim();
            chapter.link = obj.url + $(el).children("a").attr("href");
            chapter.date = $(el).children("a").find("time.chapter-update").attr('datetime');
            novel.push(chapter);
        })
        return novel.reverse();
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
        data.chapterTitle = $('div.titles').find("h2").text().trim();
        const listChapter = $("div#chapter-reader>img");
        console.log(listChapter.length);
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
