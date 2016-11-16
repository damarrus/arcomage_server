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

const Game = require('./classes/game');
const auth = require('./models/auth');
const cards = require('./models/cards');
const Player = require('./classes/player');
const Match = require('./classes/match');

const isTestClient = (process.argv[2] == 'test');
console.log("test mode " + isTestClient);

var game = new Game();

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
    data.messageType = messageType;
    data = JSON.stringify(data);
    (isTestClient) ? socket.send(data) : socket.write(data);
    if (messageType == 'setTurn') {
        console.log(data);
    }
}

// Keep track of the chat clients
var clients = [];
var searchGame = [];
var opponent = {};

// Обработчик сообщений
function socketServer(socket, data) {

        //console.log(data);
        data = data.toString('utf8').replace(/\0+$/, "");
        //console.log(data);
        try {
            data = JSON.parse(data);
            console.log(data);
            switch (data['messageType']) {
                // авторизация
                case 'auth':
                    game.auth(socket, data['login'], data['password']);
                    break;
                // Поиск игры
                case 'searchGame':
                    // TODO: сделать включение/отключение поиска исходя из действий клиента (отмена поиска)
                    game.searchGame(socket);
                    break;
                case 'ready':
                    game.startGame(socket);
                    break;
                // применение карты
                case 'useCard':
                    game.useCard(socket, data['card_id'], data['discard']);

                    /*opponent = socket.opponent;

                    var discard = data['discard'];

                    socket.player.useCard(data['card_id'], true, discard, function () {
                        opponent.player.useCard(data['card_id'], false, discard, function () {
                            // конец ход игрока
                            sendToClient(socket, 'setTurn', {
                                turn: socket.player.turn,
                                self_tower_hp: socket.player.tower_hp,
                                enemy_tower_hp: opponent.player.tower_hp,
                                self_wall_hp: socket.player.wall_hp,
                                enemy_wall_hp: opponent.player.wall_hp,
                                self_res1: socket.player.res1,
                                self_res2: socket.player.res2,
                                self_res3: socket.player.res3,
                                self_gen1: socket.player.gen1,
                                self_gen2: socket.player.gen2,
                                self_gen3: socket.player.gen3,
                                enemy_res1: opponent.player.res1,
                                enemy_res2: opponent.player.res2,
                                enemy_res3: opponent.player.res3,
                                enemy_gen1: opponent.player.gen1,
                                enemy_gen2: opponent.player.gen2,
                                enemy_gen3: opponent.player.gen3
                            });
                            cards.getCardRandom(function (card) {
                                socket.player.newCard(card.card_id);
                                sendToClient(socket, 'getCardRandom', card)
                            });
                            // боту не отправляем инфу, он и так всё знает
                            if (!socket.withBot) {
                                sendToClient(opponent, "setTurn", {
                                    turn: opponent.player.turn,
                                    self_tower_hp: opponent.player.tower_hp,
                                    enemy_tower_hp: socket.player.tower_hp,
                                    self_wall_hp: opponent.player.wall_hp,
                                    enemy_wall_hp: socket.player.wall_hp,
                                    self_res1: opponent.player.res1,
                                    self_res2: opponent.player.res2,
                                    self_res3: opponent.player.res3,
                                    self_gen1: opponent.player.gen1,
                                    self_gen2: opponent.player.gen2,
                                    self_gen3: opponent.player.gen3,
                                    enemy_res1: socket.player.res1,
                                    enemy_res2: socket.player.res2,
                                    enemy_res3: socket.player.res3,
                                    enemy_gen1: socket.player.gen1,
                                    enemy_gen2: socket.player.gen2,
                                    enemy_gen3: socket.player.gen3
                                });
                                cards.getCardByID(data['card_id'], function (card) {
                                    sendToClient(opponent, "getCardOpponent", card);
                                });
                            } else {
                                setTimeout(function () {
                                    cards.getCardRandom(function (card) {
                                        socket.player.useCard(card.card_id, false, false, function () {
                                            opponent.player.useCard(card.card_id, true, false, function () {
                                                // начало хода игрока
                                                sendToClient(socket, 'setTurn', {
                                                    turn: socket.player.turn,
                                                    self_tower_hp: socket.player.tower_hp,
                                                    enemy_tower_hp: opponent.player.tower_hp,
                                                    self_wall_hp: socket.player.wall_hp,
                                                    enemy_wall_hp: opponent.player.wall_hp,
                                                    self_res1: socket.player.res1,
                                                    self_res2: socket.player.res2,
                                                    self_res3: socket.player.res3,
                                                    self_gen1: socket.player.gen1,
                                                    self_gen2: socket.player.gen2,
                                                    self_gen3: socket.player.gen3,
                                                    enemy_res1: opponent.player.res1,
                                                    enemy_res2: opponent.player.res2,
                                                    enemy_res3: opponent.player.res3,
                                                    enemy_gen1: opponent.player.gen1,
                                                    enemy_gen2: opponent.player.gen2,
                                                    enemy_gen3: opponent.player.gen3
                                                });
                                                cards.getCardByID(card.card_id, function (card) {
                                                    sendToClient(socket, "getCardOpponent", card);
                                                });
                                            });
                                        });
                                    });
                                }, 3000)
                            }
                        });
                    });*/
                    break;
                case 'gameWithBot':
                    game.gameWithBot(socket);
                    /*opponent = {
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
                    });*/
                    break;
            }
        } catch (e) {
            console.log(e);
        }




}

if (isTestClient) {
    const WebSocketServer = require('ws').Server;
    const wss = new WebSocketServer({ port: 5000 });

    wss.on('connection', function connection(socket) {
        //socket.setNoDelay(true);
        // Identify this client
        socket.name = 0;//socket.remoteAddress + ":" + socket.remotePort;
        clients.push(socket);
        console.log('client join');
        // Handle incoming messages from clients.
        socket.on('message', function incoming(data) { // function incoming //message/data
            socketServer(socket, data);
        });
        // Клиент отключился
        socket.on('close', function close() { //close
            clients.splice(clients.indexOf(socket), 1);
            console.log('client left');
        });
    });
} else {
    net.createServer(function (socket) {

        //socket.setNoDelay(true);
        // Identify this client
        socket.name = 0;//socket.remoteAddress + ":" + socket.remotePort;
        clients.push(socket);
        console.log('client join');

        // Handle incoming messages from clients.
        socket.on('data', function (data) { // function incoming //message/data
            socketServer(socket, data);
        });
        // Клиент отключился
        socket.on('close', function () { //close
            clients.splice(clients.indexOf(socket), 1);
            console.log('client left');
        });
    }).listen(5000);
}

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");

