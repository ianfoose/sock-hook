/*
Sock-Hook

A webhook for a socket based broadcasting server

Copyright 2018 Ian Foose, Foose Industries.
*/

/*

config options:

{
	"socket_server": {
		"port": 8080,
		"ssl": {
			"cert": "",
			"key": "",
			"ca": "<optional>"
		}
	},
	"api_server": {
		"port": 80,
		"ssl": {
			"cert": "",
			"key": "",
			"ca": "<optional>",
			<express SSL options>...
		}
	}
}

*/

// creates the api and socket server(s)
module.exports.createServer = function(options) {
	// dependencies
	const wicker = require('wicker');
	const express = require('express');
	const bodyParser = require('body-parser');
	const fs = require('fs');
	
	// default configs
	var defaultSocketPort = 8080;
	var defaultAPIPort = 80;

	// server options
	var socketOptions = options['socket_server'] || { port: defaultSocketPort };
	var apiOptions = options['api_server'] || { port: defaultAPIPort };

	// servers
	var apiServer;
	var socketServer;

	// Express
	var app = express();
	var router = express.Router();
	app.use(bodyParser.urlencoded({ extended: true }));

	function readConfigFile(key, config) {
		if(config[key]) {
	        let filePath = config[key];

	        // check if config file exists
	        if(fs.existsSync(filePath)) {
	            config[key] = fs.readFileSync(filePath);
	        } else {
	            throw new Error(`File, ${filePath}, not found!!`);
	        }
	    }
	    return config;
	}

	// express API options
	if(apiOptions) {
		if(apiOptions.port) {
			if(apiOptions.port && isNaN(apiOptions.port)) {
				throw new Error('API port must be numerical!!');
			} 
		} else {
			apiOptions.port = defaultAPIPort;
		}

		if(apiOptions.cors) {
			var cors = require('cors');

			var corsOptions = {
				origin: (origin, callback) => {
					if(apiOptions['cors'].indexOf(origin) !== -1) {
						callback(null, true);
					} else {
						callback(new Error('Not Allowed by CORS!!'));
					}
				},
				optionsSuccessStatus: 200 // legacy support
			}
		}

		if(apiOptions.ssl) { // https
			try {
				var https = require('https');

				// read ssl files
				var sslOptions = apiOptions.ssl;

				if(sslOptions.crt && sslOptions.key) {
					if(sslOptions['cert'].includes('.crt') || sslOptions['cert'].includes('.pem')) {
						sslOptions = readConfigFile('cert', sslOptions);
					}

					if(sslOptions['key'].includes('.key')) {
						sslOptions = readConfigFile('key', sslOptions);
					}

					if(sslOptions['ca'].includes('.crt') || sslOptions['ca'].includes('.pem')) {
						sslOptions = readConfigFile('ca', sslOptions);
					}

					apiServer = https.createServer(sslOptions, app).listen(apiOptions.port);
				} else {
					throw new Error('An SSL certifcate and private key is requried for HTTPS!!');
				}
			} catch (err) {
				throw err;
			}
		} else { // http
			try {
				var http = require('http');
				apiServer = http.createServer(app).listen(apiOptions.port);

			} catch (err) {
				throw err;
			}
		}

		console.log(`${(new Date())} API Hook Server is listening on port ${apiOptions.port}`);
	} 

	// socket server options
	if(socketOptions) {
		if(socketOptions.port) {
			if(socketOptions.port && isNaN(socketOptions.port)) {
				throw new Error('Socket server port must be numerical!!');
			}
		} else {
			socketOptions.port = defaultSocketPort;
		}
	}

	// socket server
	var socketConfig = { port: socketOptions.port };

	if(socketOptions.ssl) {
		socketConfig.ssl = socketOptions.ssl;
	}

	try {
		socketServer = wicker.createSocketServer(socketConfig);
	} catch(err) {
		throw err;
	}

	app.use('/', router);

	return { socketServer: { wicker: wicker, server: socketServer }, router: router };
}