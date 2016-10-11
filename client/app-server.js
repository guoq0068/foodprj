var express        =   require('express');
var bodyParser     =   require("body-parser");

var myutil         = require("./src/server/myutil");

var app = express();

const fs = require('fs');
const sqlite = require('sql.js');

const filebuffer = fs.readFileSync('db/usda-nnd.sqlite3');

const db = new sqlite.Database(filebuffer);

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));

var ip = '0.0.0.0';
var port = 3000;
var server = app.listen(port, ip);
var io = require('socket.io').listen(server);

var title = 'Untitled Presentation';


const COLUMNS = [
    'sugar_g',
    'carbohydrate_g',
    'protein_g',
    'kcal',
    'description',
];

const COLUMNS_MENU = [
    'id',
    'name'
];

app.get('/api/food', (req, res) => {
    const param = req.query.q;

    if (!param) {
        res.json({
            error: 'Missing required parameter `q`',
        });
        return;
    }

    // WARNING: Not for production use! The following statement
    // is not protected against SQL injections.
    const r = db.exec(`
    select ${COLUMNS.join(', ')} from entries
    where description like '%${param}%'
    limit 100
  `);

    if (r[0]) {
        res.json(
            r[0].values.map((entry) => {
                const e = {};
                COLUMNS.forEach((c, idx) => {
                    e[c] = entry[idx];
                });
                return e;
            }),
        );
    } else {
        res.json([]);
    }
});




// -----------------------------------
//  Get Kittchen  function
// -----------------------------------

app.get('/kittchen/test', (req, res) => {
    const result = {
        ordernum: 0,
        menulist: []
    }
    const r = db.exec(`
        select ${COLUMNS_MENU.join(', ')} from menu
        where active = 1
        `);

    if (r[0]) {
        /*
        result.menulist = r[0].values.map((entry) => {
            const e = {};
            COLUMNS_MENU.forEach((c, idx) => {
                e[c] = entry[idx];
            });

        }); */
        var orderno  = myutil.get_order_no();
        console.log("the no is %d", orderno);
        result.ordernum = orderno[0];
        console.log(result);
        res.json(result);

    } else {
        res.json(result);
    }
});

/**
 * 获取厨房的菜单
 */
app.get('/kittchen/getmenulist', (req, res) => {

    const r = db.exec(`
        select ${COLUMNS_MENU.join(', ')} from menu
        where active = 1
        `);

    if (r[0]) {
        res.json(
            r[0].values.map((entry) => {
                const e = {};
                COLUMNS_MENU.forEach((c, idx) => {
                    e[c] = entry[idx];
                });
                return e;
            }),
        );
    } else {
        res.json([]);
    }
});

app.post('/kittchen/postselectdata', (req, res)  => {
    var jsonStr = '';
    try {
        jsonStr = JSON.parse(req.body.data);
        console.log(jsonStr);
    } catch (err) {
        jsonStr = null;
    }
    jsonStr ? res.send({"status":"success"}) : res.send({"status":"error"});
    
})
// -----------------------------------
//  Game Server Data
// -----------------------------------

var BOARD_SIZE = 15;

function GameServer() {
    this.connections = [];
    this.board = [];
    this.currentColor = 0;
    this.isFinished = false;
    this.lastRow = -1;
    this.lastCol = -1;
}

