'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const update = require('immutability-helper');
const rePlot = require('./re-plot');
const debounce = require('lodash.debounce');
const t = require('./t');

const m = require('./margin');

const $ = React.createElement;
const Plot = rePlot($);

const host = window.location.hostname;
const sock = new WebSocket('ws://' + host + ':8000', 'p1');

const style = config => {
    const w = 100;
    const anchor =
        (config.anchor === 'end') ? -w :
            (config.anchor === 'start') ? 0 : -w / 2;
    const align =
        (config.anchor === 'end') ? 'right' :
            (config.anchor === 'start') ? 'left' : 'center';

    return props => {
        const xStep = (props.width / m.steps.x) |0;
        const yStep = (props.height / m.steps.y) |0;
        const x = xStep * m.steps.x * config.x + m.left + anchor;
        const y = yStep * m.steps.y * config.y + m.top; //  + m.top + 10;
        return {
            left: x + 'px',
            top: y + 'px',
            width: w + 'px',
            textAlign: align
        };
    };
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    updateDimentions () {
        this.setState(() => ({
            width: window.innerWidth - m.left - m.right - 1,
            height: window.innerHeight - m.top - m.bottom - 1
        }));
    }

    updateCursor (event) {
        const mx = event.pageX;
        console.log(mx);
        this.setState(() => ({
            mx: mx
        }));
    }

    componentDidMount () {
        this.updateDimentions();
        window.addEventListener('resize', debounce(this.updateDimentions.bind(this), 500));
        document.addEventListener('mousemove', debounce(this.updateCursor.bind(this), 100));

        sock.onopen = () => {
            // console.log('open');
            // this.setState(() => ({ curX: 0 }));
            sock.send(JSON.stringify({sweep: true}));
        };

        sock.onmessage = event => {
            const msg = JSON.parse(event.data);
            // console.log(msg);
            this.setState(prevState => msg);
            // const reader = new FileReader();
            // reader.addEventListener('loadend', () => {
            //     const data = reader.result;
            //     const data16 = new Int16Array(data);
            //     const iLen = data16.length;
            //
            //     this.setState(prevState => {
            //         let p1d = prevState.p1d;
            //         let p1dmax = prevState.p1dmax;
            //         let curX = prevState.curX;
            //         let reset = prevState.reset;
            //
            //         if (curX === 0 && prevState.reset) {
            //             p1dmax = [];
            //             reset = false;
            //         }
            //
            //         for(let i = 0; i < iLen; i++) {
            //             p1d[i + curX] = data16[i];
            //             p1dmax[i + curX] = Math.max((p1dmax[i + curX] || 0), data16[i]);
            //         }
            //         curX += iLen;
            //         // console.log(curX);
            //         if (curX === (2 * samples)) {
            //             curX = 0;
            //             sock.send(this.sweepCmd());
            //         }
            //         return {
            //             p1d: p1d,
            //             p1dmax: p1dmax,
            //             curX: curX,
            //             reset: reset
            //         };
            //     });
            // // console.log(data16);
            // })
            // reader.readAsArrayBuffer(blob);
        };
    }

    render () {
        return $('div', {},
            $(Plot, this.state),
            $('input', {
                type: 'text',
                style: style({id: 'fmin', x: 0, y: 1, anchor: 'start'})(this.state),
                value: this.state.fmin,
                onChange: evnt => {
                    const val = evnt.target.value;
                    const num = Number(val);
                    this.setState(() => ({fmin: isNaN(num) ? val : num}));
                    if (isNaN(num)) {
                        sock.send(JSON.stringify({fmin: num}));
                    }
                }
            }),
            $('input', {
                type: 'text',
                style: style({id: 'fmax', x: 1, y: 1, anchor: 'end'})(this.state),
                value: this.state.fmax,
                onChange: evnt => {
                    const val = evnt.target.value;
                    const num = Number(val);
                    this.setState(() => ({fmax: isNaN(num) ? val : num}));
                    if (isNaN(num)) {
                        sock.send(JSON.stringify({fmax: num}));
                    }
                }
            })
        );
                // $('div', {
                //
                // }, 'ddfg d fg df'
//                     $('defs', {},
//                         $('style', {}, `
// div.f1 {
//     position: absolute;
//     top: 25px;
//     left: 25px;
//     width: 400px;
//     height: 200px;
// }`)
                    // )
                // ),
                // ),
                    // $('span', {className: 'blk', style: {width: '100px'}}, 'Center: '),
                    // $('input', {
                    //     type: 'number',
                    //     value: this.state.center,
                    //     onChange: function (evnt) {
                    //         const value = Number(evnt.target.value);
                    //         sock.send(JSON.stringify({center: value}));
                    //     }
                    // }),
                    // ' Hz'
            //     $('div', {},
            //         $('span', {className: 'blk', style: {width: '100px'}}, 'Span: '),
            //         $('input', {
            //             type: 'number',
            //             value: this.state.span,
            //             onChange: function (evnt) {
            //                 const value = Number(evnt.target.value);
            //                 sock.send(JSON.stringify({span: value}));
            //             }
            //         }),
            //         ' Hz'
            //     ),
            //     $('div', {},
            //         $('span', {className: 'blk', style: {width: '100px'}}, 'Samples: '),
            //         $('input', {
            //             type: 'number',
            //             value: this.state.samples,
            //             onChange: function (evnt) {
            //                 const value = Number(evnt.target.value);
            //                 sock.send(JSON.stringify({samples: value}));
            //             }
            //         })
            //     ),
            //     $('div', {},
            //         $('span', {className: 'blk', style: {width: '512px'}},
            //             'Filename: ',
            //             $('input', {
            //                 type: 'string',
            //                 value: this.state.filename,
            //                 onChange: function (evnt) {
            //                     const value = evnt.target.value;
            //                     sock.send(JSON.stringify({filename: value}));
            //                 }
            //             })
            //         ),
            //         $('span', {className: 'blk', style: {width: '256px'}},
            //             'sweep: ',
            //             $('input', {
            //                 type: 'checkbox',
            //                 checked: this.state.sweep,
            //                 onClick: function (evnt) {
            //                     const value = evnt.target.checked;
            //                     sock.send(JSON.stringify({sweep: value}));
            //                 }
            //             })
            //         ),
            //         $('span', {className: 'blk', style: {width: '256px'}},
            //             'record: ',
            //             $('input', {
            //                 type: 'checkbox',
            //                 checked: this.state.record,
            //                 onClick: function (evnt) {
            //                     const value = evnt.target.checked;
            //                     sock.send(JSON.stringify({record: value}));
            //                 }
            //             })
            //         )
                // )
            // )
        // );
    }
}

ReactDOM.render(
    $(App, {
        width: 1024,
        height: 500,
        fmin: 400e6,
        fmax: 500e6,
        p1d: [],
        p1dmax: [],
        mx: 0
    }),
    document.getElementById('root')
);

/* eslint-env browser */
