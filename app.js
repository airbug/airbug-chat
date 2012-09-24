//app.js Socket IO Test

var app = require("express")(),
	server = require('http').createServer(app),
    redis = require('socket.io/node_modules/redis'),
    io = require('socket.io').listen(server);

var port = 9133;
var url = "clingfish.redistogo.com";
var pass = "d8e4a2f9af34aa8ae7164e86ce41ca60";

var pub = redis.createClient(port, url);
var sub = redis.createClient(port, url);
var client = redis.createClient(port, url);
pub.auth(pass, function(){console.log("Connected pub.")});
sub.auth(pass, function(){console.log("Connected sub.")});
client.auth(pass, function(){console.log("Connected client.")});

/* var pub = redis.createClient();
var sub = redis.createClient();
var client = redis.createClient(); */

io.configure( function(){
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.set('log level', 1);                    // reduce logging
	io.set('transports', [                     // enable all transports (optional if you want flashsocket)
	    'websocket'
	  , 'flashsocket'
	  , 'htmlfile'
	  , 'xhr-polling'
	  , 'jsonp-polling'
	]);
	var RedisStore = require('socket.io/lib/stores/redis');
	io.set('store', new RedisStore({redisPub:pub, redisSub:sub, redisClient:client}));
});

server.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var buffer = [];
io.sockets.on('connection', function(client){
	var room = "";
	
    client.on("setNickAndRoom", function(nick, fn){
    	fn({msg : "Hello " + nick.nick});
    	client.join(nick.room);
    	room = nick.room;
    	client.broadcast.to(room).json.send({ msg: "Connected to Room: " + nick.room, nick: nick });
    });

    client.on('message', function(message, fn){
        var msg = message; //{ message: [client.sessionId, message] };
        buffer.push(msg);
        if (buffer.length > 15)
        	buffer.shift();
        client.broadcast.to(room).json.send(msg);
        fn(msg);
    });

    client.on('disconnect', function(){
    	client.broadcast.to(room).json.send({ msg: "Disconnected"});
    });
    
});



