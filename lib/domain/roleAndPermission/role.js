'use strict';
//var Permission = require('./permission.js');

function Role(role) {
    this.roleID = role.roleID;
    this.roleName = role.roleName;
    this.permissions = role.permissions ? role.permissions : [];
};

Role.prototype.addPermissions = function (permissions) {
    var flag = 0;
    for (var permission of permissions) {
        for (var _permission of this.permissions) {
            if(_permission.permissionID == permission.permissionID){
                flag = 1;
            }
        }
        if(flag == 0){
            this.permissions.push(permission);
        }
    }
};

Role.prototype.removePermissions = function (permissionIDs) {
    for (var permissionID of permissionIDs) {
        var index = 0;
        for (var permission of this.permissions) {
            if(permission.permissionID == permissionID){
                this.permissions.splice(index, 1);
            }
            index++;
        }
    }
};

module.exports = Role;