'use strict';

module.exports = (x, y) => ({
    transform: 'translate(' + (x || '0') + (y ? (',' + y) : '') + ')'
});
