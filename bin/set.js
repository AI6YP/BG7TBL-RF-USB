#!/usr/bin/env node

const { SerialPort } = require('serialport');

const c = {
  start: String.fromCharCode(0x8f)
};

var port = new SerialPort({path: '/dev/ttyUSB0', baudRate: 57600});

port.on('error', err => console.log(err));

port.on('data', data => console.log(data));

port.on('open', () => {

  // check firmware version
  port.write(
    (c.start + 'v'),
    err => { if (err) { console.log(err.message); } }
  );

  // set frequency
  // f013300000 = MIN
  // f220000000 = 2.2e9
  // f340000000 = 1.7e9?
  // const f = '080000000'; // 800 MHz
  // const f = '230000000'; // 2300 MHz
  const f = '300000000'; // 3 GHz
  port.write(
    (c.start + 'f' + f),
    err => { if (err) { console.log(err.message); } }
  )

});
