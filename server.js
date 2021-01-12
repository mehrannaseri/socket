require('dotenv').config();
const SOCKET_PORT = process.env.SOCKET_PORT;
const REDIS = {
    "host": process.env.REDIS_HOST,
    "port": process.env.REDIS_PORT,
    "password": process.env.REDIS_PASSWORD,
    "family": 4
};

var http = require('http');
var app = require('http').createServer();
var io = require('socket.io')(app);
var ioRedis = require('ioredis');
var redis = new ioRedis(REDIS);
http.createServer(function (req, res) {

    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        "Access-Control-Allow-Credentials": false,
        "Content-Type": "application/json",
    });

    var url = req.url;
    req.on('data', (chunk) => {
        let body = JSON.parse(chunk);
        if(url ==='/add') {

            redis.psubscribe(body['topic'], function(err, count) {
                console.log('Subscribed a');
            });
            redis.on('pmessage', function(subscribed, channel, data) {
                console.log(data);
                io.emit(channel , data);
            });
            res.end(JSON.stringify({ code: 200, error:false, message: "topic added" }));
        }
    });
    io.on('connection', function(socket) {
        console.log('A client connected');
    });
}).listen(process.env.PORT, function() {
    console.log("server start at port "+process.env.PORT);
    app.listen(SOCKET_PORT, function() {
        console.log(new Date + ' - Server is running on port ' + SOCKET_PORT + ' and listening Redis on port ' + REDIS.port + '!');
    });
});

