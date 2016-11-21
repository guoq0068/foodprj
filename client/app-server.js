var express        =   require('express');
var bodyParser     =   require("body-parser");

var app            =    express();

var kittchen       =    require('./src/server/router/Kittchen');

var MyDb            = require('./src/server/MyDb')

var mbaidu           = require('./src/server/router/MyBaidu')



app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));

var ip = '0.0.0.0';
var port = 3000;
var server = app.listen(port, ip);
var io = require('socket.io').listen(server);

var title = 'Untitled Presentation';


const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use('/kittchen',kittchen);
app.use('/baidu', mbaidu);



// -----------------------------------
//  Socket.io
// -----------------------------------

io.sockets.on('connect', function (socket) {

    // -----------------------------------
    //  Events from Clients
    // -----------------------------------

    socket.on('cooklist', function(payload) {
        //保存socket实例，用来通知客户端。
        kittchen.setMySocket(socket);
    });

    socket.on('orderlist', function(payload) {
        console.log('orderlis is called');

        kittchen.setCookListSocket(socket);
    });

    socket.on('disconnect', function () {
        console.log('remove is called');
        kittchen.removeSocket(socket);
    })

    socket.on('message', function(payload) {
        var data = JSON.parse(payload);

        if(data.msgtype == 'dealend') {
            MyDb.update_msg_status(data);
        }
    })
});

mbaidu.getOauthToken();
console.log('Server is running at http://' + ip + ':' + port);