'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var _ = require('underscore');
var Station = require('../../domain/lesseeAndMember/station');

function Repository() {
    var MONGODB_SERVICE_HOST = process.env.MONGODB_SERVICE_HOST ? process.env.MONGODB_SERVICE_HOST : "127.0.0.1";
    var MONGODB_SERVICE_PORT = process.env.MONGODB_SERVICE_PORT ? process.env.MONGODB_SERVICE_PORT : "27017";
    this.dBUrl = `mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/TestGLesseeAuthentication`;
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

Repository.prototype.getStationByID = function (lesseeID, stationID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        var cursor = db.collection('station').find({"lesseeID": lesseeID, "stationID": stationID});
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
Repository.prototype.delStation = function (lesseeID, stationID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        mongoDB.collection('station').deleteOne({"lesseeID": lesseeID, "stationID": stationID}, cb);
    }], function (err, document) {
        if (err) {
            callback(err, false);
            mongoDB.close();
            return;
        }
        if (document.result.n == 0) {
            callback(null, false);
            mongoDB.close();
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