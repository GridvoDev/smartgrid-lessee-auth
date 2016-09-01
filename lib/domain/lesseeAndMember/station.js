'use strict';

function StationInfo(stationInfo) {
    this.name = stationInfo.name;
}
function Station(station) {
    this.stationID = station.stationID;
    this.stationInfo = new StationInfo(member.stationInfo);
    this.lesseeID = station.lesseeID;
    this.members = station.members ? station.members : [];
}

Station.prototype.addMember = function (member) {
    this.members.push(member.memberID);
};

module.exports = Station;