'use strict';
var _ = require('underscore');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var bearcat = require('bearcat');
var should = require('should');
var Member = require('../../../lib/domain/lesseeAndMember/member.js');
var muk = require('muk');

describe('member repository MongoDB and http use case test', function () {
    var repository;
    
    before(function () {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            repository = bearcat.getBean('memberRepository');
        });
    });
    describe('#getMemberByID(memberID, callback)//callback(err,member)', function () {
        context('get an member for id', function () {
            it('should return null if no this member', function (done) {
               var memberID = "noMemberID";
               repository.getMemberByID(memberID, function (err, member) {
                   _.isNull(member).should.be.eql(true);
                   done();
               });
            });
            it('should return member if http is ok', function (done) {
                var mockRequest = function (options, callback) {
                    callback(null, {}, {
                        errcode: 0,
                        errcodemsg: "ok",
                        userInfo: {
                            corpID: "corpID",
                            userID: "userID",
                            username: "username",
                            tags: [{
                                tagID: 'tagsID1',
                                tagName: "tagsName1"
                            }, {
                                tagID: 'tagsID2',
                                tagName: "tagsName2"
                            }],
                            state: "follow"
                        }
                    });
                };
                muk(repository, "__httpRequest__", mockRequest);
                var memberID = "memberID";
                repository.getMemberByID(memberID, function (err, member) {
                    member.memberID.should.be.eql("userID");
                    member.memberInfo.name.should.be.eql("username");
                    member.lesseeID.should.be.eql("corpID");
                    member.roles.length.should.be.eql(2);
                    member.state.should.be.eql("follow");
                    done();
                });
            });
            after(function () {
                muk.restore();
            });
        });
    });
    // describe('#checkPermission(memberID, permissionID, callback)//callback(err,isSuccess)', function () {
    //     context('check permissions by memberID and permissionID', function () {
    //         it('should return false if no this memberID', function (done) {
    //             var memberID = "noMemberID";
    //             var permissionID = "permissionID";
    //             repository.checkPermission(memberID, permissionID, function (err, isSuccess) {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('should return false if no this permissionID', function (done) {
    //             var memberID = "memberID";
    //             var permissionID = "noPermissionID";
    //             repository.checkPermission(memberID, permissionID, function (err, isSuccess) {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('should return true if success', function (done) {
    //             var memberID = "memberID";
    //             var permissionID = "permissionID";
    //             repository.checkPermission(memberID, permissionID, function (err, isSuccess) {
    //                 isSuccess.should.be.eql(true);
    //                 done();
    //             });
    //         });
    //     });
    // });
    after(function (done) {
        MongoClient.connect("mongodb://localhost:27017/TestGLesseeAuthentication", function (err, db) {
            if (err) {
                return;
            }
            db.collection('lessee').drop(function (err, response) {
                db.close();
                done();
            });
        });
    });
});
