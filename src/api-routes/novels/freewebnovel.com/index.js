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
    "url": "https://freewebnovel.com",
    "logo": "https://freewebnovel.com/static/freewebnovel/images/logo.png",
    "title": "Free WebNovel",
    "popular": "most-popular-novels",
    "new": "latest-novels",
    "updated": "latest-release-novels",
    "completed": "completed-novels"
};


const genreNovel = "";


const update = async (typePages, pages = "1") => {
    let urlUpdate;
    if (obj[typePages] === "most-popular-novels") {
        urlUpdate = obj.url + "/" + obj[typePages] + "/";
    } else {
        urlUpdate = obj.url + "/" + obj[typePages] + "/" + pages + "/";
    }
    const novel = [];
    try {
        const web = await getPage.get_page(urlUpdate);
        const $ = cheerio.load(web);
        const listItems = $(".ul-list1-2 .li-row");
        // console.log(listItems.length);

        listItems.each((idx, el) => {
            const data = { title: "", image: "", link: "" };
            data.title = $(el).children(".li").children(".con").children(".txt").children(".tit").children("a").attr('title');
            data.image = $(el).children(".li").children(".con").children(".pic").children("a").children("img").attr('src');
            data.link = obj.url + $(el).children(".li").children(".con").children(".txt").children(".tit").children("a").attr('href');
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
        data.title = $(".pic").children("img").attr("title");
        data.image = $(".pic").children("img").attr("src");
        data.description = $(".txt").children(".inner").text();
        const listItems = $(".txt .item");
        listItems.each((idx, el) => {
            let text = $(el).children('span').attr("title");
            let sumpay = $(el).children('.right');
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
    const urlNew = [];
    urlNew.push(url)
    try {
        for (let x of urlNew) {
            console.log(x)
            const web = await getPage.get_page(x);
            const $ = cheerio.load(web);

            const arrChapter = $("#indexselect option");
            if (urlNew.length === 1) {
                arrChapter.each((idx, el) => {
                    if ($(el).attr("selected") === undefined) {
                        urlNew.push(obj.url + $(el).attr("value"));
                    }
                });
            }
            const listItems = $(".m-newest2 .ul-list5 li");
            listItems.each((idx, el) => {
                const data = { title: "", link: "" };
                data.link = obj.url + $(el).children('a').attr('href');
                data.title = $(el).children('a').text();

                if (data.title) {
                    novel.push(data);
                }
            });
        }
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
