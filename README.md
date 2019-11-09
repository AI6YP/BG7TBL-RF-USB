# BG7TBL-RF-USB

Spectrum Analyzer software using inexpensive (138MHz-4.4GHz) or (25MHz-6GHz) BG7TBL box.

NodeJS Server + Web Client.

![screenshot](screenshot1.gif)

## Linux configuration

```sh
# To see the groups: `groups`
# Have to add user into `tty` and `dialout` groups

# to see <yourname>
echo "$USER"

# setup groups
sudo usermod -a -G tty,dialout <yourname>

# to attach Serial driver
sudo modprobe ftdi_sio

# install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

# install new Node.js
nvm i 10

# install analyzer software
git clone git@github.com:drom/BG7TBL-RF-USB.git

# install package dependencies
npm i

# build clien App
npm run build

# start server
npm start
```
## Board

138MHz-4.4GHz USB RF Source Signal Generator / Simple Spectrum Analyzer

![PCB](pcb.png)

## References

  * https://sigrok.org/wiki/BG7TBL
  * https://github.com/darkstar007/NetworkAnalyser
