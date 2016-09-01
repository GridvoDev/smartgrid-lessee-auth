'use strict';

var Member = require('../../../../lib/domain/lesseeAndMember/member.js');

function Repository() {
}

Repository.prototype.getMemberByID = function (memberID, callback) {
    if (memberID == "noMemberID") {
        callback(null, null);
        return;
    }
    var member = {};
    member.memberID = "memberID";
    member.memberInfo = {};
    member.memberInfo.name = "the member";
    member.lesseeID = "lesseeID";
    member.roles = [{
        roleID: "roleID",
        permissions: ["permissionID"]
    }];
    member = new Member(member);
    callback(null, member);
};
Repository.prototype.checkPermission = function (memberID, permissionID, callback) {
    if (memberID == "noMemberID") {
        callback(null, false);
        return;
    }
    if (permissionID == "noPermissionID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};

module.exports = Repository;