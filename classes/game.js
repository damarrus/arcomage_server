/**
 * Created by nikita on 16.11.2016.
 */

const Match = require('./match');
const Player = require('./player');
const Messenger = require('./messenger');
const db = require('./db');
const carder = require('./card');
const Gameconf = require('./gameconf');

function Game() {

    var messenger = new Messenger();
    var gameconf;
    new Gameconf(function (result) {gameconf = result;});
    var matches = [];
    var players = [];
    var inSearch = [];

    function addGold(player, callback) {
        var gold = gameconf.gold_take + player.player_gold;
        var query = "UPDATE player SET player_gold = '"+gold+"' WHERE player_id = '"+player.player_id+"'";
        db.query(query, function(err, result) {
            callback();
        });
    }

    function getPlayerByID(player_id, callback) {
        players.forEach(function (item, i, arr) {
            if (item.player_id == player_id) {
                callback(item);
            }
        });
    }

    this.auth = function (socket, player_login, player_password) {
        if (!socket.player) {
            if (player_login != '' && player_password != '') {
                var query = "SELECT count(*) as count_player FROM player WHERE player_login='"+player_login+"' AND player_password='"+player_password+"'";
                db.query(query, function(err, result) {
                    if (result[0].count_player != 0){
                        query = 'SELECT * FROM player WHERE player_login='+player_login+' AND player_password='+player_password;
                        db.query(query, function(err, result) {
                            socket.player = new Player(result[0], socket, function () {
                                players.push(socket.player);
                                messenger.send(socket, "auth", {
                                    valid: true,
                                    player_name: result[0].player_name
                                });
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

    this.unAuth = function (socket) {
        if (socket.player) {
            socket.player = null;
            players.splice(players.indexOf(socket.player), 1);
            messenger.send(socket, "unAuth", {
                valid: true
            });
        } else {
            messenger.send(socket, "unAuth", {
                valid: false
            });
        }
    };

    this.searchGame = function (deck_num, socket) {
        if (!socket.player.getInGame()) {
            if (!socket.player.getInSearch()) {
                if (!inSearch[0]) {
                    inSearch.push(socket);
                    socket.player.setInSearch(true);
                    socket.player.setDeckNum(deck_num, function (result) {});
                } else {
                    // проверка на полную деку
                    socket.player.setDeckNum(deck_num, function (result) {
                        if (result) {
                            console.log('игра найдена');
                            var opponent = inSearch[0];
                            inSearch.splice(inSearch.indexOf(opponent), 1);

                            opponent.opponent = socket;
                            socket.opponent = opponent;
                            opponent.player.inSearch = false;

                            new Match(socket, opponent, gameconf, "searchGame", function (match) {
                                matches[match.getMatchID()] = match;
                            });
                        } else {
                            messenger.send(socket, "error", {
                                method: "searchGame",
                                typeError: "deckIsNotFull"
                            });
                        }
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

    this.gameWithBot = function (deck_num, socket) {
        if (!socket.player.getInGame()) {
            // проверка на полную деку
            socket.player.setDeckNum(deck_num, function (result) {
                if (result) {
                    var bot_socket = {};
                    bot_socket.player = new Player({}, false, function () {
                        bot_socket.player.setDeckNum(1, function () {
                            new Match(socket, bot_socket, gameconf, "gameWithBot", function (match, id) {
                                matches[id] = match;
                            });
                        });
                    });
                } else {
                    messenger.send(socket, "error", {
                        method: "searchGame",
                        typeError: "deckIsNotFull"
                    });
                }
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
                if (matches[socket.matchID].getReadyPlayer()) {
                    matches[socket.matchID].sendStartCards();
                }
            }, 500)
        } else {
            messenger.send(socket, "error", {
                method: "startGame",
                typeError: "notInGame"
            });
        }
    };

    this.changeStartCards = function (socket, card_ids) {
        if (socket.player.getInGame()) {
            if (matches[socket.matchID].getReadyPlayer()) {
                socket.player.changeStartCards(card_ids, function () {
                    socket.player.setChangeReady(true);
                    if (matches[socket.matchID].getChangeReadyPlayer()) {
                        matches[socket.matchID].sendStartStatus();
                    }
                });
            } else {
                messenger.send(socket, "error", {
                    method: "changeStartCards",
                    typeError: "notReady"
                });
            }
        } else {
            messenger.send(socket, "error", {
                method: "changeStartCards",
                typeError: "notInGame"
            });
        }
    };

    this.useCard = function (socket, card_id, discard) {
        if (socket.player.getInGame()) {
            if (socket.player.getParam('turn')) {
                matches[socket.matchID].useCard(socket.player.getParam('player_id'), card_id, discard, function (result) {
                    if (!isNaN(parseFloat(result)) && isFinite(result)) {
                        if (result != -1) {
                            console.log('победил игрок ' + result);
                            getPlayerByID(result, function (player) {
                                addGold(player, function () {
                                    matches[socket.matchID].endMatch(result, function () {
                                        matches.splice(socket.matchID, 1);
                                    });
                                });
                            });
                        } else {
                            messenger.send(socket, "error", {
                                method: "useCard",
                                typeError: "DRAW!!!!!"
                            });
                        }
                    } else if (result == 'error') {
                        messenger.send(socket, "error", {
                            method: "useCard",
                            typeError: "notEnoughRes"
                        });
                    }
                });
            } else {
                messenger.send(socket, "error", {
                    method: "useCard",
                    typeError: "notYourTurn"
                });
            }
        } else {
            messenger.send(socket, "error", {
                method: "useCard",
                typeError: "notInGame"
            });
        }
    };

    this.endTurn = function (socket) {
        if (socket.player.getInGame()) {
            if (socket.player.getParam('turn')) {
                matches[socket.matchID].endTurn(socket.player.getParam('player_id'), function (result) {
                    if (result == 1 || result == 2 || result == 3) {
                        console.log('победил игрок ' + result);
                        matches[socket.matchID].endMatch(result, function () {
                            matches.splice(socket.matchID, 1);
                        });
                    }
                });
            } else {
                messenger.send(socket, "error", {
                    method: "useCard",
                    typeError: "notYourTurn"
                });
            }
        } else {
            messenger.send(socket, "error", {
                method: "useCard",
                typeError: "notInGame"
            });
        }
    };

    this.endMatch = function (socket) {
        matches[socket.matchID].endMatch(4, function () {
            matches.splice(socket.matchID, 1);
        });
    };

    this.checkHash = function (hash, socket) {
        var query = "SELECT gameconf_hash FROM gameconf WHERE gameconf_id = 1";
        db.query(query, function(err, result) {
            if (result[0].gameconf_hash != hash) {
                messenger.send(socket, "checkHash", {valid:false, hash:result[0].gameconf_hash});
                getDatabaseCards(socket);
            } else {
                messenger.send(socket, "checkHash", {valid:true});
            }
        });
    };

    function getDatabaseCards(socket) {
        carder.getAllCards(function (result) {
            messenger.send(socket, "getDatabaseCardsCount", {value:result.length});
            messenger.multipleSend(socket, "getDatabaseCards", result);
        });
    }
    this.getCollection = function (socket) {
        if (socket.player) {
            socket.player.collection.getCardsID(function (cards) {
                messenger.send(socket, "getCollectionCardsCount", {value:cards.length});
                messenger.arraySend(socket, "getCollectionCards", cards);
                socket.player.collection.getDecks(function (decks) {
                    messenger.send(socket, "getDecksCount", {value:decks.length});
                    var count = 0;
                    decks.forEach(function (deck, i, arr) {
                        ++count;
                        deck.getDeckInfo(function (deck_info) {
                            deck.getDeckCardsID(function (card_ids) {
                                messenger.arraySend(socket, "getDeck", card_ids, deck_info);
                            });
                        });
                        if (count == decks.length) {

                        }
                    });
                });
            });
        } else {
            messenger.send(socket, "error", {
                method: "getCollection",
                typeError: "notAuth"
            });
        }
    };
    this.getAllDecks = function (socket) {
        if (socket.player) {
            socket.player.collection.getAllDecks(function (decks) {
                messenger.multipleSend(socket, "getAllDecks", decks);
            });
        } else {
            messenger.send(socket, "error", {
                method: "getAllDecks",
                typeError: "notAuth"
            });
        }
    };
    this.getDeckCards = function (deck_num, socket) {
        if (socket.player) {
            socket.player.collection.getDeckByNum(deck_num, function (deck) {
                deck.getDeckCardsID(function (cards) {
                    carder.getCardByMultipleID(cards, function (result) {
                        messenger.send(socket, "getDeckCardsCount", {value:result.length});
                        messenger.multipleSend(socket, "getDeckCards", result);
                    });
                });
            });
        } else {
            messenger.send(socket, "error", {
                method: "getDeckCards",
                typeError: "notAuth"
            });
        }
    };
    this.setDeckCards = function (deck_num, card_ids, socket) {
        if (socket.player) {
            socket.player.collection.getDeckByNum(deck_num, function (deck) {
                card_ids = card_ids.split(',');
                deck.setDeckCards(card_ids, function () {
                    messenger.send(socket, "setDeckCards", {valid:true});
                });
            });
        } else {
            messenger.send(socket, "error", {
                method: "setDeckCards",
                typeError: "notAuth"
            });
        }
    };
    this.createDeck = function (deck_num, deck_name, card_ids, socket) {
        if (socket.player) {
            socket.player.collection.createDeck(deck_name, deck_num, card_ids, function (result) {
                if (result == true) {
                    messenger.send(socket, "createDeck", {valid:true});
                } else {
                    messenger.send(socket, "error", {
                        method: "createDeck",
                        typeError: result
                    });
                }
            });
        } else {
            messenger.send(socket, "error", {
                method: "createDeck",
                typeError: "notAuth"
            });
        }
    };
    this.deleteDeck = function (deck_num, socket) {
        if (socket.player) {
            socket.player.collection.deleteDeck(deck_num, function (result) {
                if (result == true) {
                    messenger.send(socket, "deleteDeck", {valid:true});
                } else {
                    messenger.send(socket, "error", {
                        method: "deleteDeck",
                        typeError: result
                    });
                }
            });
        } else {
            messenger.send(socket, "error", {
                method: "deleteDeck",
                typeError: "notAuth"
            });
        }
    };
    this.deleteAllDecks = function (socket) {
        if (socket.player) {
            socket.player.collection.getDecks(function (decks) {
                var count = 0;
                decks.forEach(function (item, i, arr) {
                    ++count;
                    item.deleteDeck(function () {});
                    if (count == decks.length) {
                        messenger.send(socket, "deleteAllDecks", {valid:true});
                    }
                });
            });
        } else {
            messenger.send(socket, "error", {
                method: "deleteAllDecks",
                typeError: "notAuth"
            });
        }
    };
    this.setDeckName = function (deck_num, deck_name, socket) {
        if (socket.player) {
            socket.player.collection.getDeckByNum(deck_num, function (deck) {
                deck.setDeckName(deck_name, function (result) {
                    if (result == true) {
                        messenger.send(socket, "setDeckName", {valid:true});
                    } else {
                        messenger.send(socket, "error", {
                            method: "setDeckName",
                            typeError: result
                        });
                    }
                });
            });
        } else {
            messenger.send(socket, "error", {
                method: "setDeck",
                typeError: "notAuth"
            });
        }
    };
    this.buyPack = function (pack_count, socket) {
        if (socket.player) {
            socket.player.buyPack(pack_count, function (result) {
                if (result == true) {

                } else {
                    messenger.send(socket, "error", {
                        method: "buyPack",
                        typeError: result
                    });
                }
            });
        } else {
            messenger.send(socket, "error", {
                method: "setDeck",
                typeError: "notAuth"
            });
        }
    };
}

module.exports = Game;