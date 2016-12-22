const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec
const Q = require('bluebird');

const Convert = (() => {

  function convert(video) {
    const { name, dir } = path.parse(video)
    const out = path.join(dir, `${name}_yuv.mp4`)
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
    convert: convert
  }

})()

module.exports = Convert
