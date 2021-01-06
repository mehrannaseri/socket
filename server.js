const SOCKET_PORT = 8080;
const REDIS = {
    "host": "127.0.0.1",
    "port": "6379",
    "password": "",
    "family": 4
};
function handler(request, res) {

    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
}
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var ioRedis = require('ioredis');
var redis = new ioRedis(REDIS);
app.listen(SOCKET_PORT, function() {
    console.log(new Date + ' - Server is running on port ' + SOCKET_PORT + ' and listening Redis on port ' + REDIS.port + '!');
});

io.on('connection', function(socket) {
    console.log('A client connected');
});

redis.psubscribe('*', function(err, count) {
    console.log('Subscribed a');
});
redis.on('pmessage', function(subscribed, channel, data) {
    // data = JSON.parse(data);
    console.log(data);
    io.emit(channel , data);
});
