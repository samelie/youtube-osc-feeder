const fs = require('fs')
const path = require('path')
const Server = require('./server/server')
const Layer = require('./layer')

const CONFIG = JSON.parse(fs.readFileSync('./config.json'))
const server = new Server(path.join(__dirname,'server', 'envvars'))


const extractVideoId = (url)=>(url.split('v=')[1])

const videoLayers = CONFIG.map(layer=>{

  return Layer(layer.map(item=>{

    if(item.video){
      return Object.assign({}, item, {video:extractVideoId(item.video)})
    }

  }))

})

/*server.video.download({
  id:'ufXJDkgaCEk',
  startIndex:3,
  endIndex:6,

  convert:true
}).then((p)=>{

  server.osc.send('/videos0', [p])

  console.log(p);
})
*/
console.log(server);

console.log(videoLayers);