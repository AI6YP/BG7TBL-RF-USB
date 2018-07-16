'use strict';

const m = require('./margin');
const t = require('./t');

/*
    frequency response and the maximum line plots
*/

module.exports = function ($) {

    const readInt16LEy = (arr, index, scale) => {
        return (scale * (499 - (arr[2 * index] + (arr[2 * index + 1] << 8)))) |0;
    };

    return function Line (props) {
        // console.log(props);

        if (props.tail) {
            const ys = ((props.height / m.steps.y) |0) / 50;
            const xs = ((props.width / m.steps.x) |0) * m.steps.x / props.samples / 2;

            const arr = props.tail.data;
            const len = arr.length / 2;
            let p1d = 'M0 ' + readInt16LEy(arr, 0, ys);
            for (let i = 2; i < len; i += 1) {
                p1d += 'L' + ((xs * i)|0) + ' ' + readInt16LEy(arr, i, ys);
            }

            const arrMax = props.max.data;
            const lenMax = arrMax.length / 2;
            let p1dmax = 'M0 ' + readInt16LEy(arrMax, 0, ys);
            for (let i = 2; i < lenMax; i += 1) {
                p1dmax += 'L' + ((xs * i)|0) + ' ' + readInt16LEy(arrMax, i, ys);
            }

            return ($('g', t(m.left, m.top),
                $('path', {className: 'p1dmax', d: p1dmax}),
                $('path', {className: 'p1d', d: p1d})
            ));
        } else {
            return null;
        }
    };
};
