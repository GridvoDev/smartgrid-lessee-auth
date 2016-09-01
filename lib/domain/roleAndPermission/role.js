'use strict';
//var Permission = require('./permission.js');

function Role(role) {
    this.roleID = role.roleID;
    this.roleName = role.roleName;
    this.permissions = role.permissions ? role.permissions : [];
};

Role.prototype.addPermissions = function (permissionIDs) {
    var flag = 0;
    for (var permissionID of permissionIDs) {
        for (var ind in this.permissions) {
            if(this.permissions[ind].indexOf(permissionID) > -1){
                flag = 1;
            }
        }
        if(flag == 0){
            this.permissions.push(permissionID);
        }
    }

};

Role.prototype.removePermissions = function (permissionIDs) {
    for (var permissionID of permissionIDs) {
        for (var ind in this.permissions) {
            if(this.permissions[ind].indexOf(permissionID) > -1){
                delete this.permissions[ind];
            }
        }
    }
};

module.exports = Role;