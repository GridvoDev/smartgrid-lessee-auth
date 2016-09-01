'use strict';
var Station = require('./station.js');
var StationInfo = require('./stationInfo');

function Lessee(lessee) {
    this.lesseeID = lessee.lesseeID;
    this.lesseeInfo = lessee.lesseeInfo;
    this.isActived = lessee.isActived ? lessee.isActived : true;
}
Lessee.prototype.active = function () {
    this.isActived = true;
};
Lessee.prototype.inactive = function () {
    this.isActived = false;
};

Lessee.prototype.createStation = function (stationData) {
    var station = {};
    station.stationID = stationData.stationID;
    station.stationInfo = new StationInfo({stationName: stationData.stationName});
    station.lesseeID = this.lesseeID;
    station.members = [];
    station = new Station(station);
    return station;
};

module.exports = Lessee;