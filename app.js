'use strict';
var bearcat = require('bearcat');
var kafka = require('kafka-node');
var express = require('express');
var bodyParser = require('body-parser');
var lessee = require('./lib/express/routes/lessee.js');

var app;
var bearcatContextPath = require.resolve("./production_bcontext.json");
bearcat.createApp([bearcatContextPath]);
bearcat.start(function () {
    var ZOOKEEPER_SERVICE_HOST = process.env.ZOOKEEPER_SERVICE_HOST ? process.env.ZOOKEEPER_SERVICE_HOST : "127.0.0.1";
    var ZOOKEEPER_SERVICE_PORT = process.env.ZOOKEEPER_SERVICE_PORT ? process.env.ZOOKEEPER_SERVICE_PORT : "2181";
    var Producer = kafka.Producer;
    var client = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
    var initProducer = new Producer(client);
    initProducer.on('ready', function () {
        initProducer.createTopics(["corp-auth-smartgrid-suite",
            "corp-cancel-auth-smartgrid-suite"], true, (err)=> {
            if (err) {
                console.log(err);
                return;
            }
            client.refreshMetadata(["corp-auth-smartgrid-suite", "corp-cancel-auth-smartgrid-suite"], ()=> {
                initProducer.close(()=> {
                    console.log("smartgrid-lessee-auth service init topics success");
                });
            });
        });
    });
    initProducer.on('error', (err)=> {
        console.log(err);
    });
    app = express();

//中间件

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: false }));



//路由注册

    app.use('/', lessee);

    app.listen(3000);
    console.log("corp-auth-smartgrid-suite service is starting...");
});