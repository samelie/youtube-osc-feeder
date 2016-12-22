var express = require('express');
const io = require('socket.io');
var ip = require('ip');
var cors = require('cors');
var path = require('path');

var Osc = require('./osc');

var User = require('./user');
var Youtube = require('./youtube');
var Video = require('./video');

//require('./auth/passport')(passport);

class Chewb {
    constructor(envarsPath) {
        require('dotenv').config({ path: envarsPath });

        if (process.env.YOUTUBE_DL_PATH) {
            SIDX.setYoutubeDLPath(process.env.YOUTUBE_DL_PATH)
        }
        const osc = Osc()

        const youtube = Youtube()
        const video = Video(youtube)

        return {
            osc: osc,
            video: video
        }

    }
}

module.exports = Chewb
