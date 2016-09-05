var _ = require('underscore');
var async = require('async');
var bearcat = require('bearcat');
var should = require('should');
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var lessee = require('../../../lib/express/routes/lessee.js');
var errCodeTable = require('../../../lib/util/errCode.js');

describe('lessees route use case test', function () {
    var app;
    var server;
    var repository;
    before(function (done) {
        async.parallel([
            function (callback) {
                app = express();
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({ extended: false }));
                app.use('/', lessee);
                server = app.listen(3001, callback);
            },
            function (callback) {
                var contextPath = require.resolve('../../../ctestbcontext.json');
                bearcat.createApp([contextPath]);
                bearcat.start(function () {
                    repository = bearcat.getBean('lesseeRepository');
                    callback(null, null);
                });
            }
        ], function (err, results) {
            if (err) {
                done(err);
                return;
            }
            done();
        });
    });
    describe('#post:/lessees/:lesseeID/stations\n' +
        'input:{stationID:"",stationName:""}\n' +
        'output:{errcode:0,errmsg:"",stationID:""}', function () {
        context('request for adding a station to the lessee', function () {
            before(function (done) {
                var lessee = {};
                var Lessee = require('../../../lib/domain/lesseeAndMember/lessee.js');
                lessee.lesseeID = "lesseeID";
                lessee = new Lessee(lessee);
                repository.saveLessee(lessee, done);
            });
            it('should response message with errcode:FAIL if post body is illegal', function (done) {
                var lesseeID = "lesseeID";
                var body = {};
                request(server)
                    .post(`/lessees/${lesseeID}/stations`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:FAIL if no a such lessee', function (done) {
                var lesseeID = "noLesseeID";
                var body = {
                    stationID: "stationID",
                    stationName: "stationName"
                };
                request(server)
                    .post(`/lessees/${lesseeID}/stations`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:OK and stationID if success', function (done) {
                var lesseeID = "lesseeID";
                var body = {
                    stationID: "stationID",
                    stationName: "stationName"
                };
                request(server)
                    .post(`/lessees/${lesseeID}/stations`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.stationID.should.be.eql("stationID");
                        done();
                    });
            });
        });
    });
    after(function (done) {
        async.parallel([
            function (callback) {
                server.close(callback);
            },
            function (callback) {
                var dbTemp;
                async.waterfall([
                    function (cb) {
                        MongoClient.connect("mongodb://localhost:27017/TestGLesseeAuthentication", cb);
                    },
                    function (db, cb) {
                        dbTemp = db;
                        dbTemp.collection('station').drop(cb);
                    },
                    function (response, cb) {
                        dbTemp.collection('lessee').drop(cb);
                    },
                    function (response, cb) {
                        dbTemp.close(cb);
                    }
                ], function (err, rslt) {
                    if (err) {
                        callback(err, rslt);
                        dbTemp.close();
                        return;
                    }
                    callback(null, rslt);
                });
            }
        ], function (err, results) {
            if (err) {
                done(err);
                return;
            }
            done();
        });
    });
});