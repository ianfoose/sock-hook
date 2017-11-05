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
sock.createServer({port: 80},{port:8080});

```

### SSL

Both the API and Socket Server have the ability to use https.  

The same or different ssl credentials can be used for both.

```js
var sock = require('sock-hook');

// to read ssl files
var fs = require('fs');

// ssl file options
var options = {
  crt: fs.readFileSync(<path_to_crt>.crt,'utf8'),
  key: fs.readFileSync(<path_to_key>.key,'utf8'),
  ca: fs.readFileSync('<path_to_chain>.crt','utf8')
}

// first object is api config, second is socket server config
sock.createServer({port: 80, ssl: options},{port:8080, ssl:options});
```

### Routes

sock-hook uses express for the api routing.

Access the router and add a custom express route.

Then access the socket server and forward the data.

```js
var sock = require('sock-hook');

// router object
var router = sock.getRouter();

// socket server object
var socketServer = sock.getSocketServer();

sock.createServer({port: 80},{port:8080});

// route
router.post('/send',function(req,res) {
	// send to all connections
  socketServer.sendToAll(req.body);
});
```

To see more socket functions, refer to https://github.com/ianfoose/wicker