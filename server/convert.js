const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec
const Q = require('bluebird');

const Convert = (() => {


  function getDuration(p) {
    return new Q((yes, no) => {
      var cmd = 'ffprobe -v quiet -of json -show_format  -i ' + p;
      console.log(cmd);

      exec(cmd,
        (e, stdout, stderr) => {
          if (e instanceof Error) {
            no(e)
          }
          var parse = JSON.parse(stdout);
          yes(Math.floor(parse.format.duration));
        });
    });
  }

  function convert(video, out) {
    const { name, dir } = path.parse(video)
    const cmd = `ffmpeg -i ${video} -pix_fmt yuv420p -an -y ${out}`
    return new Q((yes, no) => {
      exec(cmd,
        (e, stdout, stderr) => {
          if (e instanceof Error) {
            no(e)
          }
          yes(out)
        });
    })
  }

  return {
    getDuration: getDuration,
    convert: convert
  }

})()

module.exports = Convert
