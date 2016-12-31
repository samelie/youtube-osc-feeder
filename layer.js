const Convert = require('./server/convert')
const Q = require('bluebird')
const _ = require('lodash')
const Download = require('./download')

const timeToReference = (time) => {
  return Math.floor(time / 5.12)
}


module.exports = function Layer(server, items, layerIndex) {

  const id = `layer${layerIndex}`

  const FPS = 30
  const MIN_PLAYTIME = parseInt(process.env.MIN_PLAYTIME, 10)
  const MAX_PLAYTIME = parseInt(process.env.MAX_PLAYTIME, 10)

  const _cache = {}

  let results

  const { video, osc } = server

  let activeVo


  function _getDuration(p) {
    return Convert.getDuration(p)
      .then(dur => {
        return dur
      })
  }


  function send(vo) {
    const { path, frame } = vo
    console.log(vo);
    console.log(`\tSend /${id}: ${path}`);
    osc.send(
      `/${id}`, 'string',`${path}`
    )

    console.log(`\tSend ${id}frame: ${frame}`);
    setTimeout(() => {
      osc.send(
        `/${id}frame`,'integer', frame
      )
    }, 200)
  }


  function play() {
    next()
  }

  function next() {

    const index = Math.floor(Math.random() * results.length)
    console.log(index, results.length);
    const vo = results[index]
    activeVo = Object.assign({}, vo)

    const maxStartTime = Math.max(activeVo.duration - MIN_PLAYTIME, 0)
    const _startTime = Math.floor(Math.random() * maxStartTime)
    const _dur = Math.floor(Math.random() * (MAX_PLAYTIME - MIN_PLAYTIME)) + MIN_PLAYTIME
    activeVo.duration = Math.min(_dur, MAX_PLAYTIME)
    activeVo.frame = _startTime * FPS


    send(activeVo)

  }



  let timeCounter = 0
  setInterval(() => {
    if (activeVo) {
      if (timeCounter > activeVo.duration) {
        timeCounter = 0
        activeVo = null
        next()
      }

      timeCounter += 0.01
    }

  }, 10)


  const _chooseTime = (times => {
    return times[Math.floor(Math.random() * times.length)]
  })


  function _downloadVideoSegment(item) {
    const id = item.video
    const time = _chooseTime(item.times)
    console.log(`_downloadVideoSegment`, time);
    console.log(timeToReference(time[0]));
    const vo = {
      id: id,
      startIndex: timeToReference(time[0]),
      endIndex: timeToReference(time[1]),
      convert: true
    }
    return video.download(vo)
      .then(p => {

        return _getDuration(p)
          .then((dur) => {

            const vo = {
              path: p,
              duration: dur,
            }

            return vo
          })
      })
  }


  function download(options = {}) {
    return Q.map(items, item => {
        if (item.playlist) {

          return Download.playlist(item.playlist)
            .then(paths => {
              return Q.map(paths, ppath => {
                return _getDuration(ppath)
                  .then(dur => {
                    return {
                      path: ppath,
                      duration: dur,
                    }
                  })
              })
            }, { concurrency: 1 })

        } else {
          if (item.times) {
            return _downloadVideoSegment(item)
          } else {
            return Download.video(item.video)
              .then(videoPath => {
                return _getDuration(videoPath)
                  .then((dur) => {
                    return {
                      path: videoPath,
                      duration: dur,
                    }
                  })
              })
          }
        }
      }, { concurrency: 1 })
      .then(r => {
        results = _.flattenDeep(r)
        return results
      })
  }

  return {
    download: download,
    play: play,
    results: results,
    items: items
  }
}
