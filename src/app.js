'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const rePlot = require('./re-plot');
const debounce = require('lodash.debounce');

const m = require('./margin');

const $ = React.createElement;
const Plot = rePlot($);

const host = window.location.hostname;
// const sock = new WebSocket('ws://' + host + ':8000', 'p1');

function reGenInput ($) {
    return function (config) {
        const that = this;
        return function (props) {
            const x = (((props.width - m.left - m.right) / m.steps.x) |0) * m.steps.x * config.x + m.left - 50;
            const y = (((props.height - m.top - m.bottom) / m.steps.y) |0) * m.steps.y * config.y + m.top + 10;
            return $('input', {
                type: 'text',
                style: {left: x + 'px', top: y + 'px'},
                value: that.state[config.id],
                onChange: function (evnt) {
                    that.setState(() => {
                        const res = {};
                        res[config.id] = Number(evnt.target.value);
                        return res;
                    });
                    // sock.send(JSON.stringify({center: value}));
                }
            });
        };
    }
};

const genInput = reGenInput($);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    updateDimentions () {
        this.setState(() =>
            ({width: window.innerWidth, height: window.innerHeight}));
    }

    componentDidMount () {

        this.updateDimentions();
        window.addEventListener('resize', debounce(this.updateDimentions.bind(this), 500));

        // sock.onopen = () => {
        //     this.setState(() => ({ curX: 0 }));
        //     // sock.send(this.sweepCmd());
        // };

        // sock.onmessage = event => {
        //     const msg = JSON.parse(event.data);
        //     // console.log(msg);
        //     this.setState(prevState => msg);
        //     const reader = new FileReader();
        //     reader.addEventListener('loadend', () => {
        //         const data = reader.result;
        //         const data16 = new Int16Array(data);
        //         const iLen = data16.length;
        //
        //         this.setState(prevState => {
        //             let p1d = prevState.p1d;
        //             let p1dmax = prevState.p1dmax;
        //             let curX = prevState.curX;
        //             let reset = prevState.reset;
        //
        //             if (curX === 0 && prevState.reset) {
        //                 p1dmax = [];
        //                 reset = false;
        //             }
        //
        //             for(let i = 0; i < iLen; i++) {
        //                 p1d[i + curX] = data16[i];
        //                 p1dmax[i + curX] = Math.max((p1dmax[i + curX] || 0), data16[i]);
        //             }
        //             curX += iLen;
        //             // console.log(curX);
        //             if (curX === (2 * samples)) {
        //                 curX = 0;
        //                 sock.send(this.sweepCmd());
        //             }
        //             return {
        //                 p1d: p1d,
        //                 p1dmax: p1dmax,
        //                 curX: curX,
        //                 reset: reset
        //             };
        //         });
        //     // console.log(data16);
        //   })
          // reader.readAsArrayBuffer(blob);
        // };
    }

    render () {
        const that = this;

        console.log(this.state);

        return $('div', {},
            $(Plot, this.state),
            $(genInput.call(this, {id: 'fmin', x: 0, y: 1}), this.state),
            $(genInput.call(this, {id: 'fmax', x: 1, y: 1}), this.state),

            // $('input', {
            //     type: 'text',
            //     style: {bottom: '6px', left: '2px'},
            //     value: this.state.fmin,
            //     onChange: function (evnt) {
            //         const value = Number(evnt.target.value);
            //         this.setState(() => ({fmin: value}));
            //         // sock.send(JSON.stringify({center: value}));
            //     }
            // }),
            // $('input', {
            //     type: 'text',
            //     style: {bottom: '6px', right: '2px'},
            //     value: this.state.fmax,
            //     onChange: function (evnt) {
            //         const value = Number(evnt.target.value);
            //         this.setState(() => ({fmax: value}));
            //         // sock.send(JSON.stringify({center: value}));
            //     }
            // })
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
        fmin: 902,
        fmax: 928,
        p1d: [],
        p1dmax: []
    }),
    document.getElementById('root')
);

/* eslint-env browser */
