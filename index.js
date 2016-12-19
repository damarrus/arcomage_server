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
const db = require('./classes/db');
const Deck = require('./classes/deck');

const isTestClient = (process.argv[2] == 'test');
console.log("test mode " + isTestClient);

/*var query = "SELECT deck_num FROM deck WHERE player_id='"+1+"'";
db.query(query, function(err, result) {
    console.log(result[0].deck_num);
});*/

/*
var deck = new Deck(false, {deck_id:8,player_id:1,deck_name:'asdf',deck_num:3}, function (err) {
    deck.deleteDeck(function () {
        console.log('ura');
    });
});
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('test', {});
});
app.get('/cardcreator', function(req, res){
    res.render('cardcreator', {});
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
            case 'auth':
                game.auth(socket, data['login'], data['password']);
                break;
            case 'unAuth':
                game.unAuth(socket);
                break;
            case 'searchGame':
                game.searchGame(data['deck_num'] = 1, socket);
                break;
            case 'gameWithBot':
                game.gameWithBot(data['deck_num'] = 1, socket);
                break;
            case 'ready':
                game.startGame(socket);
                break;
            case 'changeStartCards':
                game.changeStartCards(socket, data['card_ids']);
                break;
            case 'useCard':
                game.useCard(socket, data['card_id'], data['discard']);
                break;
            case 'endTurn':
                game.endTurn(socket);
                break;
            case 'checkHash':
                game.checkHash(data['hash'], socket);
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
                game.createDeck(data['deck_num'], data['deck_name'], data['card_ids'], socket);
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
            if (socket.player) {
                socket.player.clearTimer();
                if (socket.player.getInGame()) {
                    game.endMatch(socket);
                }
            }
            clients.splice(clients.indexOf(socket), 1);
            console.log('client left');
        });
    }).listen(5000);
}

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");

