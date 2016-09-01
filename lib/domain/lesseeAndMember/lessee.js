'use strict';
var Station = require('./station.js');

function LesseeInfo(lesseeInfo) {
    this.name = lesseeInfo.name;
}
function Lessee(lessee) {
    this.lesseeID = lessee.lesseeID;
    this.lesseeInfo = new LesseeInfo(member.lesseeInfo);
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
    station.stationInfo = stationData.stationInfo;
    station.lesseeID = this.lesseeID;
    station.members = [];
    station = new Station(station);
    return station;
};

module.exports = Lessee;