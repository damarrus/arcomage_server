/**
 * Created by nikita on 11.11.2016.
 */
const cards = require('./../models/cards');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    database : 'arcomage',
    user : 'root',
    password : '123456'
});
connection.connect(function(err) {
    if (err)
        console.error(err);
});

function Player(info = {}, socket = false) {
    // Основные параметры игрока
    var self = this,
        inSearch = false,
        inGame = false,
        ready = false,
        player_id = info.player_id || 0,
        player_name = info.player_name || 'bot_name',
        player_login = info.player_login || 'bot_login',
        matchID = 0;
    // Параметры игрока в игре
    var turn,
    tower_hp,
    wall_hp,
    res1,
    res2,
    res3,
    gen1,
    gen2,
    gen3;

    this.setReady = function (bool) {ready = bool;};
    this.getReady = function () {return ready;};
    this.setInGame = function (bool) {inGame = bool;};
    this.getInGame = function () {return inGame;};
    this.getParam = function (type) {
        switch (type) {
            case 'turn':return turn;
            case 'tower_hp':return tower_hp;
            case 'wall_hp':return wall_hp;
            case 'res1':return res1;
            case 'res2':return res2;
            case 'res3':return res3;
            case 'gen1':return gen1;
            case 'gen2':return gen2;
            case 'gen3':return gen3;
        }
    };
    this.setParam = function (type, value) {
        switch (type) {
            case 'turn':turn = value; break;
            case 'tower_hp':tower_hp = value; break;
            case 'wall_hp':wall_hp = value; break;
            case 'res1':res1 = value; break;
            case 'res2':res2 = value; break;
            case 'res3':res3 = value; break;
            case 'gen1':gen1 = value; break;
            case 'gen2':gen2 = value; break;
            case 'gen3':gen3 = value; break;
        }
    };
    this.getPlayerStatus = function () {
        return {
            turn: turn,
            tower_hp: tower_hp,
            wall_hp: wall_hp,
            res1: res1,
            res2: res2,
            res3: res3,
            gen1: gen1,
            gen2: gen2,
            gen3: gen3
        }
    };

    /**
     * @param {boolean} turn
     * @param {int} tower_hp
     * @param {int} wall_hp
     * @param {int} res1
     * @param {int} res2
     * @param {int} res3
     * @param {int} gen1
     * @param {int} gen2
     * @param {int} gen3
     */
    this.setPlayerStatus = function (turn_val, tower_hp_val, wall_hp_val,
                                     res1_val, res2_val, res3_val,
                                     gen1_val, gen2_val, gen3_val) {
        turn = turn_val;
        tower_hp = tower_hp_val;
        wall_hp = wall_hp_val;
        res1 = res1_val;
        res2 = res2_val;
        res3 = res3_val;
        gen1 = gen1_val;
        gen2 = gen2_val;
        gen3 = gen3_val;
    };
    this.changePlayerStatus = function (turn_val = turn, tower_hp_val = 0, wall_hp_val = 0,
                                        res1_val = 0, res2_val = 0, res3_val = 0,
                                        gen1_val =0 , gen2_val = 0, gen3_val = 0) {
        turn = turn_val;
        tower_hp += tower_hp_val;
        wall_hp += wall_hp_val;
        if (wall_hp < 0) {
            tower_hp += wall_hp;
            wall_hp = 0;
        }
        res1 = ((res1 + res1_val) >= 0) ? (res1 + res1_val) : 0;
        res2 = ((res2 + res2_val) >= 0) ? (res2 + res2_val) : 0;
        res3 = ((res3 + res3_val) >= 0) ? (res3 + res3_val) : 0;

        gen1 = ((gen1 + gen1_val) >= 1) ? (gen1 + gen1_val) : 1;
        gen2 = ((gen2 + gen2_val) >= 1) ? (gen2 + gen2_val) : 1;
        gen3 = ((gen3 + gen3_val) >= 1) ? (gen3 + gen3_val) : 1;
    };
    this.growthRes = function () {
        res1 += gen1;
        res2 += gen2;
        res3 += gen3;
    };
    this.costCard = function (card, callback) {
        switch (card.card_elem) {
            case 1:
                if (res1 - card.card_cost < 0) {
                    callback(false);
                } else {
                    res1 -= card.card_cost;
                    callback(true);
                }
                break;
            case 2:
                if (res2 - card.card_cost < 0) {
                    callback(false);
                } else {
                    res2 -= card.card_cost;
                    callback(true);
                }
                break;
            case 3:
                if (res3 - card.card_cost < 0) {
                    callback(false);
                } else {
                    res3 -= card.card_cost;
                    callback(true);
                }
                break;
        }
    };

    this.cardsOnHand = [];

    this.newCard = function (card_id) {
        this.cardsOnHand.push(card_id);
    };

    function deleteCard(card_id) {
        var counter = 0;
        self.cardsOnHand.forEach(function (card, i, cardsOnHand) {
            if (card == card_id && counter == 0) {
                counter = 1;
                cardsOnHand.splice(i, 1);
            }
        });
    }
}
module.exports = Player;