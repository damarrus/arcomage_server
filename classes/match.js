/**
 * Created by nikita on 11.11.2016.
 */

const db = require('./db');
const carder = require('./card');
const Messenger = require('./messenger');

function Match(socket_1, socket_2, type = "", callback) {
    var messenger = new Messenger();
    var matchID = 0;
    var readyPlayers = 0;
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

    socket_1.player.setPlayerStatus(false, 30, 15, 10, 10, 10, 2, 2, 2);
    socket_2.player.setPlayerStatus(true, 30, 15, 10, 10, 10, 2, 2, 2);

    sendStatus();

    function sendStatus() {
        messenger.send(socket_1, "playerStatus", socket_1.player.getPlayerStatus());
        messenger.send(socket_2, "opponentStatus", socket_1.player.getPlayerStatus());
        messenger.send(socket_1, "opponentStatus", socket_2.player.getPlayerStatus());
        messenger.send(socket_2, "playerStatus", socket_2.player.getPlayerStatus());
    }

    function sendNewCard(socket) {
        carder.getCardRandom(function (card) {
            messenger.send(socket, 'getCardRandom', card)
        });
    }

    this.readyPlayer = function () {

    };

    this.sendCardStart = function (socket) {
        sendNewCard(socket);
        sendNewCard(socket);
        sendNewCard(socket);
        sendNewCard(socket);
        sendNewCard(socket);
        sendNewCard(socket);
    };

    // TODO: добавить бота
    this.useCard = function(player_id, card_id, discard) {
        var self;
        var enemy;
        if (player_id == player_1_id) {
            self = socket_1;
            enemy = socket_2;
        } else {
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
                enemy.player.growthRes();

                messenger.send(enemy, 'getCardOpponent', card);
                sendStatus();
                sendNewCard(self);
            } else {
                self.player.changePlayerStatus(false);
                enemy.player.changePlayerStatus(true);
                enemy.player.growthRes();

                messenger.send(enemy, 'getCardOpponent', card);
                sendStatus();
                sendNewCard(self);
            }
        });

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
    };
    this.getMatchID = function () {
        return matchID;
    }
}

module.exports = Match;