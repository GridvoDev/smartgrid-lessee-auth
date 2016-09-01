'use strict';

function MemberInfo(memberInfo) {
    this.name = memberInfo.name;
}
function Member(member) {
    this.memberID = member.memberID;
    this.memberInfo = new MemberInfo(member.memberInfo);
    this.lesseeID = member.lesseeID;
    this.roles = member.roles ? member.roles : [];
    this.state = member.state ? member.state : false;
}
Member.prototype.hadPermission = function (permissionID) {
    for (var ind in this.roles) {
        for (var ID of this.roles[ind].permissions) {
            if(permissionID == ID){
                return true;
            }
        }
    }
    return false;
};

module.exports = Member;