GameServer.prototype = {

    init: function() {
        this.board = [];
        this.currentColor = 0;
        this.isFinished = false;
        this.lastRow = -1;
        this.lastCol = -1;

        for (var i = 0; i < BOARD_SIZE; i++) {
            this.board.push([]);

            for (var j = 0; j < BOARD_SIZE; j++) {
                this.board[i].push(-1);
            }
        }

        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].color = -2;
        }
    },

    move: function(row, col, color, playerId) {
        this.board[row][col] = color;
        this.currentColor = 1 - this.currentColor;
        this.lastRow = row;
        this.lastCol = col;
    },

    isBoardFull: function() {
        for (var i = 0; i < BOARD_SIZE; i++) {
            for (var j = 0; j < BOARD_SIZE; j++) {
                if (this.board[i][j] === -1) {
                    return false;
                }
            }
        }

        return true;
    },

    hasWinner: function(row, col, color) {
        var i = 0, j = 0, n1 = 0, n2 = 0;

        // Check horizontal
        i = row; j = col - 1; n1 = 0;
        while (j >= 0 && this.board[i][j] === color) { n1++; j--; }

        j = col + 1; n2 = 0;
        while (j < BOARD_SIZE && this.board[i][j] === color) { n2++; j++ }

        if (n1 + n2 >= 4) return true;

        // Check vertical
        i = row - 1; j = col; n1 = 0;
        while (i >= 0 && this.board[i][j] === color) { n1++; i--; }

        i = row + 1; n2 = 0;
        while (i < BOARD_SIZE && this.board[i][j] === color) { n2++; i++ }

        if (n1 + n2 >= 4) return true;

        // Check diagonal
        i = row - 1; j = col - 1; n1 = 0;
        while (i >= 0 && j >= 0 && this.board[i][j] === color) { n1++; i--; j--; }

        i = row + 1; j = col + 1; n2 = 0;
        while (i < BOARD_SIZE && j < BOARD_SIZE && this.board[i][j] === color) { n2++; i++; j++; }

        if (n1 + n2 >= 4) return true;

        // Check reverse diagonal
        i = row - 1; j = col + 1; n1 = 0;
        while (i >= 0 && j < BOARD_SIZE && this.board[i][j] === color) { n1++; i--; j++; }

        i = row + 1; j = col - 1; n2 = 0;
        while (i < BOARD_SIZE && j >= 0 && this.board[i][j] === color) { n2++; i++; j--; }

        if (n1 + n2 >= 4) return true;

        return false;
    },
    
    addConnection: function(connection) {
        console.log('add connection: %s', connection.socket.id);
        var idx = this.connections.findIndex(function (conn) { return conn.socket.id === connection.socket.id });

        if (idx === -1) {
            this.connections.push(connection);
        } else {
            this.connections[idx] = connection;
        }
    },

    removeConnection: function(id) {
        console.log('remove connection: %s', id);
        var idx = this.connections.findIndex(function (conn) { return conn.socket.id === id });

        if (idx > -1) {
            var connection = this.connections[idx];

            connection.socket.disconnect();
            this.connections.splice(idx, 1);

            // If a player disconnected, reset the game
            if (connection.color >= 0) {
                this.init();
            }
        }
    },

    isColorPicked: function(color) {
        return this.connections.findIndex(function (conn) { return conn.color === color }) >= 0;
    },

    getPlayers: function() {
        var arr = [];
        for (var i = 0; i < this.connections.length; i++) {
            var conn = this.connections[i];
            if (conn.color >= 0) {
                arr.push({ id: conn.socket.id.substr(2), color: conn.color, name: conn.name });
            }
        }
        return arr;
    },

    getWatchers: function() {
        var arr = [];
        for (var i = 0; i < this.connections.length; i++) {
            var conn = this.connections[i];
            if (conn.color === -1) {
                arr.push({ id: conn.socket.id.substr(2), color: conn.color, name: conn.name });
            }
        }
        return arr;
    },

    getConnections: function() {
        return {
            players: this.getPlayers(),
            watchers: this.getWatchers(),
            onlineCnt: this.connections.length
        };
    },

    getConnectionName: function(id) {
        var idx = this.connections.findIndex(function (conn) { return conn.socket.id === id });
        
        if (idx > -1) {
            return this.connections[idx].name;
        }

        return '';
    },

    getGameData: function() {
        return {
            board: this.board,
            currentColor: this.currentColor,
            isFinished: this.isFinished,
            lastRow: this.lastRow,
            lastCol: this.lastCol
        };
    },

    quit: function(id) {
        var idx = this.connections.findIndex(function (conn) { return conn.socket.id === id });

        if (idx > -1) {
            var connection = this.connections[idx];

            if (connection.color >= 0) {
                this.init();
            } else {
                connection.color = -2;
            }
        }
    }
};

var game = new GameServer();
game.init();

// -----------------------------------
//  Socket.io
// -----------------------------------

io.sockets.on('connect', function (socket) {

    // -----------------------------------
    //  Events from Clients 
    // -----------------------------------
    socket.once('message', function (payload) {
        console.log("message received");
        console.log(payload);
    });

    socket.once('disconnect', function () {
        game.removeConnection(socket.id);

        
    });

    socket.on('join', function (payload) {
        var color = payload.color;
        var name = payload.name;

        // Sanity check
        if (color >= 0 && game.isColorPicked(color)) {
            socket.emit('throw', { message: (color ? 'White' : 'Black') + ' is picked' });
            return;
        }

        game.addConnection({ socket: socket, color: color, name: name });

        io.sockets.emit('updateConnection', game.getConnections());
        io.sockets.emit('updateGame', game.getGameData());
    });

    socket.on('move', function (payload) {
        game.move(payload.row, payload.col, payload.color, socket.id.substr(2));

        if (game.hasWinner(payload.row, payload.col, payload.color)) {
            game.isFinished = true;
            io.sockets.emit('hasWinner', { name: game.getConnectionName(socket.id) });
        } else if (game.isBoardFull()) {
            game.isFinished = true;
            io.sockets.emit('boardFull');
        }

        io.sockets.emit('updateGame', game.getGameData());
    });

    socket.on('quit', function () {
        game.quit(socket.id);
        io.sockets.emit('updateConnection', game.getConnections());
    });

    // -----------------------------------
    //   Dispatch to Single Client
    // -----------------------------------

    socket.emit('updateConnection', game.getConnections());

});

console.log('Server is running at http://' + ip + ':' + port);