const SIDX = require('@samelie/node-youtube-dash-sidx');
const xhr = require('xhr-request');
var toBuffer = require('typedarray-to-buffer')

const Q = require('bluebird');

const USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36`

const Youtube = function() {

  function getSidx(obj) {
    return SIDX.start(obj)
      .then((data) => {
        return data
      })
  }

  function getRange(obj) {
    return new Q((yes, no) => {
      xhr(obj.url, {
        method: 'GET',
        responseType: 'arraybuffer',
        headers: {
          'Range': `bytes=${obj.range}`,
          'User-Agent': USER_AGENT
        },
      }, function(err, data, response) {
        yes(toBuffer(data))
      });
    });
  }

  function download(obj) {
    return new Q((yes, no) => {
      const r = request(obj)
      r.pipe(fs.createWriteStream(`./${savePath}.mp4`))
      r.on('finish', () => {
        yes()
      });
      r.end();
    })
  }

  return {
    getSidx: getSidx,
    getRange: getRange,
    download: download
  }
}

module.exports = Youtube
