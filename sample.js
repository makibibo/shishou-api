const jimp = require("jimp");
const { get_image } = require("./src/logic/method");
const crypto = require('crypto');

const originalFilename = "./image.jpg";
const originalFilename1 = "./image1.jpg";


const donwloadingImage = (url) => {
    get_image(url)
        .then((res) => {
            return sharp(res.body)
        })
        .then(() => {
            console.log('Image downloaded and resize');
        })
        .catch((err) => {
            console.log(`Couldn't process: ${err}`)
        })
}

const ImgMeta = async (url, res) => {
    const image = sharp(res);
    const metadata = await image.metadata();
    return ({ ext: url.split(".").pop(), width: metadata.width, height: metadata.height });

}

const sampling1 = async (url, path, screenHeight) => {
    const response = await get_image(url);
    const imgObj = await ImgMeta(url, response.body);
    const divideNum = (imgObj.height / screenHeight);
    var daw = Math.ceil(imgObj.height / divideNum);
    console.log(imgObj.height);
    if (imgObj.height < screenHeight) {
        var nameSaveImgToPath = path + crypto.randomBytes(5).toString('hex') + "." + imgObj.ext;
        const arr = [];
        sharp(response.body)
            //.extract({ left: 0, top: val, width: imgObj.width, height: daw })
            .toFile(nameSaveImgToPath);
        arr.push(nameSaveImgToPath);
        return { error: false, res: "single", data: arr };
    }
    if (divideNum > 1) {
        var val = 0;
        const arr = []
        while (val < imgObj.height) {
            var nameSaveImgToPath = path + crypto.randomBytes(5).toString('hex') + "." + imgObj.ext;
            sharp(response.body)
                .extract({ left: 0, top: val, width: imgObj.width, height: daw })
                .toFile(nameSaveImgToPath);
            arr.push(nameSaveImgToPath);
            val += daw;
            if ((daw + val) > imgObj.height) {
                daw = (imgObj.height - val);
            }
        }
        return { error: false, res: "multiple", data: arr };
    }
    else {
        var nameSaveImgToPath = path + crypto.randomBytes(5).toString('hex') + "." + imgObj.ext;
        const arr = [];
        sharp(response.body)
            //.extract({ left: 0, top: val, width: imgObj.width, height: daw })
            .toFile(nameSaveImgToPath);
        arr.push(nameSaveImgToPath);
        return { error: false, res: "single", data: arr };

    }
}



const sampling = async (url, quality, path, screenHeight) => {
    const response = await get_image(url);
    const img = await jimp.read(response.body);
    const ext = url.split(".").pop();
    const divideNum = (img.bitmap.height / screenHeight);
    var heightDividen = Math.ceil(img.bitmap.height / divideNum);
    const arr = []

    if (img.bitmap.height < screenHeight) {
        var nameSaveImgToPath = `${path}${crypto.randomBytes(5).toString('hex')}.${ext}`;
        img.crop(0, val, image.bitmap.width, img.bitmap.heigh);
        await img.quality(quality).writeAsync(nameSaveImgToPath);
        arr.push(nameSaveImgToPath);
        return { error: false, res: "single", data: arr };

    }

    if (divideNum > 1) {
        var val = 0;
        while (val < img.bitmap.height) {
            var nameSaveImgToPath = `${path}${crypto.randomBytes(5).toString('hex')}.${ext}`;
            // const image = await jimp.read(response.body);
            const image = img;
            image.crop(0, val, image.bitmap.width, screenHeight);
            await image.quality(quality).writeAsync(nameSaveImgToPath);
            arr.push(nameSaveImgToPath);
            val += screenHeight;
            if ((screenHeight + val) > img.bitmap.height) {
                screenHeight = (img.bitmap.height - val);
            }
            console.log(`${val} ${img.bitmap.height} ${screenHeight}`);
        }
        return { error: false, res: "multiple", data: arr };
    } else {
        var nameSaveImgToPath = `${path}${crypto.randomBytes(5).toString('hex')}.${ext}`;
        img.crop(0, val, image.bitmap.width, img.bitmap.heigh);
        await img.quality(quality).writeAsync(nameSaveImgToPath);
        arr.push(nameSaveImgToPath);
        return { error: false, res: "single", data: arr };

    }
}


const dawbi = async (url, quality, path, screenWidth) => {
    const response = await get_image(url);
    const img = await jimp.read(response.body);
    const ext = url.split(".").pop();
    const divideNum = (img.bitmap.height / screenWidth);
    var heightDividen = Math.ceil(img.bitmap.height / divideNum);
    const arr = []

    await img.writeAsync(`${path}original.${ext}`);
    var nameSaveImgToPath = `${path}${crypto.randomBytes(5).toString('hex')}.${ext}`;
    // img.crop(0, val, img.bitmap.width, img.bitmap.heigh);
    img.resize(screenWidth, jimp.AUTO);
    await img.writeAsync(nameSaveImgToPath);
    arr.push(nameSaveImgToPath);
    return { error: false, res: "single", data: arr };



}

async function ok() {
    const url = 'https://www.toonix.xyz/cdn_mangaraw/martial-pea/chapter-3092/1.jpg';
    // const url = 'https://www.toonix.xyz/cdn_mangaraw/eternal-tribulation/chapter-0.2/11.jpg'
    const path = './tmp/';
    const quality = 100;
    console.log(await dawbi(url, quality, path, screenWidth = 360));

}

ok();
