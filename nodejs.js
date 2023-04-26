const rn_bridge = require('rn-bridge');
const cheerio = require("cheerio");
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database(':memory:');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
var _eval = require('eval')

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

const print = (msg) => {
  rn_bridge.channel.post('rn-log', msg);
}

const getFetch = async (url) => {
  print(url);
  const res = await fetch(url, option);
  return await res
}


rn_bridge.app.on('pause', (pauseLock) => {
  console.log('[node] app paused.');
  pauseLock.release();
});

rn_bridge.app.on('resume', () => {
  console.log('[node] app resumed.');
});

rn_bridge.channel.on('control', async (msg) => {
  if (typeof msg === 'object') {
    if (msg && msg.action) {
      switch (msg.action) {
        case "sample":
          var external = require('./method');
          const body = await external.get_page('https://api.apify.com/v2/browser-info');
          rn_bridge.channel.post('control', body)
          break;
        case "novel":
          contents = fs.readFileSync(path.join(rn_bridge.app.datadir(), msg.src + ".js"), 'utf-8')
          atay = _eval(contents, true);
          switch (msg.type) {
            case 'list':
              var daw = await atay.update(msg.params.query, msg.params.page);
              var data = {
                url: msg.src,
                type: 'list',
                data: daw
              }
              rn_bridge.channel.post('control', data)
              break
            case 'desc':
              var daw = await atay.getNovel(msg.params.link);
              var data = {
                url: msg.src,
                type: 'desc',
                data: daw
              }
              rn_bridge.channel.post('control', data)
              break
            case 'get':
              var daw = await atay.getChapter(msg.params.link);
              var data = {
                url: msg.src,
                type: 'get',
                data: daw
              }
              rn_bridge.channel.post('control', data)
              break
            case 'read':
              var daw = await atay.readChapter(msg.params.link);
              var data = {
                url: msg.src,
                type: 'read',
                data: daw
              }
              rn_bridge.channel.post('control', data)
              break
          }


          break;
        case "download":
          var external = require('./method');
          var writablePath = path.join(rn_bridge.app.datadir(), msg.src + ".js");
          const web = await external.get_page(`http://8.219.54.138:3000/raw/${msg.type}/${msg.src}`);
          rn_bridge.channel.post('rn-log', 'Tried to write "' + web + '" to "' + writablePath + '".');
          fs.writeFile(writablePath, web, () => {
            rn_bridge.channel.post('rn-log', 'Tried to write "' + web + '" to "' + writablePath + '".');
            fs.readFile(writablePath, (err, data) => {
              if (err) {
                rn_bridge.channel.post('rn-log', 'Error while readding "' + writablePath + '".');
              } else {
                rn_bridge.channel.post('rn-log', 'Read "' + data + '" from "' + writablePath + '".');
              }
            });
          });
          break;
      }

    } else {
      rn_bridge.channel.post('control', "Received but no action: error");
    }
  } else {
    rn_bridge.channel.post('control', "control channel didn't receive an object.");
  }
});

rn_bridge.channel.on('test-file', async (msg) => {
  //const novelSrc = "bestlightnovel.com"
  // var dbPath = path.join(rn_bridge.app.datadir(), 'shishou.db');
  //var external = require('./method.js');
  //const body = await external.get_page('http://8.219.54.138:3000/raw');
  // rn_bridge.channel.post('rn-log', 'Tried to write "' + body + '" to "' + writablePath + '".');
  // const db = new Database(dbPath, { verbose: console.log });


  var external = require('./method');

  const url = 'https://api.apify.com/v2/browser-info';
  let t, r;


  t = performance.now();
  r = await external.get_page(url);
  rn_bridge.channel.post('rn-log', `gotScraping took ${performance.now() - t}ms data: ${r}`);


  t = performance.now();
  r = await external.get_axios(url);
  rn_bridge.channel.post('rn-log', `axios took ${performance.now() - t}ms data: ${JSON.stringify(r.msg.data)}`);

  t = performance.now();
  r = await fetch(url, option);
  const body = await r.text();
  rn_bridge.channel.post('rn-log', `fetch took ${performance.now() - t}ms data: ${body}`);

  t = performance.now();
  r = await external.get_got(url);
  rn_bridge.channel.post('rn-log', `got took ${performance.now() - t}ms data: ${JSON.stringify(r.msg.body)}`);

  const gigig = getFetch.toString();
  rn_bridge.channel.post('rn-log', gigig);

});

