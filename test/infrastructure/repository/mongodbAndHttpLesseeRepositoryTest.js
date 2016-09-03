'use strict';
var _ = require('underscore');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var bearcat = require('bearcat');
var should = require('should');
var Lessee = require('../../../lib/domain/lesseeAndMember/lessee.js');
var LesseeInfo = require('../../../lib/domain/lesseeAndMember/lesseeInfo.js');

describe('lessee repository MongoDB and http use case test', function () {
    var repository;

    before(function (done) {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {//TODO 1、bearcat.stop？？？ 2、lesseeInfo应该从微信来，这个还没改过来！
            repository = bearcat.getBean('lesseeRepository');
            done();
        });
    });
    describe('#saveLessee(lessee,callback)//callback(err,isSuccess)', function () {
        context('save a lessee', function () {
            it('should return true if save success', function (done) {
                var lesseeInfo = new LesseeInfo({lesseeName: "lesseeName"});
                var lessee = new Lessee({
                    lesseeID: "lesseeID",
                    lesseeInfo: lesseeInfo,
                    isActived: true
                });
                repository.saveLessee(lessee, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getLesseeByID(lesseeID,callback)//callback(err,lessee)', function () {
        context('get a lessee by id', function () {
            it('should return null if no exits such lessee', function (done) {
                var lesseeID = "noLesseeID";
                repository.getLesseeByID(lesseeID, function (err, lessee) {
                    _.isNull(lessee).should.be.eql(true);
                    done();
                });
            });
            it('should return a lessee if success', function (done) {
                var lesseeID = "lesseeID";
                repository.getLesseeByID(lesseeID, function (err, lessee) {
                    lessee.lesseeID.should.be.eql("lesseeID");
                    //lessee.lesseeInfo.should.be.eql({ name: "the lessee name" });
                    lessee.isActived.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after(function (done) {
        MongoClient.connect("mongodb://localhost:27017/TestGLesseeAuthentication", function (err, db) {
            if (err) {
                done(err);
                return;
            }
            db.collection('lessee').drop(function (err, response) {
                db.close();
                done();
            });
        });
    });
});
