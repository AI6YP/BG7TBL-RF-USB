'use strict';

/*
    frequency response and the maximum line plots
*/

module.exports = function ($) {
    return function Line (props) {
        const p1d = props.p1d.reduce((res, e, i) => {
            if (i > 0) {
                res += ' L';
            }
            return res += (i + ' ' + (499 - e));
        }, 'M');
        const p1dmax = props.p1dmax.reduce((res, e, i) => {
            if (i > 0) {
                res += ' L';
            }
            return res += (i + ' ' + (499 - e));
        }, 'M');
        return (
            $('g', {},
                $('path', {className: 'p1dmax', d: p1dmax}),
                $('path', {className: 'p1d', d: p1d})
            )
        );
    }
};
