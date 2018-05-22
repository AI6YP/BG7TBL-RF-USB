'use strict';

/*
    frequency response and the maximum line plots
*/

module.exports = function ($) {
    return function Line (props) {
        if (props.tail) {
            const arr = Uint16Array.from(props.tail.data);
            const xs = props.width / props.samples / 2;
            let p1d = 'M0 ' + (499 - arr[0]);
            for (let i = 2; i < (arr.length / 2); i += 1) {
                p1d += 'L' + (xs * i) + ' ' + (499 - arr[2 * i]);
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
