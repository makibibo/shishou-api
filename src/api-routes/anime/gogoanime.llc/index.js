const cheerio = require("cheerio");
const getPage = require('./method');

const obj = {
    "url": "https://www.gogoanime.llc",
    "logo": "https://www.gogoanime.llc/img/icon/logo.png",
    "title": "GogoAnime",
    "popular": "popular.html",
    "updated": "",
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
    let urlUpdate = `${obj.url}/${obj[typePages]}?page=${pages}`
    console.log(urlUpdate);
    const novel = [];
    try {
        const web = await getFetch(urlUpdate);
        const $ = cheerio.load(web);
        // const listItems = $("section>ul.novel-list");
        const listItems = $("ul.items>li");
        listItems.each((idx, el) => {
            // console.log($(el).find('img').attr('data-src'));
            const data = { title: "", image: "", link: "" };
            data.title = $(el).find("p.name").children("a").text().trim();
            data.image = $(el).find('img').attr('src');
            data.link = obj.url + $(el).find("p.name").children("a").attr('href');
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
        data.title = $("div.anime_info_body_bg").find("h1").text().trim();
        data.image = $("div.anime_info_body_bg").find("img").attr("src");
        data.description = $("div.anime_info_body_bg").find('p.type:nth-child(5)').text().trim();
        data.author = "Unknown";
        const genre = $("div.anime_info_body_bg").find('p.type:nth-child(6)>a');
        // console.log(genre.length);
        let value = [];
        genre.each((idx, el) => {
            value.push($(el).attr('title'));
        });
        data.genre = value;
        data.status = $("div.anime_info_body_bg").find('p.type:nth-child(8)>a').text().trim();

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

        const movie_id = $("div.anime_info_episodes_next>input#movie_id").attr('value');
        const default_ep = $("div.anime_info_episodes_next>input#default_ep").attr('value');
        const alias_anime = $("div.anime_info_episodes_next>input#alias_anime").attr('value');
        const listpage = $('#episode_page>li');
        for (var i = 0; i < listpage.length; i++) {
            const start = $(listpage[i]).children("a").attr('ep_start');
            const end = $(listpage[i]).children("a").attr('ep_end');
            let url = `https://ajax.gogo-load.com/ajax/load-list-episode?ep_start=${start}&ep_end=${end}&id=${movie_id}&default_ep=${default_ep}&alias=${alias_anime}`;
            const web = await getFetch(url);
            const $$ = cheerio.load(web);
            const listChapter = [...$$("ul>li")].reverse();
            for (var y = 0; y < listChapter.length; y++) {
                const chapter = { title: "", link: "", date: "" }
                chapter.title = $$(listChapter[y]).find("a>div:nth-child(1)").text().trim();
                chapter.link = obj.url + $$(listChapter[y]).children("a").attr("href").trim();
                novel.push(chapter);
            }
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
        // const data = { chapterTitle: "", content: "" };
        // const web = await getFetch(url);
        // const $ = cheerio.load(web);
        // const listVid = $('div.anime_muti_link').find('ul>li>a');
        // // for (let i = 0; i < listVid.length; i++) {
        // //     console.log($(listVid[i]).attr('data-video'));
        // // }
        // const gogoWatchLink = new URL('https:' + $(listVid[1]).attr('data-video'));
        // console.log(gogoWatchLink);
        // const web1 = await getFetch(gogoWatchLink.href);
        // const $$ = cheerio.load(web1);
        // const params = await helper.getAjaxParams($$, gogoWatchLink.searchParams.get('id'));
        // const fetchRes = await getFetchXML(`${gogoWatchLink.protocol}//${gogoWatchLink.hostname}/encrypt-ajax.php?${params}`);
        // console.log(fetchRes);

        // const finalSource = await helper.decryptAjaxResponse(fetchRes);
        // if (!finalSource.source) return { error: "No sources found" };
        // console.log(finalSource);

        // data.chapterTitle = $('div.anime_muti_link').find("ul>li").text().trim();

        // data.content = $("div.play-video").find('iframe').attr('src');
        const gogoWatchLink = new URL(url);
        const web = await getFetch(`https://animeapi-57t9.onrender.com/gogoanime/watch${gogoWatchLink.pathname}`);
        // console.log(web);



        return JSON.parse(web);
    } catch (err) {
        console.error(err);
    }
}
module.exports = { update, obj, getNovel, getChapter, readChapter }
