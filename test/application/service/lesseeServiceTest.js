'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');
var muk = require('muk');

describe('lessee service use case test', function () {
    var service;
    before(function (done) {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('lesseeService');
            done();
        });
    });
    describe('#registerLessee(lesseeData,callback)//callback(err,isSuccess)', function () {
        context('register and save lessee data', function () {
            it('fail if no lessee data', function (done) {
                var lesseeData = null;
                service.registerLessee(lesseeData, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if lessee data is illegal', function (done) {
                var lesseeData = {};
                lesseeData.lesseeID = null;
                service.registerLessee(lesseeData, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', function (done) {
                var lesseeData = {};
                lesseeData.lesseeID = "lesseeID";
                lesseeData.lesseeName = "lesseeName";
                service.registerLessee(lesseeData, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#changeLesseeActiveState(lesseeID,isActived,callback)//callback(err,isSuccess)', function () {
        context('change lessee active state', function () {
            it('fail if data is illegal', function (done) {
                var lesseeID = null;
                service.changeLesseeActiveState(lesseeID, true, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if no exits such lessee', function (done) {
                var lesseeID = "noLesseeID";
                service.changeLesseeActiveState(lesseeID, true, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', function (done) {
                var lesseeID = "lesseeID";
                var isActived = true;
                service.changeLesseeActiveState(lesseeID, isActived, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#addStationToLessee(lesseeID,stationData,callback)//callback(err,stationID)', function () {
        context('add station to lessee', function () {
            it('fail if no exits such lessee', function (done) {
                var lesseeID = "noLesseeID";
                var stationData = {};
                stationData.stationID = "stationID";
                stationData.stationName = "stationName";
                service.addStationToLessee(lesseeID, stationData, function (err, stationID) {
                    _.isNull(stationID).should.be.eql(true);
                    done();
                });
            });
            it('fail if no station data', function (done) {
                var lesseeID = "lesseeID";
                var stationData = {};
                service.addStationToLessee(lesseeID, stationData, function (err, stationID) {
                    _.isNull(stationID).should.be.eql(true);
                    done();
                });
            });
            it('success', function (done) {
                var lesseeID = "lesseeID";
                var stationData = {};
                stationData.stationID = "stationID";
                stationData.stationName = "stationName";
                service.addStationToLessee(lesseeID, stationData, function (err, stationID) {
                    stationID.should.be.eql("stationID");
                    done();
                });
            });
        });
    });
    describe('#delStationFromLessee(lesseeID,stationID,callback)//callback(err,isSuccess)', function () {
        context('del station from lessee', function () {
            it('fail if no exits such lessee', function (done) {
                var lesseeID = "noLesseeID";
                var stationID = "stationID";
                service.delStationFromLessee(lesseeID, stationID, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if no stationID', function (done) {
                var lesseeID = "lesseeID";
                var stationID = "noStationID";
                service.delStationFromLessee(lesseeID, stationID, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', function (done) {
                var lesseeID = "lesseeID";
                var stationID = "stationID";
                service.delStationFromLessee(lesseeID, stationID, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#assignMemberToLesseeStation(stationID,memberID,callback)//callback(err,isSuccess)', function () {
        context('assign member to one station', function () {
            it('fail if no exits such station', function (done) {
                var stationID = "noStationID";
                var memberID = "memberID";
                service.assignMemberToLesseeStation(stationID, memberID, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if no exits such member', function (done) {
                var stationID = "stationID";
                var memberID = "noMemberID";
                service.assignMemberToLesseeStation(stationID, memberID, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', function (done) {
                var stationID = "stationID";
                var memberID = "memberID";
                service.assignMemberToLesseeStation(stationID, memberID, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#obtainMemberDutyStations(memberID,callback)//callback(err,stationDatas)', function () {
        context('obtain the stations which the member in charge of', function () {
            it('fail if no exits such member', function (done) {
                var memberID = "noMemberID";
                service.obtainMemberDutyStations(memberID, function (err, stationDatas) {
                    _.isNull(stationDatas).should.be.eql(true);
                    done();
                });
            });
            it('success', function (done) {
                var memberID = "memberID";
                service.obtainMemberDutyStations(memberID, function (err, stationDatas) {
                    stationDatas.should.be.eql([{stationID: "stationID", stationName: "stationName"}]);
                    done();
                });
            });
        });
    });
});