'use strict';

/*
    frequency response and the maximum line plots
*/

const readInt16LEy = (arr, index) =>
    499 - (arr[2 * index] + (arr[2 * index + 1] << 8));

module.exports = function ($) {
    return function Line (props) {
        if (props.tail) {
            const xs = props.width / props.samples / 2;
            const arr = props.tail.data;
            const len = arr.length / 2;
            let p1d = 'M0 ' + readInt16LEy(arr, 0);
            for (let i = 2; i < len; i += 1) {
                p1d += 'L' + (xs * i) + ' ' + readInt16LEy(arr, i);
            }
            // const p1dmax = props.p1dmax.reduce((res, e, i) => {
            //     if (i > 0) {
            //         res += ' L';
            //     }
            //     return res += (i + ' ' + (499 - e));
            // }, 'M');
            return ($('g', {},
                // $('path', {className: 'p1dmax', d: p1dmax}),
                $('path', {className: 'p1d', d: p1d})
            ));
        } else {
            return null;
        }
    }
};
