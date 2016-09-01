'use strict';

function Station(station) {
    this.stationID = station.stationID;
    this.stationInfo = station.stationInfo;
    this.lesseeID = station.lesseeID;
    this.members = station.members ? station.members : [];
}

Station.prototype.addMember = function (member) {
    this.members.push(member.memberID);
};

module.exports = Station;