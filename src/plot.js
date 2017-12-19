'use strict';

function t (x, y) {
    return 'translate(' + (x || '0') + (y ? (',' + y) : '') + ')';
}

function numToFreq (f) {
    if ((f % 10000000) === 0) {
        return (f / 1000000000) + ' GHz';
    }
    if ((f % 10000) === 0) {
        return (f / 1000000) + ' MHz';
    }
    if ((f % 10) === 0) {
        return (f / 1000) + ' KHz';
    }
    return f + ' Hz';
}

const m = {left: 48, right: 48, top: 8, bottom: 32};

function genPlot ($) {

    function svgHeader (props) {
        const w = props.width + 1 + m.left + m.right;
        const h = props.height + 1 + m.top + m.bottom;
        return {
            xmlns: 'http://www.w3.org/2000/svg',
            xmlnsXlink: 'http://www.w3.org/1999/xlink',
            viewBox: [0, 0, w, h],
            height: h,
            width: w
        };
    }

    function Grid (props) {
        const w = props.width;
        const h = props.height;
        const xStep = w / 10;
        const yStep = h / 10;
        return (
            $('g', {},
                $('rect', {
                    x:0, y:0,
                    width: w, height: h,
                    stroke: '#bbb'
                }),
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
                    const x = (i * xStep) |0;
                    return $('line', {
                        x1: x, y1: 0,
                        x2: x, y2: h,
                        key: i,
                        stroke: (i === 5) ? '#bbb' : '#777'
                    });
                }),
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
                    const y = (i * yStep) |0;
                    return $('line', {
                        x1: 0, y1: y,
                        x2: w, y2: y,
                        key: i,
                        stroke: '#777'
                    });
                }),
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
                    const y = (i * yStep) |0;
                    return $('text', {
                        x: -5,
                        y: y + 4,
                        key: i,
                        textAnchor: 'end',
                        className: 'label'
                    }, -(i * 10));
                }),
                $('text', {
                    x: 4,
                    y: h + 20,
                    className: 'label',
                    textAnchor: 'start'
                }, numToFreq(props.fmin)),
                $('text', {
                    x: w / 2,
                    y: h + 20,
                    className: 'label',
                    textAnchor: 'middle'
                }, numToFreq(props.f0)),
                $('text', {
                    x: w - 4,
                    y: h + 20,
                    className: 'label',
                    textAnchor: 'end'
                }, numToFreq(props.fmax))
            )
        );
    }

    function Line (props) {
        const d = props.p1d.reduce((res, e, i) => {
            if (i > 0) {
                res += ' L';
            }
            return res += (i + ' ' + (499 - e));
        }, 'M');
        return (
            $('path', {d: d})
        );
    }

    function Plot (props) {
        const w = props.width;
        const h = props.height;
        const center = numToFreq(props.center);
        const span = numToFreq(props.span);
        return (
            $('div', {},
                $('svg', svgHeader(props),
                    $('defs', {},
                        $('style', {}, `
                            .l1 { stroke: black; fill: none; stroke-linecap: round; stroke-width: 3 }
                            .l2 { stroke: black; fill: none; stroke-linecap: round; }
                            .label { font-size: 16px; stroke: none; fill: #fff; }
                        `)
                    ),
                    $('g',
                        {
                            transform: t(m.left + .5, m.top + .5),
                            stroke: '#ff0',
                            fill: 'none'
                        },
                        $(Grid, props),
                        $(Line, props)
                    )
                )
            )
        );
    }

    return Plot;
}

module.exports = genPlot;
