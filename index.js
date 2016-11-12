/**
 * Created by nikita on 15.10.2016.
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const templating = require('consolidate');
const request = require('request');
const cheerio = require('cheerio');
const net = require('net');

const auth = require('./models/auth');
const cards = require('./models/cards');
const Player = require('./classes/player');
const Match = require('./classes/match');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('test', {});
});
app.listen(8000);

function sendToClient(socket, messageType, data = {}) {
    console.log(socket.player.tower_hp);
    data.messageType = messageType;
    data = JSON.stringify(data);
    socket.write(data); //send
    console.log(data)
}

// Keep track of the chat clients
var clients = [];
var searchGame = [];
var opponent = {};

const delay = 100;
// Start a TCP Server

//const WebSocketServer = require('ws').Server;
//const wss = new WebSocketServer({ port: 5000 });

net.createServer(function (socket) {
    //socket.setNoDelay(true);

//wss.on('connection', function connection(socket) {

    // Identify this client
    socket.name = 0;//socket.remoteAddress + ":" + socket.remotePort;
    clients.push(socket);
    console.log('client join');

    // Handle incoming messages from clients.
    socket.on('data', function (data) { // function incoming //message/data
        //console.log(data);
        data = data.toString('utf8').replace(/\0+$/, "");
        console.log(data);
        try {
            data = JSON.parse(data);
            console.log(data);
            switch (data['messageType']) {
                // авторизация
                case 'auth':
                    auth(data['login'],data['password'], function (result) {
                        if (result) {
                            // создание объекта Игрок
                            var player = new Player(result, socket);
                            socket.player_id = result.player_id;
                            socket.player = player;

                            sendToClient(socket, "auth", {
                                valid: true
                            });
                        } else {
                            sendToClient(socket, "auth", {
                                valid: false
                            });
                        }
                    });
                    break;
                // Поиск игры
                case 'searchGame':
                    // TODO: сделать включение/отключение поиска исходя из действий клиента (отмена поиска)
                    if (!searchGame[0]) {
                        searchGame.push(socket);
                        socket.player.inSearch = true;
                    } else {
                        opponent = searchGame[0];
                        searchGame.splice(searchGame.indexOf(opponent), 1);

                        opponent.opponent = socket;
                        socket.opponent = opponent;
                        opponent.player.inSearch = false;

                        console.log('начало игры, распределение хода');

                        socket.player.newGame(true);
                        opponent.player.newGame(false);

                        sendToClient(socket, "setTurn", {
                            turn: socket.player.turn,
                            self_tower_hp: socket.player.tower_hp,
                            enemy_tower_hp: opponent.player.tower_hp
                        });
                        sendToClient(opponent, "setTurn", {
                            turn: opponent.player.turn,
                            self_tower_hp: opponent.player.tower_hp,
                            enemy_tower_hp: socket.player.tower_hp
                        });
                    }
                    break;
                // отправка случайной карты
                case 'getCardRandom':
                    cards.getCardRandom(function (card) {
                        sendToClient(socket, 'getCardRandom', card)
                    });
                    break;
                case 'getCardStart':
                    cards.getCardRandom(function (card) {
                        sendToClient(socket, 'getCardStart', card);
                    });
                    cards.getCardRandom(function (card) {
                        sendToClient(socket, 'getCardStart', card);
                    });
                    cards.getCardRandom(function (card) {
                        sendToClient(socket, 'getCardStart', card);
                    });
                    cards.getCardRandom(function (card) {
                        sendToClient(socket, 'getCardStart', card);
                    });
                    cards.getCardRandom(function (card) {
                        sendToClient(socket, 'getCardStart', card);
                    });
                    cards.getCardRandom(function (card) {
                        sendToClient(socket, 'getCardStart', card);
                    });
                    break;
                // применение карты
                case 'useCard':
                    opponent = socket.opponent;

                    socket.player.useCard(data['card_id'], true, function () {
                        opponent.player.useCard(data['card_id'], false, function () {
                            // конец ход игрока
                            sendToClient(socket, 'setTurn', {
                                turn: socket.player.turn,
                                self_tower_hp: socket.player.tower_hp,
                                enemy_tower_hp: opponent.player.tower_hp
                            });
                            cards.getCardRandom(function (card) {
                                sendToClient(socket, 'getCardRandom', card)
                            });
                            // боту не отправляем инфу, он и так всё знает
                            if (!socket.withBot) {
                                sendToClient(opponent, "setTurn", {
                                    turn: opponent.player.turn,
                                    self_tower_hp: opponent.player.tower_hp,
                                    enemy_tower_hp: socket.player.tower_hp
                                });
                                cards.getCardByID(data['card_id'], function (card) {
                                    sendToClient(opponent, "getCardOpponent", card);
                                });
                            } else {
                                setTimeout(function () {
                                    cards.getCardRandom(function (card) {
                                        socket.player.useCard(card.card_id, false, function () {
                                            opponent.player.useCard(card.card_id, true, function () {
                                                // начало хода игрока
                                                sendToClient(socket, 'setTurn', {
                                                    turn: socket.player.turn,
                                                    self_tower_hp: socket.player.tower_hp,
                                                    enemy_tower_hp: opponent.player.tower_hp
                                                });
                                                cards.getCardByID(card.card_id, function (card) {
                                                    sendToClient(socket, "getCardOpponent", card);
                                                });
                                            });
                                        });

                                    });
                                }, 1500)
                            }
                        });
                    });
                    break;
                case 'gameWithBot':
                    opponent = {
                        player: new Player()
                    };
                    socket.player.newGame(true);
                    opponent.player.newGame(false);
                    socket.opponent = opponent;
                    socket.withBot = true;

                    sendToClient(socket, "setTurn", {
                        turn: socket.player.turn,
                        self_tower_hp: socket.player.tower_hp,
                        enemy_tower_hp: opponent.player.tower_hp
                    });
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    });

    // Клиент отключился
    socket.on('close', function () { //close
        clients.splice(clients.indexOf(socket), 1);
        console.log('client left');
    });

}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");