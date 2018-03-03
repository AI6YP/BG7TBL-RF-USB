# BG7TBL-RF-USB

Spectrum Analyzer software using inexpensive (138MHz-4.4GHz) or (25MHz-6GHz) BG7TBL box.

NodeJS Server + Web Client.

![screenshot](screenshot1.gif)

## Build

  * `npm i` - to install all JavaScript packages
  * `npm run build` - to build client app
  * `npm start` - to start server

## Linux configuration

To see the groups: `groups`

To see all available groups types: `compgen -g`

Have to add user into `tty` and `dialout` groups
```
sudo usermod -a -G tty yourname
sudo usermod -a -G dialout yourname
```
## Board

138MHz-4.4GHz USB RF Source Signal Generator / Simple Spectrum Analyzer

![PCB](pcb.png)

## References

  * https://sigrok.org/wiki/BG7TBL
  * https://github.com/darkstar007/NetworkAnalyser
