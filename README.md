#Osc video feeder of youtube videos and playlists.

Give it urls to download then randomly send videos over osc within min and max time limits.

It also send a frame to skip to. All youtube videos are 30fps.

##Run

`npm start`


##Configure


The video path on the harddive is sent over OSC with port `TARGET_OSC_PORT` at this route:

`/layer<layerIndex>`

There is a _frame_ route if you want to skip to a frame in the video.

`/layer<layerIndex>/frame`

Only 1 argument for each. In `layer.js`


###Configure

_config.json_

- Each array item is a _layer_

- Fill each _layer item_ with youtube playlists urls or video urls

Example config.json with comments

```
[

  //osc route would be: /layer0
  [{
    "playlist": "https://www.youtube.com/playlist?list=PLRQ2jIXShfkYUDJWN4v_hClyFb0Qcnhlk"
  },{
    "playlist": "https://www.youtube.com/playlist?list=PLuTh1a1eg5vZ4NbXHavLdiJD3xkyrT7xi"
  }, {
    "playlist": "https://www.youtube.com/playlist?list=PLuTh1a1eg5vbZTFzVvH3_lpTCgPlfzaoV"
  }, {
    "playlist": "https://www.youtube.com/playlist?list=PLuTh1a1eg5vZ1PnDQIiolbphrhaX07hxR"
  }],

//osc route would be: /layer1
  [{
    "video": "https://www.youtube.com/watch?v=JNpXMY-vRTo"
  },{
    "video":"https://www.youtube.com/watch?v=9BqWQEaIDaU"
  }],

//osc route would be: /layer2
  [{
    "video": "https://www.youtube.com/watch?v=JNpXMY-vRTo",
    //!! You can specify time ranges in seconds
    //!! It will only use these segments and not the whole video
    "times":[[3, 10], [40, 60]]
  },{
    "video":"https://www.youtube.com/watch?v=9BqWQEaIDaU"
  }]

]
```

All Options.

```
PORT=3456
BINARIES=./binaries/
OSC_PORT=12345
MAX_PLAYTIME=40
MIN_PLAYTIME=20
VIDEO_DIR=videos
TARGET_OSC_PORT=32000

```


Really only needs to play with these.

```
MAX_PLAYTIME
MIN_PLAYTIME
VIDEO_DIR
TARGET_OSC_PORT
```



Needs ffmpeg installed. Brew is easiest.

 - install brew

- `brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-frei0r --with-libass --with-libvo-aacenc --with-libvorbis --with-libvpx --with-opencore-amr --with-openjpeg --with-opus --with-openssl --with-rtmpdump --with-schroedinger --with-speex --with-theora --with-tools --with-x265 --with-faac --with-lame --with-x264 --with-xvid`


#Roadmap

 - Better way to add videos

 - live watching for uploads