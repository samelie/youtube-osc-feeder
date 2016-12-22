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

        var server, routes;
        this.app = express();

        this.app.use(cors());
        let _port = process.env.PORT || 8080
        let _host = process.env.SERVER_HOST || '127.0.0.1'

        console.log(_host, _port);
        var server = this.app.listen(_port)
        const osc = Osc()

        const IO = io.listen(server);
        const youtube = Youtube()
        const user = User(IO, youtube)
        const video = Video(IO, youtube)


        this.port = _port
        this.host = _host

        return {
            osc: osc,
            video: video,
            user: user
        }

    }
}

module.exports = Chewb
