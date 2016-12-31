const Q = require('bluebird')
const fs = require('fs')
const path = require('path')
const Server = require('./server/server')
const Layer = require('./layer')


const CONFIG = JSON.parse(fs.readFileSync('./config.json'))
const server = new Server(path.join(__dirname, 'envvars'))

const savePath =  path.join(process.cwd(),process.env.VIDEO_DIR)
if(!fs.existsSync(savePath)){
  fs.mkdirSync(savePath)
}


const extractVideoId = (url) => (url.split('v=')[1])
const extractPlaylistId = (url) => (url.split('list=')[1])
const timeToReference = (time) => {
  return Math.floor(time / 5)
}

const videoLayers = CONFIG.map((layer, i) => {

  return Layer(server, layer.map(item => {

    if (item.video) {
      item = Object.assign({}, item, { video: extractVideoId(item.video) })

      if (!item.times) {
        return item
      }

      item.references = item.times.map(time => {
        return [timeToReference(time[0]), timeToReference(time[1])]
      })

      return item

    }

    if (item.playlist) {
      return item
    }

  }), i)

})


function play() {
  videoLayers.forEach(layer => {
    layer.play()
  })
}


Q.map(videoLayers, (layer) => {
    return layer.download()
  }, { concurrency: 1 })
  .then(r => {
    play()
  })
  .finally()


console.log(videoLayers);
