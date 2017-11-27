#!/usr/bin/env node

const SerialPort = require('serialport');

const c = {
  start: String.fromCharCode(0x8f)
};

var port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 57600
});

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
  port.write(
    (c.start + 'f080000000'),
    err => { if (err) { console.log(err.message); } }
  )

});
