const path = require('path')
const fs = require('fs')
const readDir = require('readdir');

const Q = require('bluebird')
const BluebirdQueue = require('./bluebirdQueue')
const Convert = require('./convert')


const downloadVo = (manifest, options) => {

  let { sidx } = manifest
  let { references } = sidx
  let { startIndex, endIndex } = options

  if (!startIndex || !endIndex) {
    endIndex = Math.floor(Math.random() * references.length)
    startIndex = Math.floor(Math.random() * references.length)
  }

  endIndex = Math.min(endIndex, references.length - 1)
  startIndex = Math.max(Math.min(startIndex, endIndex - 1), 0)

  let sRef = references[startIndex]
  let eRef = references[endIndex]
  var size = 0;
  var duration = 0;
  for (var j = startIndex; j <= endIndex; j++) {
    duration += references[j]['durationSec'];
    size += references[j].size;
  }
  var brEnd = (parseInt(eRef['mediaRange'].split('-')[1], 10));
  var brMax = brEnd;
  var videoVo = {};
  videoVo['url'] = manifest['url'] || manifest.baseUrl;
  videoVo['byteRange'] = sRef['mediaRange'].split('-')[0] + '-' + brEnd;
  videoVo.indexRange = manifest.indexRange;
  videoVo['duration'] = duration;
  return videoVo;
}

const Video = function(youtube) {

  const _sidxCache = {}

  const _voQueue = new BluebirdQueue({ delay: 2000, concurrency: 1 })
  _voQueue.start()

  const saveVideoPath = (id, name) => (path.join(process.cwd(),
    process.env.VIDEO_DIR, `${id}_${name}.mp4`))
  const convertVideoPath = (id, name) => (path.join(process.cwd(),
   process.env.VIDEO_DIR, `${id}_${name}_convert.mp4`))

  function saveVideo(id, index, range, name) {
    const merge = Buffer.concat([index, range], index.length + range.length)
    fs.writeFileSync(saveVideoPath(id, name), merge, 'binary')
    return saveVideoPath(id, name)
  }

  function _getSidx(obj) {
    const { id } = obj
    if (_sidxCache[id]) {
      return Q.resolve(_sidxCache[id])
    }
    return youtube.getSidx(Object.assign({}, obj, {
      resolution: '360p',
      videoOnly: true
    }))
  }


  function download(obj) {
    const { id, convert } = obj


    console.log(obj);


    let prom = _getSidx(obj)
      .then(sidx => {

        if (!_sidxCache[id]) {
          _sidxCache[id] = sidx
        }

        let vo = downloadVo(sidx, obj)
        const name = vo.byteRange
        const out = convertVideoPath(id, name)
          console.log(out);
          console.log(fs.existsSync(out));
        if (convert) {
          if (fs.existsSync(out)) {
            console.log("\tExists!");
            return Q.resolve(out)
          }
        }

        return youtube.getRange({
          url: sidx.url,
          range: sidx.indexRange
        }).then(indexBuffer => {

          return youtube.getRange({
            url: sidx.url,
            range: vo.byteRange

          }).then(rangeBuffer => {

            const videoPath = saveVideo(id, indexBuffer, rangeBuffer, name)

            if (convert) {
              return Convert.convert(videoPath, convertVideoPath(id, name), vo.duration)
            }

            return videoPath
          })
        })
      })

    _voQueue.add(prom)
    return prom
  }
  return {
    download: download
  }
}

module.exports = Video
