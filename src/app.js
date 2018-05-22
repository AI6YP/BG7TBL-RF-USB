'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const rePlot = require('./re-plot');

const $ = React.createElement;
const Plot = rePlot($);

const host = window.location.hostname;
const sock = new WebSocket('ws://' + host + ':8000', 'p1');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    componentDidMount () {

        sock.onopen = event => {
            this.setState(prevState => ({ curX: 0 }));
            // sock.send(this.sweepCmd());
        };

        sock.onmessage = event => {
            const msg = JSON.parse(event.data);
            // console.log(msg);
            this.setState(prevState => msg);
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
        //   reader.readAsArrayBuffer(blob);
        };
    }

    render () {
        const that = this;
        console.log('state update');
        return $('div', {},
            $(Plot, this.state),
            $('div', {style: {color: '#fff', fontSize: '24px'}},
                $('div', {},
                    $('span', {className: 'blk', style: {width: '100px'}}, 'Center: '),
                    $('input', {
                        type: 'number',
                        value: this.state.center,
                        onChange: function (evnt) {
                            const value = Number(evnt.target.value);
                            sock.send(JSON.stringify({center: value}));
                        }
                    }),
                    ' Hz'
                ),
                $('div', {},
                    $('span', {className: 'blk', style: {width: '100px'}}, 'Span: '),
                    $('input', {
                        type: 'number',
                        value: this.state.span,
                        onChange: function (evnt) {
                            const value = Number(evnt.target.value);
                            sock.send(JSON.stringify({span: value}));
                        }
                    }),
                    ' Hz'
                ),
                $('div', {},
                    $('span', {className: 'blk', style: {width: '100px'}}, 'Samples: '),
                    $('input', {
                        type: 'number',
                        value: this.state.samples,
                        onChange: function (evnt) {
                            const value = Number(evnt.target.value);
                            sock.send(JSON.stringify({samples: value}));
                        }
                    })
                ),
                $('div', {},
                    $('span', {className: 'blk', style: {width: '512px'}},
                        'Filename: ',
                        $('input', {
                            type: 'string',
                            value: this.state.filename,
                            onChange: function (evnt) {
                                const value = evnt.target.value;
                                sock.send(JSON.stringify({filename: value}));
                            }
                        })
                    ),
                    $('span', {className: 'blk', style: {width: '256px'}},
                        'sweep: ',
                        $('input', {
                            type: 'checkbox',
                            checked: this.state.sweep,
                            onClick: function (evnt) {
                                const value = evnt.target.checked;
                                sock.send(JSON.stringify({sweep: value}));
                            }
                        })
                    ),
                    $('span', {className: 'blk', style: {width: '256px'}},
                        'record: ',
                        $('input', {
                            type: 'checkbox',
                            checked: this.state.record,
                            onClick: function (evnt) {
                                const value = evnt.target.checked;
                                sock.send(JSON.stringify({record: value}));
                            }
                        })
                    )
                )
            )
        );
    }
}

ReactDOM.render(
    $(App, {
        width: 1024,
        height: 500,
        p1d: [],
        p1dmax: []
    }),
    document.getElementById('root')
);
