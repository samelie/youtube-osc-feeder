var ip = require('ip');
var Video = require("./video")


const User = function(io, youtube) {

  var users = {};
  var userMaterials = {}
  var ids = [];

  function userConnected(socket) {

    const video = Video(youtube, socket)

    ids.push(socket.id);
    users[socket.id] = socket;


    socket.on('osc-init', (options) => {
      socket.osc_port = options.port
    })

    socket.on('download', (options) => {
      video.download(options)
        .then(videoPath => {

          console.log(videoPath);
          console.log(`Sening to ${socket.osc_port}`);
          /*// Send an OSC message to, say, SuperCollider
          udpPort.send({
            address: `/play-video`,
            args: [videoPath]
          }, "0.0.0.0", socket.osc_port);*/

        })
    })

    users[socket.id].onDisconnect = () => {
      console.log(`Disconnected ${socket.id}`);
    }

    socket.once('disconnect', users[socket.id].onDisconnect)

    socket.emit('handshake', {
      index: ids.length - 1,
      id: socket.id,
      ip: ip.address()
    });

    console.log('Connected', socket.id);
  }

  console.log(users);

  io.on('connection', userConnected);

  return {
    ids: ids,
    users: users
  }
}

module.exports = User
