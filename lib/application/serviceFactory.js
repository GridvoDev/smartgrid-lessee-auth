'use strict';
var bearcat = require('bearcat');
var bearcatContextPath = require.resolve('../../bcontext.json');

bearcat.createApp([bearcatContextPath]);
bearcat.start(function () {
    module.exports.createLesseeService = function () {
        return bearcat.getBean('lesseeService');
    };
    //...
});