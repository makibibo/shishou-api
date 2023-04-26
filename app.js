const express = require("express");
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded(
    { extended: true }
));


console.clear();

app.get("/:id", (req, res) => {
    const getObjJson = require(`./src/api-routes/${req.params.id}/index`)
    const pushData = []
    for (let x in getObjJson['data']) {
        arr = [];
        for (let y in getObjJson['data'][x]['params']) {
            // console.log(y);
            if (y !== void (0)) {
                arr.push(y);
            }
        }

        // jsa[x] = arr;
        const jsa = {}
        const myURL = new URL(x.replace('www.', ''));
        jsa['url'] = myURL.host;
        jsa['logo'] = getObjJson['data'][x]['logo'];
        jsa['title'] = getObjJson['data'][x]['title'];
        jsa['params'] = arr;
        pushData.push(jsa)
    }
    res.status(200).json(pushData);
});
app.get("/raw/:type/:source", (req, res) => {
    fs.readFile(`./src/api-routes/${req.params.type}/${req.params.source}/index.js`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(data);
        res.status(200).send(data);
    });
});

app.get("/nimal/rawnodejs", (req, res) => {
    fs.readFile(`./nodejs.js`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(data);
        res.status(200).send(data);
    });
});

app.get('/', async (req, res) => {
    const { id, page, desc, get, read, type, url } = req.query;
    const output = require("./src/api-routes/" + type + "/" + url + "/index")
    console.log("./src/api-routes/" + type + "/" + url + "/index");
    if (id) {
        const okay = await output.update(id, page);
        res.status(200).json(okay);
    }

    if (desc) {
        const okay = await output.getNovel(desc);
        res.status(200).json(okay);
    }
    if (get) {
        const okay = await output.getChapter(get);
        res.status(200).json(okay);
    }
    if (read) {
        const okay = await output.readChapter(read);
        res.status(200).json(okay);
    }

})


app.listen(port, () => {
    console.log(`Snowble app listening to http://localhost:${port}`);
})
