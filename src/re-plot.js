'use strict';

const numToFreq = require('./num-to-freq');
const reGrid = require('./re-grid');
const reLine = require('./re-line');

function t (x, y) {
    return 'translate(' + (x || '0') + (y ? (',' + y) : '') + ')';
}

const m = {left: 48, right: 7, top: 16, bottom: 32};

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

function genPlot ($) {
    const Grid = reGrid($);
    const Line = reLine($);

    return function Plot (props) {
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
                            .p1d { stroke: #ff0; fill: none; }
                            .p1dmax { stroke: #550; fill: none; }
                            .label { font-size: 16px; stroke: none; fill: #fff; }
                        `)
                    ),
                    $('g', {transform: t(m.left + .5, m.top + .5)},
                        $(Grid, props),
                        $(Line, props)
                    )
                )
            )
        );
    };
}

module.exports = genPlot;
