'use strict';
var kafka = require('kafka-node');
var _ = require('underscore');
var should = require('should');
var muk = require('muk');
var bearcat = require('bearcat');

describe('corp create auth topic consumer use case test', function () {
    var consumer;
    var producer;
    var producerClient;
    before(function (done) {
        var contextPath = require.resolve('../../../unittest_kafka_bcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            var ZOOKEEPER_SERVICE_HOST = process.env.ZOOKEEPER_SERVICE_HOST ? process.env.ZOOKEEPER_SERVICE_HOST : "127.0.0.1";
            var ZOOKEEPER_SERVICE_PORT = process.env.ZOOKEEPER_SERVICE_PORT ? process.env.ZOOKEEPER_SERVICE_PORT : "2181";
            var Producer = kafka.Producer;
            producerClient = new kafka.Client(`${ZOOKEEPER_SERVICE_HOST}:${ZOOKEEPER_SERVICE_PORT}`);
            producer = new Producer(producerClient);
            producer.on('ready', function () {
                producer.createTopics(['corp-auth-smartgrid-suite'], true, (err, data)=> {
                    producerClient.refreshMetadata(['corp-auth-smartgrid-suite'], ()=> {
                        done();
                    });
                });
            });
            producer.on('error', (err)=> {
                done(err);
            });
            consumer = bearcat.getBean('corpAuthSmartgridSuiteTopicConsumer');
        });
    });
    describe('#startConsume(callback)', function () {
        context('start consume corp-auth-smartgrid-suite topic', function () {
            it('should call lesseeService.changeLesseeActiveState methods when consumer this topic', function (done) {
                var mockLesseeService = {};
                mockLesseeService.changeLesseeActiveState = ()=> {
                    done();
                };
                muk(consumer, "__lesseeService__", mockLesseeService);
                consumer.startConsume();
                var activeStateData = {
                    corpID: "lesseeID",
                    dateTime: new Date()
                };
                producer.send([{
                    topic: "corp-auth-smartgrid-suite",
                    messages: [JSON.stringify(activeStateData)]
                }], ()=> {
                });
            });
        });
    });
    after(function (done) {
        consumer.stopConsume();
        producer.close();
        producerClient.close(()=> {
            done();
        });
    });
});