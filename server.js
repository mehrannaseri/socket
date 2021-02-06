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
app.use(bodyParser.urlencoded({
    extended:true
}));

const http = require('http').Server(app);

app.listen(process.env.PORT, function(){
    console.log("server is running on port "+process.env.PORT);
})
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});
var ioRedis = require('ioredis');
var redis = new ioRedis(REDIS);
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


