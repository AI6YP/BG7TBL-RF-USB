'use strict';

module.exports = function (f) {
    // return f.toString();
    return (
        (f % 100000000 === 0) ? (f / 1000000000) + '' :
            (f % 100000 === 0) ? (f / 1000000) + '' :
                (f % 100 === 0) ? (f / 1000) + '' : f + ''
    );
};
