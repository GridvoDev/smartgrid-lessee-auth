'use strict';

function Member(member) {
    this.memberID = member.memberID;
    this.memberInfo = member.memberInfo;
    this.lesseeID = member.lesseeID;
    this.roles = member.roles ? member.roles : [];
    this.state = member.state ? member.state : false;
}
Member.prototype.hadPermission = function (permissionID) {
    for (var role of this.roles) {
        for (var permission of role.permissions) {
            if(permissionID == permission.permissionID){
                return true;
            }
        }
    }
    return false;
};

module.exports = Member;