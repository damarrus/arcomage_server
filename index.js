/**
 * Created by nikita on 15.10.2016.
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const templating = require('consolidate');
const request = require('request');
const cheerio = require('cheerio');
const cards = require('./models/cards');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

/*io.sockets.on('connection' , socket => {
    console.log('connect');
    socket.on('message', data => {
        cards.getCardById(data.message, function (result) {
            data.message = result.card_name;
            io.sockets.emit('message', data);
        });
    });
});*/
// pub/sub redis node-cluster
// DigitalOcean - хостинг
// netangels.ru
app.get('/', function(req, res){
    res.render('test', {});
});
app.listen(8000);


// Load the TCP Library
const net = require('net');

// Keep track of the chat clients
var clients = [];

// Start a TCP Server
net.createServer(function (socket) {

    // Identify this client
    socket.name = 0;//socket.remoteAddress + ":" + socket.remotePort;
    clients.push(socket);
    console.log('client join');
    //console.log(clients);

    // Handle incoming messages from clients.
    socket.on('data', function (data) {
        console.log(data);
        data = data.toString('utf8').replace(/\0+$/, "");
        console.log(data);
        try {
            data = JSON.parse(data);
            console.log(data);
            switch (data['messageType']) {
                case 'getCardRandom':
                    cards.getCardRandom(function (result) {
                        result.messageType = 'getCardRandom';
                        console.log(JSON.stringify(result));
                        socket.write(JSON.stringify(result));
                    });
                    break;
                case 'auth':
                    if (data['login'] && data['password']) {
                        var result = {};
                        result.messageType = 'auth';
                        result.valid = true;
                        socket.write(JSON.stringify(result));
                    }
                    break;
                case 'searchGame':
                    socket.name = data['player_id'];
                    var playerI;
                    var opponentI;
                    var opponent;
                    clients.forEach(function (socket, i, clients) {
                        if (socket.name != 0 && socket.name != data['player_id']) {
                            opponentI = i;
                            opponent = socket;
                        }
                        if (socket.name == data['player_id']) {
                            playerI = i;
                        }
                    });
                    setTimeout(function () {
                        if (opponent) {
                            console.log('начало игры, распределение хода');

                            clients[playerI].opponentI = opponentI;
                            clients[opponentI].opponentI = playerI;

                            var playerTurn = {};
                            playerTurn.messageType = 'setTurn';
                            playerTurn.turn = 'true';
                            socket.write(JSON.stringify(playerTurn));

                            var opponentTurn = {};
                            opponentTurn.messageType = 'setTurn';
                            opponentTurn.turn = 'false';
                            opponent.write(JSON.stringify(opponentTurn));
                        }
                    },500);
                    break;
                case 'useCard':
                    cards.getCardRandom(function (result) {
                        result.messageType = 'getCardRandom';
                        console.log(JSON.stringify(result));
                        socket.write(JSON.stringify(result));

                        var playerTurn = {};
                        playerTurn.messageType = 'setTurn';
                        playerTurn.turn = 'false';
                        socket.write(JSON.stringify(playerTurn));

                        var opponentTurn = {};
                        opponentTurn.messageType = 'setTurn';
                        opponentTurn.turn = 'true';

                        clients[socket.opponentI].write(JSON.stringify(opponentTurn));
                    });
                    break;
                /*default:
                    socket.write('fadsfdsfdsafsdafsdfdsasdfasfadfadsdfsfdsafadsfds afadsfsdadfsa');
                    break;*/
            }
        } catch (e) {
            console.log(e);
        }
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        console.log('client left');
    });

}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");

function countPlayers() {

}