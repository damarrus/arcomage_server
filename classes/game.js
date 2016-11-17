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
    var players = [];
    var inSearch = [];

    this.auth = function (socket, player_login, player_password) {
        if (!socket.player) {
            if (player_login != '' && player_password != '') {
                var query = 'SELECT count(*) as count_player FROM player WHERE player_login='+player_login+' AND player_password='+player_password;
                db.query(query, function(err, result) {
                    if (result[0].count_player != 0){
                        query = 'SELECT * FROM player WHERE player_login='+player_login+' AND player_password='+player_password;
                        db.query(query, function(err, result) {
                            socket.player = new Player(result[0], socket);
                            players.push(socket.player);
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
                messenger.send(socket, "auth", {
                    valid: false
                });
            }
        } else {
            messenger.send(socket, "error", {
                method: "auth",
                typeError: "alreadyAuth"
            });
        }
    };

    this.searchGame = function (socket) {
        if (!socket.player.getInGame()) {
            if (!socket.player.getInSearch()) {
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

                    new Match(socket, opponent, "searchGame", function (match) {
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
            new Match(socket, {player: new Player()}, "gameWithBot", function (match, id) {
                matches[id] = match;
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
                matches[socket.matchID].readyPlayer(socket.player.getParam('player_id'));
                console.log('ingame!!!');
                console.log(socket.player.getParam('player_id'));
                if (matches[socket.matchID].getReadyPlayer()) {
                    matches[socket.matchID].sendStartStatus(function () {
                        matches[socket.matchID].sendCardStart();
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
        if (socket.player.getInGame()) {
            if (socket.player.getParam('turn')) {
                matches[socket.matchID].useCard(socket.player.getParam('player_id'), card_id, discard, function (result) {
                    if (result == 1 || result == 2) {
                        console.log('победил игрок ' + result);
                        matches[socket.matchID].endMatch(result, function () {
                            matches.splice(socket.matchID, 1);
                        });
                    }
                });
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