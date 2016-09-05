// 'use strict';
// var bearcat = require('bearcat');
// var bearcatContextPath = require.resolve('../../bcontext.json');
//
// function Factory() {
//     var self = this;
//     bearcat.createApp([bearcatContextPath]);
//     bearcat.start(function () {
//         self.__lesseeService__ = bearcat.getBean('lesseeService');
//     });
// }
//
// Factory.prototype.createLesseeService = function () {
//     return this.__lesseeService__;
// };
//
//
// module.exports = function () {
//     return new Factory();
// };