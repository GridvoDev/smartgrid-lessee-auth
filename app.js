'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var lessee = require('./lib/express/routes/lessee.js');

var app = express();

var bearcat = require('bearcat');
var bearcatContextPath = require.resolve('./bcontext.json');
bearcat.createApp([bearcatContextPath]);
bearcat.start(function () {
    app.set('bearcat', bearcat);
});

//中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//路由注册
app.use('/', lessee);


app.listen(3000, function () {
    console.log("the server has started...");
});
