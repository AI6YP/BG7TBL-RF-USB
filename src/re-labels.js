'use strict';

/*
    Spectrum analyzer grid with markers and text labels
*/

const numToFreq = require('./num-to-freq');
const range = require('lodash.range');
const t = require('./t');
const m = require('./margin');

module.exports = function ($) {
    return function Labels (props) {
        const xStep = ((props.width - m.left - m.right) / m.steps.x) |0;
        const yStep = ((props.height - m.top - m.bottom) / m.steps.y) |0;
        return (
            $('g', t(m.left, m.top),
                $('rect', {
                    x: 0, y: 0,
                    width: xStep * m.steps.x,
                    height: yStep * m.steps.y,
                    className: 'g1'
                }),
                range(m.steps.y + 1).map(i => $('text', {
                    key: i,
                    x: -5,
                    y: i * yStep + 5,
                    textAnchor: 'end',
                    className: 'label'
                }, -i * m.steps.y)),
                range(1, m.steps.x).map(i => $('text', {
                    key: i,
                    x: i * xStep,
                    y: m.steps.y * yStep + 18,
                    textAnchor: 'middle',
                    className: 'label'
                }, numToFreq(props.center - (props.span / 10 * (i - 5)))))
            )
        );
    };
};
