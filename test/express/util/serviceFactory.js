'use strict';
var bearcat = require('bearcat');
var bearcatContextPath = require.resolve("../../../ctestbcontext.json");

function Factory() {
    bearcat.createApp([bearcatContextPath]);
    bearcat.start(function () {
        this.__lesseeService__ = bearcat.getBean('lesseeService');
    });
}

Factory.prototype.createLesseeService = function () {
    return this.__lesseeService__;
};


module.exports = function () {
    return new Factory();
};