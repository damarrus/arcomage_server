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
const async = require('async');

const Game = require('./classes/game');
const auth = require('./models/auth');
const carder = require('./classes/card');
const Player = require('./classes/player');
const Match = require('./classes/match');

const isTestClient = (process.argv[2] == 'test');
console.log("test mode " + isTestClient);

/*var test = new Game();
var info = {
    player_id: 1,
    player_name: 'vasya',
    player_login: 1
};
var socketTest = {};
var player = new Player(info, socketTest);
socketTest.player = player;
var deckcards = [2,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
player.loadCollection(function () {
    player.setCardsToDeck(1, function () {
        player.changeCardFromHand(2, function () {
            console.log(player.gethandCards());
        });
    });
});*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('test', {});
});
app.listen(8000);

/*carder.changeNull(function (result) {
    console.log(result);
});*/

function sendToClient(socket, messageType, data = {}) {
    data.messageType = messageType;
    data = JSON.stringify(data);
    (isTestClient) ? socket.send(data) : socket.write(data);
    if (messageType == 'setTurn') {
        console.log(data);
    }
}
var game = new Game();
// Keep track of the chat clients
var clients = [];
//var searchGame = [];

// Обработчик сообщений
function socketServer(socket, data) {

    //console.log(data);
    data = data.toString('utf8').replace(/\0+$/, "");
    //console.log(data);
    try {
        //console.log(data);
        data = JSON.parse(data);
        console.log(data);
        switch (data['messageType']) {
            // авторизация
            case 'auth':
                game.auth(socket, data['login'], data['password']);
                break;
            case 'unAuth':
                game.unAuth(socket);
                break;
            // Поиск игры
            case 'searchGame':
                game.searchGame(data['deck_num'] = 1, socket);
                break;
            case 'gameWithBot':
                game.gameWithBot(data['deck_num'] = 1, socket);
                break;
            case 'ready':
                game.startGame(socket);
                break;
            // применение карты
            case 'useCard':
                game.useCard(socket, data['card_id'], data['discard']);
                break;
            case 'getDatabaseCards':
                game.getDatabaseCards(socket);
                break;
            case 'getCollection':
                game.getCollection(socket);
                break;
            /*case 'getCollectionCards':
                game.getCollectionCards(socket);
                break;*/
            case 'getAllDecks':
                game.getAllDecks(socket);
                break;
            case 'getDeckCards':
                game.getDeckCards(data['deck_num'], socket);
                break;
            case 'setDeckCards':
                game.setDeckCards(data['deck_num'], data['card_ids'], socket);
                break;
            case 'createDeck':
                game.createDeck(data['deck_name'], socket);
                break;
            case 'setDeckName':
                game.setDeckName(data['deck_num'], data['deck_name'], socket);
                break;
            case 'deleteDeck':
                game.deleteDeck(data['deck_num'], socket);
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
        socket.on('error', (err) => {
            console.log(err);
        });

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

