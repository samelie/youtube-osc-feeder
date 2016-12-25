#Holiday deux-tube


----


This has only been tested on Mac OSx.

Third party: imagemagick & After Effects CC 2015+

##Make slideshows from photos with crossfades in after effects.

##Steps:

###Imagemagick image prep:

Be aware this overrides the images, so use a copy.

`cd <folder with all the images>`

_Resize all the images to 853x480 croping portrait images in the center_

`for i in *.JPG; do convert $i -auto-orient -resize '853x480^' -gravity center -crop '853x480+0+0' +repage -extent 853x480 $i; done`

###After Effects

- open _template.aep_

- Import folder icon with all the images

- Drag folder to _new comp_

- Set the crossfade options

- Add to render cue, use Adobe Media Encoder: xh264, 853x480... (modify youtube preset)


-------

https://www.youtube.com/playlist?list=PLRQ2jIXShfkYUDJWN4v_hClyFb0Qcnhlk

