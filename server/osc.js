var osc = require("osc")

module.exports = function Osc() {


  // Create an osc.js UDP Port listening on port 57121.
  var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: process.env.OSC_PORT
  });


  // Listen for incoming OSC bundles.
  udpPort.on("bundle", function(oscBundle, timeTag, info) {});

  // Open the socket.
  udpPort.open();

  udpPort.send({
    address: `/connected`,
    args: ["Connected"]
  }, "0.0.0.0", process.env.TARGET_OSC_PORT);

  console.log("OSC_PORT", process.env.OSC_PORT);

  function send(address, args) {
    udpPort.send({
      address: address,
      args: args
    }, "0.0.0.0", process.env.TARGET_OSC_PORT);
  }

  return {
    send: send
  }

}
