
const glob = require("glob")
options = { cwd: __dirname }
const files = glob.sync("*/", options);

const data = {};
files.map((fileObj) => {
    try {
        const getObj = require("./" + fileObj + "index");
        data[getObj.obj.url] = {
            "logo": getObj.obj.logo,
            "title": getObj.obj.title,
            "params": {
                "hot": getObj.obj.hot,
                "popular": getObj.obj.popular,
                "updated": getObj.obj.updated,
                "completed": getObj.obj.completed,
                "new": getObj.obj.new
            }
        }
    }
    catch (err) {
        console.error(err)
    }
}
)

module.exports = { data };
