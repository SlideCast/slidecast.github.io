# Slidecast: https://slidecast.github.io
#### Full Report can be found [here](report.pdf)
### Low bandwidth preentation software

SlideCast is a low bandwith lecture recording and viewing platform that records the mouse pointer movements and audio along with the PDF instead of the video recording to reduce bandwith consumption.

## Idea
The slides are stored as a pdf while the mouse events and keystrokes are stored separately to get to know about the transitions and the audio is stored as an mp3 file. Having this much data, we can re-create the video easily as the current frame is created using the slide as background and mouse pointer over it. The transitions are identified using the keystrokes. This is the whole visual data in the video and along with the audio, this completes the whole video.

There are 2 main components, the recorder and viewer.

![](screenshot.png)

## Installation
SlideCast can be used as a web application or can be installed as a Progressive Web Application on Chrome/Firefox. You can install SlideCast by clicking on the Install Button on your address bar in Chrome (at the rightmost end of the address bar there is a plus symbol which is used for installing). SlideCast can then be started as a normal application from your system. Even if you do not install SlideCast is automatically cached and can be used offline!
SlideCast is supported only on Chrome at the moment.

## Recorder Instructions
In the recorder simply choose the PDF that you want to present. This would load after some time on the PDF stage and take you to full screen. Click on Record and provide microphone permissions. Now simply present the file as you would normally. On finishing click on Stop. After some processing time the recording would be downloaded to your system as a ZIP file.
You can now rename this file and distribute it to your viewers. Please make sure that while recording you are not resizing the window or switching out from full screen view. It is recommended to record striclty in full screen mode (you can get there by double clicking). To move slides you can use your arrow keys or the buttons at the bottom.

## Viewer Instructions
For viewing simply load the recording file by choosing the file. After some processing time the file would be loaded. You can then easily play the file, pause, seek forward as per your convenience. Clicking twice on the screen also starts full screen mode.

## Results
Duration of recording | Slidecast | Zoom Recording | Kazam | Chrome Screen Recorder
--- | --- | --- | --- |--- 
 5 min. | 1.6 mb | 3.8 mb | 12.4 mb | 19.8 mb
10 min. | 2.2 mb | 12.4 mb | 31.2 mb | 50.0 mb
20 min. | 3.7 mb | 20.3 mb | 76.6 mb | 87.4 mb
45 min. | 7.7 mb | 57.8 mb | 248.8 mb | 245.8 mb
1 hr. | 10.5 mb | 91.2 mb | 370.4 mb | 333.8 mb
