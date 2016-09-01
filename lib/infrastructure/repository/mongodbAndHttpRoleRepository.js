'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var request = require('request');
var _ = require('underscore');
var Role = require('../../domain/roleAndPermission/role');

function Repository() {
    this.dBUrl = "";
    this.__httpRequest__ = request;
    this.__permissionRepository__ = null;
};

Repository.prototype.saveRole = function (role, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        let updateOperations = {};
        updateOperations.roleID = role.roleID;
        updateOperations.permissions = role.permissions;
        mongoDB.collection("role").updateOne({
                roleID: role.roleID,
            },
            {
                $set: updateOperations
            },
            {
                upsert: true

            },
            cb);
    }], function (err, result) {
        if (err) {
            callback(err, false);
            mongoDB.close();
            return;
        }
        if (result.result.n == 1) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
        mongoDB.close();
    });
};
Repository.prototype.getRoleByID = function (roleID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        var cursor = db.collection('role').find({"roleID": roleID});
        cursor.limit(1).next(cb);
    }], function (err, document) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        if (_.isNull(document)) {
            callback(null, null);
            mongoDB.close();
            return;
        }
        var role = new Role(document);
        callback(null, role);
        mongoDB.close();
    });
};
Repository.prototype.getRolesByIDs = function (roleIDs, callback) {
    // var repository = this;
    // var mongoDB;
    // async.waterfall([function (cb) {
    //     MongoClient.connect(repository.dBUrl, cb);
    // }, function (db, cb) {
    //     mongoDB = db;
    //     mongoDB.collection("role").find({"roleID": {"$in": roleIDs}}).toArray(cb);
    // }, function(roleDatas, cb) {//console.log(roleDatas);
    //     var roles = [];
    //     async.each(roleDatas,
    //         function (roleData, cb) {
    //             if(!roleData){
    //                 callback(null,null);
    //                 mongoDB.close();
    //                 return;
    //             }
    //             var role = {};
    //             role.roleID = roleData.roleID;
    //             role.permissions = [];
    //             role = new Role(role);
    //             if (!roleData.permissions.permissionID) {
    //                 roles.push(role);
    //                 cb(null);
    //             } else {
    //                 repository.__permissionRepository__.getPermissionByIDs(permissionIDs, function (err, permissions) {
    //                     if (err) {
    //                         cb(err);
    //                         return;
    //                     }
    //                     role.permissions = permissions;
    //                     roles.push(role);
    //                 });
    //             }
    //         }, function (err) {
    //             if (err) {
    //                 callback(err, null);
    //                 mongoDB.close();
    //                 return;
    //             }
    //             cb(null, roles);
    //         });
    // }], function (err, roles) {console.log(roles);
    //     if (err) {
    //         callback(err, null);
    //         mongoDB.close();
    //         return;
    //     }
    //     callback(null, roles);
    //     mongoDB.close();
    // });
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        mongoDB.collection("role").find({"roleID": {"$in": roleIDs}}).toArray(cb);
    }], function (err, documents) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        var roles = [];
        for (var document of documents) {
            var role = new Role(document);
            roles.push(role);
        }
        callback(null, roles);
        mongoDB.close();
    });
};
Repository.prototype.getAllRole = function (callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        mongoDB.collection("role").find().toArray(cb);
    }], function (err, documents) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        var roles = [];
        for (var document of documents) {
            var role = new Role(document);
            roles.push(role);
        }
        callback(null, roles);
        mongoDB.close();
    });
};

module.exports = Repository;