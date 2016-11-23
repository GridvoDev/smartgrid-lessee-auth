'use strict';
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var bearcat = require('bearcat');
var _ = require('underscore');
var should = require('should');
var Station = require('../../../lib/domain/lesseeAndMember/station');
var StationInfo = require('../../../lib/domain/lesseeAndMember/stationInfo');

describe('station repository MongoDB use case test', function () {
    var repository;
    before(function (done) {
        var contextPath = require.resolve('../../../unittest_application_bcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            repository = bearcat.getBean('stationRepository');
            done();
        });
    });
    describe('#saveStation(station, callback)//callback(err,isSuccess)', function () {
        context('save an station', function () {
            it('should return true if save success', function (done) {
                var station = {};
                station.stationID = "stationID";
                station.stationInfo = new StationInfo({stationName: "stationName"});
                station.lesseeID = "lesseeID";
                station.members = ["memberID", "memberID2"];
                station = new Station(station);
                repository.saveStation(station, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getStationByID(lesseeID, stationID, callback)//callback(err,station)', function () {
        context('get an station for id', function () {
            it('should return null if no this lessee', function (done) {
                var lesseeID = "noLesseeID";
                var stationID = "stationID";
                repository.getStationByID(lesseeID, stationID, function (err, station) {
                    _.isNull(station).should.be.eql(true);
                    done();
                });
            });
            it('should return null if no this station', function (done) {
                var lesseeID = "lesseeID";
                var stationID = "noStationID";
                repository.getStationByID(lesseeID, stationID, function (err, station) {
                    _.isNull(station).should.be.eql(true);
                    done();
                });
            });
            it('should return station if success', function (done) {
                var lesseeID = "lesseeID";
                var stationID = "stationID";
                repository.getStationByID(lesseeID, stationID, function (err, station) {
                    station.stationID.should.be.eql('stationID');
                    station.stationInfo.stationName.should.be.eql('stationName');
                    station.lesseeID.should.be.eql('lesseeID');
                    station.members.should.be.eql(["memberID", "memberID2"]);
                    done();
                });
            });
        });
    });
    describe('#getAllStationsByMemberID(memberID, callback)//callback(err,stations)', function () {
        context('get all stations by memberID', function () {
            it('should return null if no this memberID', function (done) {
                var memberID = "nomemberID";
                repository.getAllStationsByMemberID(memberID, function (err, stations) {
                    stations.length.should.be.eql(0);
                    done();
                });
            });
            it('should return station if exist this memberID', function (done) {
                var memberID = "memberID2";
                repository.getAllStationsByMemberID(memberID, function (err, stations) {
                    stations.length.should.be.eql(1);
                    stations[0].stationID.should.be.eql('stationID');
                    done();
                });
            });
            it('should return all station if member take change of more station', function (done) {
                var station1 = {};
                station1.stationID = "stationID1";
                station1.stationInfo = {};
                station1.stationInfo.name = "stationName";
                station1.lesseeID = "lesseeID1";
                station1.members = ["memberID", "memberID3"];
                station1 = new Station(station1);
                repository.saveStation(station1, function () {
                    var memberID = "memberID";
                    repository.getAllStationsByMemberID(memberID, function (err, stations) {
                        stations.length.should.be.eql(2);
                        done();
                    });
                });
            });
        });
    });
    describe('#delStation(lesseeID, stationID, callback)//callback(err,isSuccess)', function () {
        context('remove an account of id', function () {
            it('should return null if no this account', function (done) {
                var lesseeID = "noLesseeID";
                var stationID = "stationID";
                repository.delStation(lesseeID, stationID, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return null if no this account', function (done) {
                var lesseeID = "lesseeID";
                var stationID = "noStationID";
                repository.delStation(lesseeID, stationID, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return true if del one station', function (done) {
                var lesseeID = "lesseeID";
                var stationID = "stationID";
                repository.delStation(lesseeID, stationID, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after(function (done) {
        var MONGODB_SERVICE_HOST = process.env.MONGODB_SERVICE_HOST ? process.env.MONGODB_SERVICE_HOST : "127.0.0.1";
        var MONGODB_SERVICE_PORT = process.env.MONGODB_SERVICE_PORT ? process.env.MONGODB_SERVICE_PORT : "27017";
        MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/TestGLesseeAuthentication`, function (err, db) {
            if (err) {
                done(err);
                return;
            }
            db.collection('station').drop(function (err, response) {
                db.close();
                done();
            });
        });
    });
});
