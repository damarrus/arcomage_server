/**
 * Created by nikita on 11.11.2016.
 */

const db = require('./db');
const carder = require('./card');
const Messenger = require('./messenger');

function Match(socket_1, socket_2, type = "", callback) {
    var messenger = new Messenger();
    var matchID = 0;
    var player_1_id = socket_1.player.player_id;
    var player_2_id = socket_2.player.player_id;
    var query = 'INSERT INTO matches (match_player1_id, match_player2_id, match_result) VALUES ('+
        player_1_id +','+
        player_2_id +',0)';
    db.query(query, function(err, result) {
        matchID = result.insertId;
        socket_1.matchID = matchID;
        socket_2.matchID = matchID;
        callback();
    });

    socket_1.player.setInGame(true);
    socket_2.player.setInGame(true);

    socket_1.player.setPlayerStatus(true, 30, 15, 10, 10, 10, 2, 2, 2);
    socket_2.player.setPlayerStatus(false, 30, 15, 10, 10, 10, 2, 2, 2);

    messenger.send(socket_1, "gameStart", {});
    if (type != "gameWithBot") {
        messenger.send(socket_2, "gameStart", {});
    }

    this.sendStartStatus = function (callback) {
        messenger.send(socket_1, "startStatus", {turn: true});
        if (type != "gameWithBot") {
            messenger.send(socket_2, "startStatus", {turn: false});
        }
        sendStatus();
        callback();
    };

    function sendStatus() {
        messenger.send(socket_1, "playerStatus", socket_1.player.getPlayerStatus());
        messenger.send(socket_1, "opponentStatus", socket_2.player.getPlayerStatus());
        if (type != "gameWithBot") {
            messenger.send(socket_2, "playerStatus", socket_2.player.getPlayerStatus());
            messenger.send(socket_2, "opponentStatus", socket_1.player.getPlayerStatus());
        }
    }

    function sendNewCard(socket) {
        carder.getCardRandom(function (card) {
            messenger.send(socket, 'getCardRandom', card)
        });
    }

    this.readyPlayer = function (player_id) {
        if (player_id == player_1_id) {
            socket_1.player.setReady(true);
        } else if (player_id == player_2_id) {
            socket_2.player.setReady(true);
        }
    };

    this.getReadyPlayer = function () {
        return (socket_1.player.getReady() && socket_2.player.getReady());
    };

    this.sendCardStart = function () {
        sendNewCard(socket_1);
        sendNewCard(socket_1);
        sendNewCard(socket_1);
        sendNewCard(socket_1);
        sendNewCard(socket_1);
        sendNewCard(socket_1);
        if (type != "gameWithBot") {
            sendNewCard(socket_2);
            sendNewCard(socket_2);
            sendNewCard(socket_2);
            sendNewCard(socket_2);
            sendNewCard(socket_2);
            sendNewCard(socket_2);
        }

    };
    
    function isWin(callback) {
        if (socket_1.player.getParam('tower_hp') <= 0) {
            callback(1);
        } else if (socket_2.player.getParam('tower_hp') <= 0) {
            callback(2);
        } else {
            callback(false);
        }
    }

    this.useCard = function(player_id, card_id, discard) {
        var self;
        var enemy;
        if (player_id == player_1_id) {
            self = socket_1;
            enemy = socket_2;
        } else if (player_id == player_2_id) {
            self = socket_2;
            enemy = socket_1;
        }
        carder.getCardByID(card_id, function (card) {
            if (!discard) {
                self.player.costCard(card);
                self.player.changePlayerStatus(false, card.card_self_tower_hp, card.card_self_wall_hp,
                    card.card_self_res1, card.card_self_res2, card.card_self_res3,
                    card.card_self_gen1, card.card_self_gen2, card.card_self_gen3);
                enemy.player.changePlayerStatus(true, card.card_enemy_tower_hp, card.card_enemy_wall_hp,
                    card.card_enemy_res1, card.card_enemy_res2, card.card_enemy_res3,
                    card.card_enemy_gen1, card.card_enemy_gen2, card.card_enemy_gen3);
            } else {
                self.player.changePlayerStatus(false);
                enemy.player.changePlayerStatus(true);
            }
            enemy.player.growthRes();
            if (type != "gameWithBot") {
                messenger.send(enemy, 'getCardOpponent', card);
            }
            sendStatus();
            isWin(function (result) {
                if (!result) {
                    sendNewCard(self);
                    if (type == "gameWithBot") {
                        useCardBot();
                    }
                }
                //return result;
            });
        });
    };
    
    function useCardBot() {
        setTimeout(function () {
            carder.getCardRandom(function (card) {
                socket_2.player.costCard(card, function (result) {
                    if (result) {
                        socket_2.player.changePlayerStatus(false, card.card_self_tower_hp, card.card_self_wall_hp,
                            card.card_self_res1, card.card_self_res2, card.card_self_res3,
                            card.card_self_gen1, card.card_self_gen2, card.card_self_gen3);
                        socket_1.player.changePlayerStatus(true, card.card_enemy_tower_hp, card.card_enemy_wall_hp,
                            card.card_enemy_res1, card.card_enemy_res2, card.card_enemy_res3,
                            card.card_enemy_gen1, card.card_enemy_gen2, card.card_enemy_gen3);
                        socket_1.player.growthRes();

                        messenger.send(socket_1, 'getCardOpponent', card);
                        sendStatus();
                        isWin(function (result) {
                            //return result;
                        });
                    } else {
                        socket_2.player.changePlayerStatus(false);
                        socket_1.player.changePlayerStatus(true);
                        sendStatus();
                    }
                });
            });
        }, 2000);
    }
    
    this.getMatchID = function () {
        return matchID;
    };

    this.endMatch = function (result, callback) {
        var query = 'UPDATE matches SET match_result ='+result+' WHERE match_id='+matchID;
        db.query(query, function(err, result) {
            callback();
        });
    }
}

module.exports = Match;