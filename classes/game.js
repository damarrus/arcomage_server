/**
 * Created by nikita on 16.11.2016.
 */

const Match = require('./match');
const Player = require('./player');
const Messenger = require('./messenger');
const db = require('./db');

function Game() {

    var messenger = new Messenger();
    var matches = [];
    var inSearch = [];

    this.auth = function (socket, player_login, player_password) {
        if (!socket.player) {
            var query = 'SELECT count(*) as count_player FROM player WHERE player_login='+player_login+' AND player_password='+player_password;
            db.query(query, function(err, result) {
                if (result[0].count_player != 0){
                    query = 'SELECT * FROM player WHERE player_login='+player_login+' AND player_password='+player_password;
                    db.query(query, function(err, result) {
                        socket.player = new Player(result[0], socket);
                        messenger.send(socket, "auth", {
                            valid: true
                        });
                    });
                } else {
                    messenger.send(socket, "auth", {
                        valid: false
                    });
                }
            });
        } else {
            messenger.send(socket, "error", {
                method: "auth",
                typeError: "alreadyAuth"
            });
        }
    };

    this.searchGame = function (socket) {
        if (!socket.player.getInGame()) {
            if (socket.player.getInSearch() != true) {
                if (!inSearch[0]) {
                    inSearch.push(socket);
                    socket.player.setInSearch(true);
                } else {
                    console.log('игра найдена');
                    var opponent = inSearch[0];
                    inSearch.splice(inSearch.indexOf(opponent), 1);

                    opponent.opponent = socket;
                    socket.opponent = opponent;
                    opponent.player.inSearch = false;

                    var match = new Match(socket, opponent, "searchGame", function () {
                        matches[match.getMatchID()] = match;
                    });
                }
            } else {
                inSearch.splice(inSearch.indexOf(socket), 1);
                socket.player.setInSearch(false);
            }
        } else {
            messenger.send(socket, "error", {
                method: "searchGame",
                typeError: "alreadyInGame"
            });
        }
    };

    this.gameWithBot = function (socket) {
        if (!socket.player.getInGame()) {
            var socket_bot = {
                player: new Player()
            };
            var match = new Match(socket, socket_bot, "gameWithBot", function () {
                matches[match.getMatchID()] = match;
            });
        } else {
            messenger.send(socket, "error", {
                method: "gameWithBot",
                typeError: "alreadyInGame"
            });
        }
    };

    this.startGame = function (socket) {
        if (socket.player.getInGame()) {
            setTimeout(function () {
                var match = matches[socket.matchID];
                match.readyPlayer(socket.player.getParam('player'));
                if (match.getReadyPlayer()) {
                    match.sendStartStatus(function () {
                        match.sendCardStart();
                    });
                }
            }, 500)
        } else {
            messenger.send(socket, "error", {
                method: "startGame",
                typeError: "notInGame"
            });
        }
    };

    this.useCard = function (socket, card_id, discard) {
        if (socket.player.getParam('turn')) {
            if (socket.player.getInGame()) {
                var match = matches[socket.matchID];
                match.useCard(socket.player.getParam('player_id'), card_id, discard);
                /*if (result) {
                 match.endMatch(result, function () {
                 delete matches[socket.matchID];
                 })
                 }*/
            } else {
                messenger.send(socket, "error", {
                    method: "useCard",
                    typeError: "notInGame"
                });
            }
        } else {
            messenger.send(socket, "error", {
                method: "useCard",
                typeError: "notYourTurn"
            });
        }
    };
}

module.exports = Game;