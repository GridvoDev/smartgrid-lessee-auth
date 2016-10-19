'use strict';
var kafka = require('kafka-node');

function Consumer() {
    this.__lesseeService__ = null;
};

Consumer.prototype.startConsume = function () {
    var ZOOKEEPER_SERVICE_HOST = process.env.ZOOKEEPER_SERVICE_HOST ? process.env.ZOOKEEPER_SERVICE_HOST : "127.0.0.1";
    var ZOOKEEPER_SERVICE_PORT = process.env.ZOOKEEPER_SERVICE_PORT ? process.env.ZOOKEEPER_SERVICE_PORT : "2181";
    var client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
    var topics = [{
        topic: "corp-auth-smart-station-suite"
    }];
    var options = {
        groupId: "corp-auth-manage-group"
    };
    var consumer = new kafka.Consumer(client, topics, options);
    this.consumer = consumer;
    var self = this;
    consumer.on('message', function (message) {
        var activeStateData = JSON.parse(message.value);
        self.__lesseeService__.changeLesseeActiveState(activeStateData.corpID, true, (err, isSuccess)=> {
            if (err) {
                console.log(err);
                return;
            }
            if (isSuccess) {
                console.log(`${new Date()}:${activeStateData.corpID} corp auth change success`);
            } else {
                console.log(`${new Date()}:${activeStateData.corpID} corp auth change fail`);
            }
        });
    });
};

Consumer.prototype.stopConsume = function () {
    if (this.consumer) {
        this.consumer.close(()=> {
            console.log(`stop consume corp auth topic`);
        });
    }
};

module.exports = Consumer;