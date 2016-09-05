'use strict';
var _ = require('underscore');
var express = require('express');
var router = express.Router();
var errCodeTable = require('../../util/errCode.js');

router.post('/lessees/:lesseeID/stations', function (req, res) {
    var resultJSON = {};
    var lesseeID = req.params.lesseeID;
    var stationData = req.body;
    var serviceFactory = req.app.get('serviceFactory');
    var lesseeService = serviceFactory.createLesseeService();
    lesseeService.addStationToLessee(lesseeID, stationData, function (err, stationID) {
        if (err) {
            resultJSON.errcode = errCodeTable.ERR.errCode;
            resultJSON.errmsg = errCodeTable.ERR.errMsg;
            resultJSON.stationID = null;
            res.send(resultJSON);
            return;
        }
        if (!stationID) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            resultJSON.stationID = null;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.stationID = stationID;
        res.send(resultJSON);
    });
});

module.exports = router;