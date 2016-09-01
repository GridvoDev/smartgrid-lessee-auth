'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var _ = require('underscore');
var Station = require('../../domain/lesseeAndMember/station');

function Repository() {
    this.dBUrl = '';
};

Repository.prototype.saveStation = function (station, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        let updateOperations = {};
        updateOperations.stationID = station.stationID;
        updateOperations.stationInfo = station.stationInfo;
        updateOperations.lesseeID = station.lesseeID;
        updateOperations.members = station.members;
        mongoDB.collection("station").updateOne({
                stationID: station.stationID,
            },
            {
                $set: updateOperations
            },
            {
                upsert: true

            },
            cb);
    }], function (err, result) {
        if (err) {
            callback(err, false);
            mongoDB.close();
            return;
        }
        if (result.result.n == 1) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
        mongoDB.close();
    });
};

Repository.prototype.getStationByID = function (stationID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        var cursor = db.collection('station').find({"stationID": stationID});
        cursor.limit(1).next(cb);
    }], function (err, document) {
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
        var station = new Station(document);
        callback(null, station);
        mongoDB.close();
    });
};
Repository.prototype.delStation = function (stationID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        db.collection('station').deleteOne({"stationID": stationID},cb);
    }], function (err, document) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        if (document.result.n == 0) {
            callback(err, null);
            db.close();
            return;
        }
        callback(null, true);
        mongoDB.close();
    });
};
Repository.prototype.getAllStationsByMemberID = function (memberID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        db.collection('station').find({"members": memberID}).toArray(cb);
    }], function (err, documents) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        var stations = [];
        for (var document of documents) {
            var station = new Station(document);
            stations.push(station);
        }
        callback(null, stations);
        mongoDB.close();
    });
};

module.exports = Repository;