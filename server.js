require('dotenv').config();
const SOCKET_PORT = process.env.SOCKET_PORT;
const REDIS = {
    "host": process.env.REDIS_HOST,
    "port": process.env.REDIS_PORT,
    "password": process.env.REDIS_PASSWORD,
    "family": 4
};
const bodyParser = require("body-parser");
const express = require("express");
var cors = require('cors')
const app = express();
app.use(cors())
app.use(bodyParser.json());

// var http_socket = require('http').createServer();
var socket_server = require("http").Server();

var io = require("socket.io")(socket_server,{
    cors: {
        origin: '*',
    }
});

var Redis = require("ioredis");

var redis = new Redis();

app.post("/add", function(req, res) {

    redis.subscribe(req.body.topic, function(channel){
        console.log("user subscribed", req.body.topic);
    });

    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        "Access-Control-Allow-Credentials": false,
        "Content-Type": "application/json",
    })
    res.send(JSON.stringify({ code: 200, error:false, message: "topic added" }));
});
io.on('connection', function(socket) {
    console.log('A client connected', socket.id);
    socket.on('disconnect', function () {
        console.log('user disconnected', socket.id);
        // redis.unsubscribe();
    });
});

redis.on('message', function(channel, message){
    console.log(channel, message);
    io.emit(channel , message);
});

app.listen(process.env.PORT, function(){
    console.log("server is running on port "+process.env.PORT);
    socket_server.listen(SOCKET_PORT, function() {
        console.log(new Date + ' - Server is running on port ' + SOCKET_PORT + ' and listening Redis on port ' + REDIS.port + '!');
    });
})



