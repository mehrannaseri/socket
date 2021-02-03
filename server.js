require('dotenv').config();
const SOCKET_PORT = process.env.SOCKET_PORT;
const REDIS = {
    "host": process.env.REDIS_HOST,
    "port": process.env.REDIS_PORT,
    "password": process.env.REDIS_PASSWORD,
    "family": 4
};
const bodyParser = require("body-parser");
var htp = require('http').createServer();
var io = require('socket.io')(htp);
var ioRedis = require('ioredis');
var redis = new ioRedis(REDIS);
const express = require("express");
const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.post("/add", function(req, res) {

    redis.psubscribe(req.body.topic, function(err, count) {
        console.log('Subscribed a');
    });
    redis.on('pmessage', function(subscribed, channel, data) {
        console.log(data);
        io.emit(channel , data);
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
        console.log('A client connected');
    });
app.listen(process.env.PORT, function(){
    console.log("server is running on port "+process.env.PORT);
})
// app.createServer(function (req, res) {
//
//     res.writeHead(200, {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
//         "Access-Control-Allow-Credentials": false,
//         "Content-Type": "application/x-www-form-urlencoded",
//     });
//
//     var url = req.url;
//     var body = '';
//     req.on('data', (chunk) => {
//         body += chunk;
//         let body = JSON.parse(chunk);
//         if(url ==='/add') {
//
//             redis.psubscribe(body['topic'], function(err, count) {
//                 console.log('Subscribed a');
//             });
//             redis.on('pmessage', function(subscribed, channel, data) {
//                 console.log(data);
//                 io.emit(channel , data);
//             });
//             res.end(JSON.stringify({ code: 200, error:false, message: "topic added" }));
//         }
//     });

//     io.on('connection', function(socket) {
//         console.log('A client connected');
//     });
// }).listen(process.env.PORT, function() {
//     console.log("server start at port "+process.env.PORT);
//     app.listen(SOCKET_PORT, function() {
//         console.log(new Date + ' - Server is running on port ' + SOCKET_PORT + ' and listening Redis on port ' + REDIS.port + '!');
//     });
// });

