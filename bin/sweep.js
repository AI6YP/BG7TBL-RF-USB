#!/usr/bin/env node

const SerialPort = require('serialport');

const c = {
  start: String.fromCharCode(0x8f),
  version: 'v',
  fset: 'f',
  sweep: 'x',
  freq: '240000000',
  step: '00000100',
  smpl: '1000'
};

var port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 57600
});

port.on('error', err => console.log(err));

port.on('data', data => console.log(data));

port.on('open', () => {

  port.write(
    (c.start + c.sweep + c.freq + c.step + c.smpl),
    err => {
      if (err) {
        console.log(err.message);
      }
      console.log('sweep');
    }
  )

});
