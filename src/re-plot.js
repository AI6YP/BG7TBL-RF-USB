'use strict';

// const numToFreq = require('./num-to-freq');
const reGrid = require('./re-grid');
const reLine = require('./re-line');
const reLabels = require('./re-labels');
const m = require('./margin');
const t = require('./t');

function svgHeader (props) {
    const w = props.width + m.left + m.right - 1;
    const h = props.height + m.top + m.bottom - 1;
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
    const Labels = reLabels($);

    return function Plot (props) {
        // const w = props.width;
        // const h = props.height;
        // const center = numToFreq(props.center);
        // const span = numToFreq(props.span);
        return $('svg', svgHeader(props),
            $('defs', {},
                $('style', {}, `
                    .l1 { stroke: black; fill: none; stroke-linecap: round; stroke-width: 3 }
                    .l2 { stroke: black; fill: none; stroke-linecap: round; }
                    .g1 { stroke: hsl(130, 5%, 80%); fill: none; }
                    .g2 { stroke: hsl(130, 5%, 30%); fill: none; }
                    .p1d { stroke: hsl(60, 100%, 75%); fill: none; stroke-linejoin: round; }
                    .p1dmax { stroke: hsl(60, 100%, 25%); fill: none; stroke-linejoin: round; }
                    .label { font-size: 16px; stroke: none; fill: #fff; }
                `)
            ),
            $('g', t(.5, .5),
                $(Grid, props),
                $(Line, props),
                $(Labels, props)
            )
        );
    };
}

module.exports = genPlot;
