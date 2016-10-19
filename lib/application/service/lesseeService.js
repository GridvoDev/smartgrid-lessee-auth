'use strict';
var EventEmitter = require('events');
var _ = require('underscore');
var async = require('async');
var util = require('util');
var Lessee = require('../../domain/lesseeAndMember/lessee.js');
var LesseeInfo = require('../../domain/lesseeAndMember/lesseeInfo.js');
var constants = require('../util/constants');

function Service() {
    EventEmitter.call(this);
    this.__lesseeRepository__ = null;
    this.__stationRepository__ = null;
    this.__memberRepository__ = null;
}
util.inherits(Service, EventEmitter);

Service.prototype.registerLessee = function (lesseeData, callback) {
    if (!lesseeData || !lesseeData.lesseeID || !lesseeData.lesseeName) {
        callback(null, false);
        return;
    }
    var _lesseeData = {};
    _lesseeData.lesseeName = lesseeData.lesseeName;
    var lessee = {};
    lessee.lesseeID = lesseeData.lesseeID;
    lessee.lesseeInfo = new LesseeInfo(_lesseeData);
    lessee = new Lessee(lessee);
    this.__lesseeRepository__.saveLessee(lessee, function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    });
};
Service.prototype.changeLesseeActiveState = function (lesseeID, isActived, callback) {
    if (!lesseeID || (isActived !== true && isActived !== false)) {
        callback(null, false);
        return;
    }
    var self = this;
    async.waterfall([
        function (cb) {
            self.__lesseeRepository__.getLesseeByID(lesseeID, cb);
        },
        function (lessee, cb) {
            if (!lessee) {
                callback(null, false);
                return;
            }
            if (isActived) {
                lessee.active();
            } else {
                lessee.inactive();
            }
            self.__lesseeRepository__.saveLessee(lessee, cb);
        }
    ], function (err, isSuccess) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, isSuccess);
    });
};
Service.prototype.addStationToLessee = function (lesseeID, stationData, callback) {
    if (!lesseeID || !stationData || !stationData.stationID || !stationData.stationName) {
        callback(null, null);
        return;
    }
    var self = this;
    var stationID;
    async.waterfall([
        function (cb) {
            self.__lesseeRepository__.getLesseeByID(lesseeID, cb);
        },
        function (lessee, cb) {
            if (!lessee) {
                callback(null, null);
                return;
            }
            var station = lessee.createStation(stationData);
            stationID = station.stationID;
            self.__stationRepository__.saveStation(station, cb);
        }
    ], function (err, isSuccess) {
        if (err) {
            callback(err, null);
            return;
        }
        if (isSuccess) {
            callback(null, stationID);
        } else {
            callback(null, null);
        }
    });
};
Service.prototype.delStationFromLessee = function (lesseeID, stationID, callback) {
    if (!lesseeID || !stationID) {
        callback(null, false);
        return;
    }
    var self = this;
    async.waterfall([
        function (cb) {
            self.__stationRepository__.delStation(lesseeID, stationID, cb);
        }
    ], function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    });
};
Service.prototype.assignMemberToLesseeStation = function (lesseeID, stationID, memberID, callback) {
    if (!lesseeID || !stationID || !memberID) {
        callback(null, false);
        return;
    }
    var self = this;
    var _station;
    var _member;
    async.waterfall([
        function (cb) {
            self.__stationRepository__.getStationByID(lesseeID, stationID, cb);
        },
        function (station, cb) {
            if (!station) {
                callback(null, false);
                return;
            }
            _station = station;
            self.__memberRepository__.getMemberByID(memberID, cb);
        },
        function (member, cb) {
            if (!member) {
                callback(null, false);
                return;
            }
            _member = member;
            _station.addMember(_member);
            self.__stationRepository__.saveStation(_station, cb);
        }
    ], function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    });
};
Service.prototype.obtainMemberDutyStations = function (memberID, callback) {
    if (!memberID) {
        callback(null, null);
        return;
    }
    var self = this;
    async.waterfall([
        function (cb) {
            self.__stationRepository__.getAllStationsByMemberID(memberID, cb);
        }
    ], function (err, stations) {
        if (err) {
            callback(err, null);
            return;
        }
        if (!stations) {
            callback(err, null);
            return;
        }
        var stationDatas = [];
        var stationData;
        for (var station of stations) {
            stationData = {};
            stationData.stationID = station.stationID;
            stationData.stationName = station.stationInfo.stationName;
            stationDatas.push(stationData);
        }
        callback(null, stationDatas);
    });
};


module.exports = Service;
