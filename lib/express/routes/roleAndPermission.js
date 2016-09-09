'use strict';
var _ = require('underscore');
var express = require('express');
var router = express.Router();
var errCodeTable = require('../../util/errCode.js');

router.post('/permissions', function (req, res) {
    var resultJSON = {};
    var permissionData = req.body;
    var bearcat = req.app.get('bearcat');
    var roleAndPermissionService = bearcat.getBean('roleAndPermissionService');
    roleAndPermissionService.registerPermission(permissionData, function (err, permissionID) {
        if (err) {
            resultJSON.errcode = errCodeTable.ERR.errCode;
            resultJSON.errmsg = errCodeTable.ERR.errMsg;
            resultJSON.permissionID = null;
            res.send(resultJSON);
            return;
        }
        if (!permissionID) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            resultJSON.permissionID = null;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.permissionID = permissionID;
        res.send(resultJSON);
    });
});
router.get('/permissions', function (req, res) {
    var resultJSON = {};
    var bearcat = req.app.get('bearcat');
    var roleAndPermissionService = bearcat.getBean('roleAndPermissionService');
    roleAndPermissionService.obtainAllPermission(function (err, permissionData) {
        if (err) {
            resultJSON.errcode = errCodeTable.ERR.errCode;
            resultJSON.errmsg = errCodeTable.ERR.errMsg;
            resultJSON.permissionData = null;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.permissionData = permissionData;
        res.send(resultJSON);
    });
});
router.delete('/permissions/:permissionID', function (req, res) {
    var resultJSON = {};
    var permissionID = req.params.permissionID;
    var bearcat = req.app.get('bearcat');
    var roleAndPermissionService = bearcat.getBean('roleAndPermissionService');
    roleAndPermissionService.removePermission(permissionID, function (err, isSuccess) {
        if (err) {
            resultJSON.errcode = errCodeTable.ERR.errCode;
            resultJSON.errmsg = errCodeTable.ERR.errMsg;
            resultJSON.isSuccess = false;
            res.send(resultJSON);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            resultJSON.isSuccess = isSuccess;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.isSuccess = isSuccess;
        res.send(resultJSON);
    });
});
router.post('/roles/:roleID/permissions', function (req, res) {
    var resultJSON = {};
    var roleID = req.params.roleID;
    var permissionIDs = req.body.permissionIDs;
    var bearcat = req.app.get('bearcat');
    var roleAndPermissionService = bearcat.getBean('roleAndPermissionService');
    roleAndPermissionService.assignPermissionsToRole(permissionIDs, roleID, function (err, isSuccess) {
        if (err) {
            resultJSON.errcode = errCodeTable.ERR.errCode;
            resultJSON.errmsg = errCodeTable.ERR.errMsg;
            resultJSON.isSuccess = false;
            res.send(resultJSON);
            return;
        }
        if (!isSuccess) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            resultJSON.isSuccess = false;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.isSuccess = true;
        res.send(resultJSON);
    });
});
// router.put('/lessees/:lesseeID/stations/:stationID', function (req, res) {
//     var resultJSON = {};
//     var lesseeID = req.params.lesseeID;
//     var stationID = req.params.stationID;
//     var memberID = req.body.memberID;
//     var bearcat = req.app.get('bearcat');
//     var roleAndPermissionService = bearcat.getBean('roleAndPermissionService');
//     roleAndPermissionService.assignMemberToLesseeStation(lesseeID, stationID, memberID, function (err, isSuccess) {
//         if (err) {
//             resultJSON.errcode = errCodeTable.ERR.errCode;
//             resultJSON.errmsg = errCodeTable.ERR.errMsg;
//             resultJSON.isSuccess = false;
//             res.send(resultJSON);
//             return;
//         }
//         if (!isSuccess) {
//             resultJSON.errcode = errCodeTable.FAIL.errCode;
//             resultJSON.errmsg = errCodeTable.FAIL.errMsg;
//             resultJSON.isSuccess = false;
//             res.send(resultJSON);
//             return;
//         }
//         resultJSON.errcode = errCodeTable.OK.errCode;
//         resultJSON.errmsg = errCodeTable.OK.errMsg;
//         resultJSON.isSuccess = true;
//         res.send(resultJSON);
//     });
// });

module.exports = router;