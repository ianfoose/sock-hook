# Sock-Hook
A web hook for a web socket broadcast server.

## Install

### NPM

```npm install sock-hook```  

```var sockhook = require('sock-hook')```

### Manual

 ```var sockhook = require('<path_to_file>/sock-hook.js')```
 
 
### Use
 
### Server Creation

Currently only http or https is supported, not both at once.

```js
var sock = require('sock-hook');

// first object is api config, second is socket server config
sock.createServer({port: 80}, {port:8080});

```

### Options 

An options object is used to store all options for the sock-hook server.

**NOTE:** The "api-server" port may not be the same as the "socket-server" port.

```json
{
	"api-server": {
		"port": 80,
		"ssl": {
			"cert": "<path_to_cert>",
			"key": "<path_to_key>",
			"ca": "<path_to_ca>",
			"<express SSL options>..."
		}
	},
	"socket-server": {
		"port": 8080,
		"cors": ["*"],
		"ssl": {
			"cert": "<path_to_cert>",
			"key": "<path_to_key>",
			"ca": "<path_to_ca>"
		}
	}
}
```

### SSL

Both the API and Socket Server have the ability to use https, the same or different ssl credentials can be used for both.

*NOTE:** You may pass in a file path to the certs or the 'utf-8' contents of the cert/key files.

```js
var sock = require('sock-hook');

// to read ssl files
var fs = require('fs');

// ssl file options
var options = {
  cert: <path_to_cert>,
  key: <path_to_key>
}

// first object is api config, second is socket server config
sock.createServer({port: 80, ssl: options}, {port: 8080, ssl: options});
```

### Cors

For the "api-server" configuration you may setup [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) to restrict the API relay access. This is set up by passing an array of allowed URLs in the "api-server" options.

```json
...
"cors": ["*"],
...
```

### Routes

sock-hook uses express for the api routing.

Access the router and add a custom express route.

Then access the socket server and forward the data.

```js
var sock = require('sock-hook');

var server = sock.createServer({port: 80}, {port:8080});

// router object
var router = server.router;

// socket server object
var socketServer = server.socketServer.wicker;

// route
router.post('/send',function(req,res) {
	// send to all connections
	socketServer.sendToAll(req.body);
	res.sendStatus(200);
});
```

To see more socket functions, refer to https://github.com/ianfoose/wicker
