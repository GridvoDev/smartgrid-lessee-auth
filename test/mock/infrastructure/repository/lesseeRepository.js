'use strict';

var Lessee = require('../../../../lib/domain/lesseeAndMember/lessee.js');

function Repository() {
}

Repository.prototype.saveLessee = function (lessee, callback) {
    callback(null, true);
};
Repository.prototype.getLesseeByID = function (lesseeID, callback) {
    if (lesseeID == "noLesseeID") {
        callback(null, null);
        return;
    }
    var lessee = {};
    lessee.lesseeID = lesseeID;
    lessee.lesseeInfo = {};
    lessee.lesseeInfo.name = "the lessee";
    lessee = new Lessee(lessee);
    callback(null, lessee);
};

module.exports = Repository;