#!/usr/bin/env node

'use strict';

const events = require('events');
const SerialPort = require('serialport');
const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const portfinder = require('portfinder');
const ip = require('ip');
const fs = require('fs-extra');
const path = require('path');

const devTTY = '/dev/ttyUSB0';

const cmdList = {
    start: String.fromCharCode(0x8f),
    version: 'v',
    fset: 'f',
    sweep: 'x'
};

const cmdGen = (center, span, samples) => {
    const freq = ('000000000' + (((center - (span / 2)) / 10) |0).toString()).slice(-9);
    const step = ('00000000' + (((span / samples) / 10) |0).toString()).slice(-8);
    const smpl = ('0000' + (samples).toString()).slice(-4);
    return cmdList.start + cmdList.sweep + freq + step + smpl;
};

const appendData = state => {
    const pat = path.resolve(process.cwd(), state.filename);
    const arr = state.tail;
    const len = arr.length / 2;
    const dat = Array.apply(null, Array(len))
        .map((e, i) => arr.readInt16LE(2 * i))
        .join(',') + '\n';
    fs.ensureFile(pat, err1 => {
        if (err1) { throw err; }
        fs.appendFile(pat, dat, err => {
            if (err) { throw err; }
        });
    })
};

(() => {
    const sport = new SerialPort(devTTY, {baudRate: 57600});
    const app = express();
    app.use(express.static('public'));
    const server = http.createServer(app);
    const wss = new WebSocket.Server({server});
    const see = new events.EventEmitter();

    const state = {
        center: 915e6,
        span: 26e6,
        samples: 512,
        filename: Date.now() + '.csv',
        play: false,
        record: false,
        tail: Buffer.from([])
    };

    see.on('cmd', message => {
        message = JSON.parse(message);
        // console.log('cmd', message);
        Object.assign(state, message);
        see.emit('data', state);
        if (state.sweep) {
            const cmd = cmdGen(state.center, state.span, state.samples);
            sport.write(cmd, err => {
                if (err) { console.log(err.message); }
            });

        }
    });

    sport.on('data', data => {
        const oldTail = state.tail;
        const newTail = Buffer.concat([oldTail, data]);
        state.tail = newTail;
        see.emit('data', state);
        if (newTail.length >= 4 * state.samples) {
            if (state.record) {
                appendData(state);
            }
            state.tail = Buffer.from([]);
            if (state.sweep) {
                const cmd = cmdGen(state.center, state.span, state.samples);
                sport.write(cmd, err => {
                    if (err) { console.log(err.message); }
                });
            }
        }
    });

    sport.on('error', err => console.log(err));

    wss.on('connection', (ws, req) => {

        see.on('data', message => {
            // console.log('data', message);
            ws.send(JSON.stringify(message));
        });

        see.emit('data', state);

        ws.on('message', message => {
            see.emit('cmd', message);
        });
    });

    sport.on('open', () => {
        console.log('opened: ' + devTTY);

        portfinder.getPort((err, port) => {
            if (err) { throw err; }
            server.listen(port, () => {
                console.log('(Ctrl + Click) on:\nhttp://' + ip.address() + ':' + server.address().port + '/');
            });
        });

    });

})();
