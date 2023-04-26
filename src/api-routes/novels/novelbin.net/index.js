const cheerio = require("cheerio");
const getPage = require('./method');


////templating
// title
// image
// author
// genre [array]
// status
// description



const obj = {
    "url": "https://novelbin.net",
    "logo": "https://novelbin.net/img/logo.png",
    "title": "NovelBin",
    "hot": "h",
    "popular": "p",
    "updated": "update",
    "completed": "c"
};


const genreNovel = "";

const update = async (typePages, pages = "1") => {
    //console.log(typePages)
    const urlUpdate = obj.url + "/sort/" + obj[typePages] + "?" + "page=" + pages;
    const novel = [];
    console.log(urlUpdate);
    try {
        const web = await getPage.get_page(urlUpdate);
        const $ = cheerio.load(web);
        const listItems = $(".list-novel .row");

        listItems.each((idx, el) => {
            const data = { title: "", image: "", link: "" };
            data.title = $(el).children(".col-xs-7").children("div").children(".novel-title").children("a").attr('title');
            data.image = $(el).children(".col-xs-3").children("div").children(".cover").attr('src');
            data.link = $(el).children(".col-xs-7").children("div").children(".novel-title").children("a").attr('href');
            if (data.title) {
                novel.push(data);
            }
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
        data.title = $(".desc").children(".title").text();
        data.image = $(".book").children("img").attr('src');
        data.description = $(".desc-text").text();
        const listItems = $(".info-meta li");

        listItems.each((idx, el) => {
            let text = $(el).children('h3').text();
            let sumpay = $(el).children('a');
            let value = [];
            if (sumpay.length > 1) {
                sumpay.each((idx, el) => {
                    value.push($(el).text());
                });
            } else {
                value = sumpay.text();
            }
            if (value) {
                for (var key in jsonFormatter) {
                    arr_value = jsonFormatter[key];
                    str = text.toLowerCase().search(arr_value);
                    if (str !== -1) { data[arr_value] = value; }
                }
            }
        });
        return data;
    } catch (err) {
        console.error(err);
    }
}

const getChapter = async (argURL) => {
    url = "https://novelbin.net/ajax/chapter-archive?novelId=" + argURL.split("/").pop();
    const novel = [];
    try {
        const web = await getPage.get_page(url);
        const $ = cheerio.load(web);
        const listItems = $("li");

        listItems.each((idx, el) => {
            const data = { title: "", link: "" };
            data.link = $(el).children('a').attr('href');
            data.title = $(el).children('a').attr('title');
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
        data.chapterTitle = $(".chr-title").attr('title');
        data.chapter = $(".chr-c").text();
        data.prev = $('#prev_chap').attr('href');
        data.next = $('#next_chap').attr('href');


        return data;
    } catch (err) {
        console.error(err);
    }
}
module.exports = { update, obj, getNovel, getChapter, readChapter }
