const Convert = require('./server/convert')
const timeToReference = (time) => {
  return Math.floor(time / 5)
}

const downloadVo = (videoId, times) => {
  if (!times) {
    return {
      id: videoId,
      convert: true
    }
  }
  return {
    id: videoId,
    startIndex: times[0],
    endIndex: times[1],
    convert: true
  }
}

module.exports = function Layer(server, items, layerIndex) {

  const id = `layer${layerIndex}`

  const _cache = {}

  const { video, osc } = server
  let activeVo

  const parsedItems = items.map(item => {
    const id = item.video
    _cache[id] = _cache[id] || []

    if (!item.times) {
      return item
    }
    item.references = item.times.map(time => {
      return [timeToReference(time[0]), timeToReference(time[1])]
    })
    return item
  })


  function _getDuration(p) {
    return Convert.getDuration(p)
      .then(dur => {
        return dur
      })
  }


  function play(vo) {
    const {path } = vo
    osc.send(
      `/${id}`, [path]
    )
  }

  function download(obj) {
    return video.download(obj)
  }


  function _chooseTime(item) {
    const { references } = item
    if (!references) {
      return null
    }
    const index = Math.floor(Math.random() * references.length)
    return references[index]
  }

  function next() {

    const index = Math.floor(Math.random() * parsedItems.length)
    const item = parsedItems[index]

    const id = item.video

    const vo = downloadVo(id, _chooseTime(item))
    download(vo)
      .then(p => {

        return _getDuration(p)
          .then((dur) => {

            const vo = {
              path: p,
              duration: dur * 1000,
            }

            _cache[id].push(vo)

            activeVo = Object.assign({}, vo)

            console.log(activeVo);

            return play(vo)
          })
      })
      .finally()
  }

  let timeCounter = 0
  setInterval(()=>{

    if(activeVo){
      if(timeCounter > activeVo.duration){
        timeCounter = 0
        activeVo = null
        next()
      }

      timeCounter+=10
      console.log(timeCounter);
    }

  },10)

  next()



  return {

  }
}
