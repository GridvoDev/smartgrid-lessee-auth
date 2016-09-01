'use strict';
var bearcat = require('bearcat');
var constants = require('./lib/util/constants');
var bearcatContextPath = require.resolve('./bcontext.json');

bearcat.createApp([bearcatContextPath]);
var createLesseeService;
//...

bearcat.start(function () {
    createLesseeService = function () {
        return bearcat.getBean('lesseeService');
    };
    //...
});

module.exports.createLesseeService = createLesseeService;
//...
module.exports.constants = constants;