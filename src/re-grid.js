'use strict';

/*
    Spectrum analyzer grid with markers and text labels
*/

const range = require('lodash.range');
const t = require('./t');
const m = require('./margin');

module.exports = function ($) {
    return function Grid (props) {
        const xStep = (props.width / m.steps.x) |0;
        const yStep = (props.height / m.steps.y) |0;
        return (
            $('g', t(m.left, m.top),
                range(1, m.steps.y).map(i => {
                    const y = i * yStep;
                    return $('line', {
                        key: i,
                        x1: 0,
                        x2: m.steps.x * xStep,
                        y1: y,
                        y2: y,
                        className: 'g2'
                    });
                }),
                range(1, m.steps.x).map(i => {
                    const x = i * xStep;
                    return $('line', {
                        x1: x,
                        x2: x,
                        y1: 0,
                        y2: m.steps.y * yStep,
                        key: i,
                        className: (i === (m.steps.x / 2)) ? 'g1' : 'g2'
                    });
                })
            )
        );
    };
};
