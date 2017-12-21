'use strict';

module.exports = function (f) {
    if ((f % 10000000) === 0) {
        return (f / 1000000000) + ' GHz';
    }
    if ((f % 10000) === 0) {
        return (f / 1000000) + ' MHz';
    }
    if ((f % 10) === 0) {
        return (f / 1000) + ' KHz';
    }
    return f + ' Hz';
};
