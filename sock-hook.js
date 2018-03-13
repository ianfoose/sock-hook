
/*
Sock-Hook

A webhook for a socket based broadcasting server

Copyright 2018 Ian Foose
*/

// creates the api and socket server(s)
module.exports.createServer = function(apiOptions, socketOptions) {
	// requires
	var wicker = require('wicker');

	// config
	var apiPort = 80;
	var socketPort = 8080;
	var socketSSL;

	var apiServer;
	var socketServer;

	// Express
	var express = require('express');
	var app = express();
	var bodyParser = require('body-parser');
	var router = express.Router();
	app.use(bodyParser.urlencoded({ extended: true }));

	if(apiOptions) {
		if(apiOptions.port && !isNaN(apiOptions.port)) {
			apiPort = apiOptions.port;
		}

		if(apiOptions.ssl) { // https
			var https = require('https');
			apiServer = https.createServer(apiOptions.ssl, app).listen(apiPort);
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

	app.use('/',router);

	return { socketServer: { wicker:wicker, server:socketServer }, router: router };
}
