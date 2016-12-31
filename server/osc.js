//var osc = require("osc")

const dgram = require("dgram");
const oscmsg = require("osc-msg");

module.exports = function Osc() {

  let socket = dgram.createSocket("udp4");

  let buffer = oscmsg.encode({
    address: "/connected",
    args: [
      { type: "string", value: "connected" }
    ],
  });
  socket.send(buffer, 0, buffer.length, process.env.TARGET_OSC_PORT, "0.0.0.0", () => {
  });

  console.log("OSC_PORT", process.env.OSC_PORT);

  function send(address, type, value) {
    let buffer = oscmsg.encode({
      address: address,
      args: [
        { type: type, value: value }
      ],
    });
    socket.send(buffer, 0, buffer.length, process.env.TARGET_OSC_PORT, "0.0.0.0", () => {
    });
  }
  return {
    send: send
  }

}
