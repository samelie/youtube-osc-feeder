const path = require('path')
const fs = require('fs')

const Convert = require('./convert')


const getVo = (manifest, options) => {

  let { sidx } = manifest
  let { references } = sidx
  let { startIndex, endIndex } = options

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

const Video = function(socket, youtube) {


  function saveVideo(id, index, range) {
    const merge = Buffer.concat([index, range], index.length + range.length)
    fs.writeFileSync(`${id}_.mp4`, merge, 'binary')
    const p1 = path.join(process.cwd(), `${id}_.mp4`)
    return p1
  }


  function download(obj) {
    const { id, convert } = obj
    return youtube.getSidx(Object.assign({}, obj, {
        resolution: '360p',
        videoOnly: true
      }))
      .then(sidx => {

        let vo = getVo(sidx, obj)

        return youtube.getRange({
          url: sidx.url,
          range: sidx.indexRange
        }).then(indexBuffer => {

          return youtube.getRange({
            url: sidx.url,
            range: vo.byteRange
          }).then(rangeBuffer => {

            const videoPath = saveVideo(id, indexBuffer, rangeBuffer)

            if(convert){
              return Convert.convert(videoPath)
            }

            return videoPath

          })
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
  return {
    download: download
  }
}

module.exports = Video
