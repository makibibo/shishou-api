var cheerio = require("cheerio");
var getPage = require('./method');


////templating
// title
// image
// author
// genre [array]
// status
// description



const obj = {
    "url": "https://bestlightnovel.com",
    "logo": "",
    "title": "BestLightNovel",
    "popular": "topview",
    "updated": "latest",
    "new": "newest",
    "completed": "topview"
};


const genreNovel = "";


const update = async (typePages, pages = "1") => {
    //console.log(typePages)
    const urlUpdate = obj.url + "/novel_list?type=" + typePages + "&category=all&state=all&" + "page=" + pages;
    const novel = [];
    // const tryUrl = "https://httpbin.org/headers";
    try {
        const web = await getPage.get_page(urlUpdate);
        const $ = cheerio.load(web);
        const listItems = $(".update_item");

        listItems.each((idx, el) => {
            const data = { title: "", image: "", link: "" };
            data.title = $(el).children("a").attr('title');
            data.image = $(el).children("a").children("img").attr('src');
            data.link = $(el).children("a").attr('href');
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
        data.title = $(".info_image").children(".attachment-large").attr("title");
        data.image = $(".info_image").children(".attachment-large").attr("src");
        data.description = $("#noidungm").text();
        const listItems = $(".truyen_info_right li");
        listItems.each((idx, el) => {
            let text = $(el).children('span').text();
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

//{title : "", link : ""}
const getChapter = async (url) => {
    const novel = [];
    try {
        const web = await getPage.get_page(url);
        const $ = cheerio.load(web);
        const listItems = $(".chapter-list .row");
        listItems.each((idx, el) => {
            const data = { title: "", link: "" };
            data.link = $(el).children('span').children('a').attr('href');
            data.title = $(el).children('span').text();

            if (data.title) {
                novel.push(data);
            }
        });
        return novel;
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
        data.chapterTitle = $("#vung_doc").children('h3').text();
        data.chapter = $("#vung_doc").find("br").replaceWith("\n\n").end().text();
        data.prev = $('a:contains("PREV CHAPTER")').attr('href');
        data.next = $('a:contains("NEXT CHAPTER")').attr('href');

        //console.log(data.chapter);


        return data;
    } catch (err) {
        console.error(err);
    }
}
module.exports = { update, obj, getNovel, getChapter, readChapter }
