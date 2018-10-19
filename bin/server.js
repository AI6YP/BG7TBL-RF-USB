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

const max = (src, dst, offset) => {
    const len = src.length & 0xfffffffe;
    for (let i = 0; i < len; i += 2) {
        const past = dst.readUInt16LE(i + offset);
        const update = src.readUInt16LE(i);
        const future = Math.max(past, update);
        dst.writeUInt16LE(future, i + offset);
    }
};

const cmdGen = (fmin, fmax, samples) => {
    const span = fmax - fmin;
    const freq = ('000000000' + ((fmin / 10) |0).toString()).slice(-9);
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
        if (err1) { throw err1; }
        fs.appendFile(pat, dat, err => {
            if (err) { throw err; }
        });
    });
};

(() => {
    const sport = new SerialPort(devTTY, {baudRate: 57600});
    const app = express();
    app.use(express.static('public'));
    const server = http.createServer(app);
    const wss = new WebSocket.Server({server});
    const see = new events.EventEmitter();

    const samples = 256;
    const state = {
        fmin: 815e6,
        fmax: 1015e6,
        samples: samples,
        sweep: true,
        filename: Date.now() + '.csv',
        play: false,
        record: false,
        curX: 0,
        tail: Buffer.alloc(4 * samples),
        max: Buffer.alloc(4 * samples)
    };

    // for(let i = 0; i < state.tail.length; i += 2) {
    //     state.tail.writeUInt16LE(0, i);
    //     state.max.writeUInt16LE(0, i);
    // }

    see.on('cmd', message => {
        message = JSON.parse(message);
        // console.log('cmd', message);
        Object.assign(state, message);
        see.emit('data', state);
        if (state.sweep) {
            const cmd = cmdGen(state.fmin, state.fmax, state.samples);
            sport.write(cmd, err => {
                if (err) {
                    console.log(err.message);
                }
            });

        }
    });

    sport.on('data', data => {
        data.copy(state.tail, state.curX);
        max(data, state.max, state.curX);
        // const oldTail = state.tail;
        // const newTail = Buffer.concat([oldTail, data]);
        // state.tail = newTail;
        see.emit('data', state);
        const len = state.curX + data.length;
        if (len >= 4 * state.samples) {
            state.curX = 0;
            // if (state.record) {
            //     appendData(state);
            // }
            // state.tail = Buffer.from([]);
            if (state.sweep) {
                const cmd = cmdGen(state.fmin, state.fmax, state.samples);
                sport.write(cmd, err => {
                    if (err) {
                        console.log(err.message);
                    }
                });
            }
        } else {
            state.curX = len;
        }
    });

    sport.on('error', err => console.log(err));

    wss.on('connection', (ws, req) => {

        see.on('data', message => {
            // console.log('data', message);
            try {
                ws.send(JSON.stringify(message));
            } catch (err) {
                console.log(err);
            }
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
