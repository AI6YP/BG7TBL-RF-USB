'use strict';

function genPlot ($) {

    function svgHeader (props) {
        const w = props.width + 1;
        const h = props.height + 1;
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
            $('g', {stroke: '#777'},
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
                        stroke: (i === 5) ? '#bbb' : undefined
                    });
                }),
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
                    const y = (i * yStep) |0;
                    return $('line', {
                        x1: 0, y1: y,
                        x2: w, y2: y,
                        key: i
                    });
                })
            )
        );
    }

    function Line (props) {
        return (
            $('path', {d: props.p1d})
        );
    }

    function Plot (props) {
        const w = props.width;
        const h = props.height;
        const freq = Number(props.freq + '0');
        const step = Number(props.step + '0');
        const smpl = Number(props.smpl);
        const span = step * smpl
        const fmax = freq + span;
        const center = (freq + fmax) / 2;
        return (
            $('div', {},
                $('svg', svgHeader(props),
                    $('defs', {},
                        $('style', {}, `
                            .l1 { stroke: black; fill: none; stroke-linecap: round; stroke-width: 3 }
                            .l2 { stroke: black; fill: none; stroke-linecap: round; }
                        `)
                    ),
                    $('g', {transform: 'translate(.5,.5)', stroke: '#ff0', fill: 'none'},
                        $(Grid, props),
                        $(Line, props)
                    ),
                    $('g', {transform: 'translate(10, 490)', fill: '#fff'},
                        $('text', {}, 'Center: ' + center + ' Span: ' + span)
                    )
                )
            )
        );
    }

    return Plot;
}

module.exports = genPlot;
