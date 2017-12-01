#!/usr/bin/env node

'use strict';

const SerialPort = require('serialport');
const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const portfinder = require('portfinder');
const ip = require('ip');

var port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 57600
});

const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  let tail;

  port.on('error', err => console.log(err));

  port.on('data', data => {

    if (tail) {
      data = Buffer.concat([tail, data]);
    }

    if (data.length & 1) {
      tail = data.slice(-1);
      data = data.slice(0, -1);
    } else {
      tail = undefined;
    }

    ws.send(data);
    // console.log(data.length);
    // ws.send(new Int16Array(10));
  });

  ws.on('message', function incoming(message) {

    port.write(
      message,
      err => {
        if (err) {
          console.log(err.message);
        }
      }
    );
  });

});

port.on('open', () => {

  portfinder.getPort(function (err, port) {
    if (err) {
      throw err;
    }
    server.listen(port, function listening() {
      console.log('(Ctrl + Click) on:\nhttp://' + ip.address() + ':' + server.address().port + '/');
    });
  });

});
