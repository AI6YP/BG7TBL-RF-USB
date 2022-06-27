#!/usr/bin/env node

const { SerialPort } = require('serialport');

const c = {
  start: String.fromCharCode(0x8f),
  version: 'v',
  fset: 'f',
  sweep: 'x',
  freq: '200000000', step: '00010000', smpl: '2000' // 2--2.2 GHz
};

const port = new SerialPort({path: '/dev/ttyUSB0', baudRate: 57600});

let timer0;

const start = () => {
  port.write(
    (c.start + c.sweep + c.freq + c.step + c.smpl),
    err => {
      if (err) {
        console.log(err.message);
      }
      console.log('sweep');
    }
  )
}

port.on('error', err => console.log(err));

port.on('data', data => {
  clearTimeout(timer0);
  timer0 = setTimeout(start, 1000);
  process.stdout.write('.');
  // console.log(data);
});



port.on('open', start);
