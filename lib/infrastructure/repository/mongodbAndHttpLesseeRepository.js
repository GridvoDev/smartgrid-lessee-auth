'use strict';

var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var Lessee = require('../../domain/lesseeAndMember/lessee.js');

function Repository() {
    this.dBUrl =  "";
}

Repository.prototype.saveLessee = function (lessee, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([
        function (cb) {
            MongoClient.connect(repository.dBUrl, cb);
        },
        function (db, cb) {
            mongoDB = db;
            var updateOperations = {};
            updateOperations.lesseeID = lessee.lesseeID;
            updateOperations.lesseeInfo = {};
            updateOperations.lesseeInfo.name = lessee.lesseeInfo.name;
            updateOperations.isActived = lessee.isActived;
            mongoDB.collection('lessee').updateOne({
                    lesseeID: updateOperations.lesseeID
                },
                {
                    $set: updateOperations
                },
                {
                    upsert: true

                },
                cb);
        }
    ], function (err, result) {
        if (err) {
            callback(err, false);
            mongoDB.close();
            return;
        }
        if (result.result.n == 1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
        mongoDB.close();
    });
};
Repository.prototype.getLesseeByID = function (lesseeID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([
        function (cb) {
            MongoClient.connect(repository.dBUrl, cb);
        }, function (db, cb) {
            mongoDB = db;
            var cursor = db.collection('lessee').find({'lesseeID': lesseeID});
            cursor.limit(1).next(cb);
        }
    ], function (err, document) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        if (_.isNull(document)) {
            callback(null, null);
            mongoDB.close();
            return;
        }
        var lessee = new Lessee(document);
        callback(null, lessee);
        mongoDB.close();
    });
};

module.exports = Repository;