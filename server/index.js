//const Chewb = require('@samelie/chewb')
const Q = require('bluebird')
const path = require('path')
const exec = require('child_process').exec
const fs = require('fs')
const VIDEO_ID = 'ufXJDkgaCEk'
  //let server = new Chewb(path.join(__dirname, 'envvars'))
  //let server = new Chewb(path.join(__dirname, 'envvars'))

//const SIDX = require('@samelie/node-youtube-dash-sidx');
const Server = require('./server')

const server = new Server(path.join(process.env(), 'envvars'))
/*

function saveVideo(id, index, range) {
  const merge = Buffer.concat([index, range], index.length + range.length)
  fs.writeFileSync(`${id}_.mp4`, merge, 'binary')
  let ids = server.user.ids
  let socket = server.user.users[ids[0]]
  const p1 = path.join(__dirname, `${id}_.mp4`)
  const p2 = path.join(__dirname, `${id}.mp4`)
  let _c = `ffmpeg  -i ${p1} -y  -pix_fmt yuv420p ${p2}`
  return new Q((yes, no) => {
    let _cmd = exec(_c, (code, stdout, stderr) => {
      if(socket){
        socket.emit('play-video', {path:p2})
      }
      yes(p2)
    });
  })
  // socket.emit('play-video', {path:p})
}

server.youtube.getSidx({ id: VIDEO_ID, resolution: '360p', videoOnly: true })
  .then(sidx => {
    let refs = sidx.sidx.references[1]
    console.log(sidx);
    server.youtube.getRange({
      url: sidx.url,
      range: sidx.indexRange
    }).then(indexBuffer => {
      server.youtube.getRange({
        url: sidx.url,
        range: refs.mediaRange
      }).then(rangeBuffer => {

        return saveVideo(VIDEO_ID, indexBuffer, rangeBuffer)

      })
    })
  })
  .catch(err => {
    console.log(err);
  })

*/



/*

const config = require('./config.json')
let io
const datas = {
  stringData: "foo",
  intData: 5,
  floatData: 0.5,
  boolData: true
}

io = require('socket.io')(config.server.port)
io.on('connection', function(socket) {
  console.log('connection'.bold.green)

  let emitInterval = setInterval(() => {
    socket.emit('server-event', datas)
    socket.emit('ping')
  }, 2000)

  socket.emit('setDeviceId', { deviceID: 4 })

  setTimeout(()=>{
    socket.emit('startRecord', { fileName: 'socket' })
  }, 2000)

  setTimeout(()=>{
    socket.emit('endRecord', { })
  }, 5000)

  socket
    .on('disconnect', () => {
      console.log('disconnect'.bold.red)
      clearInterval(emitInterval)
    })
    .on('pong', (data) => {
      console.log('pong'.blue, data);
    })
    .on('devices', (data) => {
      console.log(data);
    })
})
*/
