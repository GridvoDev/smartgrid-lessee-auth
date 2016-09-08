var _ = require('underscore');
var async = require('async');
var bearcat = require('bearcat');
var should = require('should');
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var muk = require('muk');
var MongoClient = require('mongodb').MongoClient;
var lesseeRouter = require('../../../lib/express/routes/lessee.js');
var errCodeTable = require('../../../lib/util/errCode.js');

describe('lessees route use case test', function () {
    var app;
    var server;
    before(function (done) {
        async.parallel([
            function (callback) {
                app = express();
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({ extended: false }));
                app.use('/', lesseeRouter);
                server = app.listen(3001, callback);
            },
            function (callback) {
                var bearcatContextPath = require.resolve("../../../ctestbcontext.json");
                bearcat.createApp([bearcatContextPath]);
                bearcat.start(function () {
                    app.set('bearcat', bearcat);
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
    describe('#post:/lessees\n' +
        'input:{lesseeID:"",lesseeName:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', function () {
        context('request for register a lessee', function () {
            it('should response message with errcode:FAIL if post body is illegal', function (done) {
                var body = {};
                request(server)
                    .post(`/lessees`)
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
            it('should response message with errcode:OK and isSuccess:true if success', function (done) {
                var body = {
                    lesseeID: "lesseeID",
                    lesseeName: "lesseeName"
                };
                request(server)
                    .post(`/lessees`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.isSuccess.should.be.eql(true);
                        done();
                    });
            });
        });
    });
    describe('#post:/lessees/:lesseeID/stations\n' +
        'input:{stationID:"",stationName:""}\n' +
        'output:{errcode:0,errmsg:"",stationID:""}', function () {
        context('request for adding a station to the lessee', function () {
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
    describe('#put:/lessees/:lesseeID/stations/:stationID\n' +
        'input:{memberID: ""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', function () {
        context('request for assign member to lessee station', function () {
            it('should response message with errcode:FAIL if no a such lessee', function (done) {
                var lesseeID = "noLesseeID";
                var stationID = "stationID";
                var body = {
                    memberID: "memberID"
                };
                request(server)
                    .put(`/lessees/${lesseeID}/stations/${stationID}`)
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
            it('should response message with errcode:FAIL if no a such station', function (done) {
                var lesseeID = "lesseeID";
                var stationID = "noStationID";
                var body = {
                    memberID: "memberID"
                };
                request(server)
                    .put(`/lessees/${lesseeID}/stations/${stationID}`)
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
            // it('should response message with errcode:OK and isSuccesss:true if success', function (done) {
            //     var lesseeID = "lesseeID";
            //     var stationID = "stationID";
            //     var body = {
            //         memberID: "memberID"
            //     };
            //     var lesseeService = bearcat.getBean('lesseeService');
            //     var mockRequest = function (options, callback) {
            //         callback(null, {}, {
            //             errcode: 0,
            //             errcodemsg: "ok",
            //             userInfo: {
            //                 corpID: "corpID",
            //                 userID: "userID",
            //                 username: "username",
            //                 tags: [{
            //                     tagID: 'tagsID1',
            //                     tagName: "tagsName1"
            //                 }, {
            //                     tagID: 'tagsID2',
            //                     tagName: "tagsName2"
            //                 }],
            //                 state: "follow"
            //             }
            //         });
            //     };
            //     muk(lesseeService, "__memberRepository__.__httpRequest__", mockRequest);
            //     request(server)
            //         .put(`/lessees/${lesseeID}/stations/${stationID}`)
            //         .send(body)
            //         .expect(200)
            //         .expect('Content-Type', /json/)
            //         .end(function (err, res) {
            //             if (err) {
            //                 done(err);
            //                 return;
            //             }
            //             res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
            //             res.body.isSuccess.should.be.eql(true);
            //             muk.restore();
            //             done();
            //         });
            // });
        });
    });
    describe('#delete:/lessees/:lesseeID/stations/:stationID\n' +
        'input:{stationID:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', function () {
        context('request for delete a station to the lessee', function () {
            it('should response message with errcode:FAIL if no a such lessee', function (done) {
                var lesseeID = "noLesseeID";
                var stationID = "stationID";
                request(server)
                    .del(`/lessees/${lesseeID}/stations/${stationID}`)
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
            it('should response message with errcode:FAIL if no a such station', function (done) {
                var lesseeID = "lesseeID";
                var stationID = "noStationID";
                request(server)
                    .del(`/lessees/${lesseeID}/stations/${stationID}`)
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
            it('should response message with errcode:OK and isSuccess:true if success', function (done) {
                var lesseeID = "lesseeID";
                var stationID = "stationID";
                request(server)
                    .del(`/lessees/${lesseeID}/stations/${stationID}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.isSuccess.should.be.eql(true);
                        done();
                    });
            });
        });
    });
    describe('#put:/lessees/:lesseeID\n' +
        'input:{isActived: true}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', function () {
        context('request for change lessee activeState', function () {
            it('should response message with errcode:FAIL if no a such station', function (done) {
                var lesseeID = "noLesseeID";
                var body = {
                    isActived: true
                };
                request(server)
                    .put(`/lessees/${lesseeID}`)
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
            it('should response message with errcode:OK and isSuccess:true if success', function (done) {
                var lesseeID = "lesseeID";
                var body = {
                    isActived: true
                };
                request(server)
                    .put(`/lessees/${lesseeID}`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.isSuccess.should.be.eql(true);
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