'use strict';

const c = {
  start: String.fromCharCode(0x8f),
  version: 'v',
  fset: 'f',
  sweep: 'x',
  freq: '240000000',
  step:  '00010000',
  smpl:      '1000'
};

const startBtn = document.getElementById('startBtn');
const p1 = document.getElementById('p1');

const host = window.location.hostname;
const sock = new WebSocket('ws://' + host + ':8000', 'p1');
let curX = 0;
sock.onmessage = function (event) {
  const blob = event.data;
  const reader = new FileReader();
  reader.addEventListener('loadend', function () {
    const data = reader.result;
    const data16 = new Int16Array(data);

    let p1d;
    if (curX === 0) {
      p1d = 'M0 500';
    } else {
      p1d = p1.getAttribute('d');
    }
    const iLen = data16.length;
    for(let i = 0; i < iLen; i++) {
      p1d += ' L' + (i + curX) + ' ' + (499 - data16[i]);
    }
    p1.setAttribute('d', p1d);
    curX += iLen;
    console.log(curX);
    if (curX === 2000) {
      curX = 0;
      sock.send(c.start + c.sweep + c.freq + c.step + c.smpl);
    }
    // console.log(data16);
  })
  reader.readAsArrayBuffer(blob);
};

sock.onopen = function (event) {
  startBtn.onclick = function () {
    curX = 0;
    sock.send(c.start + c.sweep + c.freq + c.step + c.smpl);
  };
};
