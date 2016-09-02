// var bearcat = require('bearcat');
// var _ = require('underscore');
// var should = require('should');
// var express = require('express');
// var request = require('supertest');
// // var lesseeService = require('../../lib/express/routes/lessee');
// // var lesseeRoute = require('../../lib/express/routes/lessee');
//
// describe('lessees route use case test', function () {
//     var app;
//     before(function () {
//         app = express();
//         app.on('start', done);
//         var contextPath = require.resolve('../../testbcontext.json');
//         bearcat.createApp([contextPath]);
//         bearcat.start(function () {
//             DataDispatch = bearcat.getBean('dataDispatch');
//         });
//     });
//     describe('#receiveData(oData)', function () {
//         context('when a data arrive, receive this data', function () {
//             it('should emit "DATA_POINT_SAVE_SUCCESS" application event,when saved', function (done) {
//                 DataDispatch.on(appEvent.application.DATA_POINT_SAVE_SUCCESS, function (eventData) {
//                     eventData.stationName.should.be.eql("inDCStation1");
//                     eventData.timestamp.should.be.eql(new Date("2016-1-1 00:18:00"));
//                     eventData.dataName.should.be.eql("rain");
//                     eventData.value.should.be.eql(2000);
//                     done();
//                 });
//                 var oData = {};
//                 oData.stationName = "inDCStation1";
//                 oData.timestamp = "2016-1-1 00:18:00";
//                 oData.dataName = "rain";
//                 oData.value = 2000;
//                 DataDispatch.receiveData(oData);
//                 DataDispatch.removeAllListeners(appEvent.application.DATA_POINT_SAVE_SUCCESS);
//             });
//         });
//     });
//     after(function (done) {
//         MongoClient.connect("mongodb://localhost:27017/TestGLesseeAuthentication", function (err, db) {
//             if (err) {
//                 return;
//             }
//             db.collection('lessee').drop(function (err, response) {
//                 db.close();
//                 done();
//             });
//         });
//     });
// });