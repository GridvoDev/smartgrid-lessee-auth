'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var express = require('express');
var router = express.Router();

var lesseeService;
var contextPath = require.resolve('../../../bcontext.json');
bearcat.createApp([contextPath]);
bearcat.start(function () {
    lesseeService = bearcat.getBean('lesseeService');
});

router.post('/lessees/:lesseeID/stations', function (req, res) {
    var resultJSON = {};
    var lesseeID = req.params.lesseeID;
    var stationData = req.body;
    lesseeService.addStationToLessee(lesseeID, stationData, function (err, stationID) {
        if (err) {
            resultJSON.errcode = 500;
            resultJSON.errmsg = "Server internal error, please try again later.";
            resultJSON.stationID = null;
            res.send(resultJSON);
            return;
        }
        if (!stationID) {
            resultJSON.errcode = 400;
            resultJSON.errmsg = "Fail";
            resultJSON.stationID = null;
            res.send(resultJSON);
            return;
        }
        resultJSON.errcode = 200;
        resultJSON.errmsg = "OK";
        resultJSON.stationID = stationID;
        res.send(resultJSON);
    });
});

module.exports = router;