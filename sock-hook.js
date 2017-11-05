
/*
Sock-Hook

A webhook for a socket based broadcasting server

Copyright 2017 Ian Foose
*/

var apiServer;
var socketServer;

// Express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

// gets the router instance
module.exports.getRouter = function() {
	return router;
}

// gets the socket server instance
module.exports.getSocketServer = function() {
	return socketServer;
}

// gets the express server instance
module.exports.getExpressServer = function() {
	return apiServer;
}

// creates the api and socket server(s)
module.exports.createServer = function(apiOptions, socketOptions) {
	// requires
	var wicker = require('wicker');

	// config
	var apiPort = 80;
	var socketPort = 8080;
	var socketSSL;

	if(apiOptions) {
		if(apiOptions.port && !isNaN(apiOptions.port)) {
			apiPort = apiOptions.port;
		}

		if(apiOptions.ssl) { // https
			var https = require('https');
			apiServer = https.createServer(options, app).listen(apiPort);
		} else { // http
			var http = require('http');
			apiServer = http.createServer(app).listen(apiPort);
		}
	} 

	if(socketOptions) {
		if(socketOptions.port) {
			if(socketOptions.port && !isNaN(socketOptions.port)) {
				socketPort = socketOptions.port;
			}
		}

		if(socketOptions.ssl) {
			socketSSL = socketOptions.ssl;
		}
	}

	// socket server
	var socketConfig = { port: socketPort };

	if(socketSSL) {
		socketConfig.ssl = socketSSL;
	}

	socketServer = wicker.createSocketServer(socketConfig);

	// run server

	router.post('/sendData', function(req, res) {
		if(req.body.data) {
			wicker.sendToAll(req.body.data,'utf8');
			res.sendStatus(200);
		} else {
			res.sendStatus(400);
		}
	});

	app.use('/',router);
}