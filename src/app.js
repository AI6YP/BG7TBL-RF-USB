'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const genPlot = require('./plot');

const $ = React.createElement;
const Plot = genPlot($);

const c = {
  start: String.fromCharCode(0x8f),
  version: 'v',
  fset: 'f',
  sweep: 'x',
  freq: '299000000',
  step:  '00005000',
  smpl:      '0500'
};

// const startBtn = document.getElementById('startBtn');
// const p1 = document.getElementById('p1');
//

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    componentDidMount () {

        const host = window.location.hostname;
        const sock = new WebSocket('ws://' + host + ':8000', 'p1');

        sock.onopen = event => {
            this.setState(prevState => ({ curX: 0 }));
            sock.send(c.start + c.sweep + c.freq + c.step + c.smpl);
            console.log('start');
        };

        sock.onmessage = event => {
            const blob = event.data;
            const reader = new FileReader();
            reader.addEventListener('loadend', () => {
                const data = reader.result;
                const data16 = new Int16Array(data);
                const iLen = data16.length;

                this.setState(prevState => {
                    let p1d = prevState.p1d;
                    let curX = prevState.curX;

                    if (curX === 0) {
                        p1d = 'M0 500';
                    } else {
                        p1d = prevState.p1d;
                    }
                    for(let i = 0; i < iLen; i++) {
                        p1d += ' L' + (i + curX) + ' ' + (499 - data16[i]);
                    }
                    curX += iLen;
                    // console.log(curX);
                    if (curX === 1000) {
                        curX = 0;
                        sock.send(c.start + c.sweep + c.freq + c.step + c.smpl);
                    }
                    return {
                        p1d: p1d,
                        curX: curX
                    };
                });
            // console.log(data16);
          })
          reader.readAsArrayBuffer(blob);
        };
    }

    render () {
        return $(Plot, this.state);
    }
}

ReactDOM.render(
    $(App, {
        width: 1000,
        height: 500,
        freq: c.freq,
        step: c.step,
        smpl: c.smpl,
        p1d: '',
        curX: 0
    }),
    document.getElementById('root')
);
