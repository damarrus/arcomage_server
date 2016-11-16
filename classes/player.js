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
    var self = this;
    if (socket) {
        this.player_id = info.player_id;
        this.player_name = info.player_name;
        this.player_login = info.player_login;
        this.matchID = 0;
        this.socket = socket;
        this.inSearch = false;
        console.log(this.player_id);
    }

    this.getPlayerStatus = function () {
        return {
            turn: self.turn,
            tower_hp: self.tower_hp,
            wall_hp: self.wall_hp,
            res1: self.res1,
            res2: self.res2,
            res3: self.res3,
            gen1: self.gen1,
            gen2: self.gen2,
            gen3: self.gen3
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
    this.setPlayerStatus = function (turn, tower_hp, wall_hp, res1, res2, res3, gen1, gen2, gen3) {
        self.turn = turn;
        self.tower_hp = tower_hp;
        self.wall_hp = wall_hp;
        self.res1 = res1;
        self.res2 = res2;
        self.res3 = res3;
        self.gen1 = gen1;
        self.gen2 = gen2;
        self.gen3 = gen3;
    };
    this.changePlayerStatus = function (turn=self.turn,tower_hp=0,wall_hp=0,res1=0,res2=0,res3=0,gen1=0,gen2=0,gen3=0) {
        self.turn = turn;
        self.tower_hp += tower_hp;
        self.wall_hp += wall_hp;
        if (self.wall_hp < 0) {
            self.tower_hp += self.wall_hp;
            self.wall_hp = 0;
        }
        self.res1 = (self.res1 += res1 >= 0) ? self.res1 += res1 : 0;
        self.res2 = (self.res2 += res2 >= 0) ? self.res2 += res2 : 0;
        self.res3 = (self.res3 += res3 >= 0) ? self.res3 += res3 : 0;
        self.gen1 = (self.gen1 += gen1 >= 0) ? self.gen1 += gen1 : 0;
        self.gen2 = (self.gen2 += gen2 >= 0) ? self.gen2 += gen2 : 0;
        self.gen3 = (self.gen3 += gen3 >= 0) ? self.gen3 += gen3 : 0;
    };
    this.growthRes = function () {
        self.res1 += self.gen1;
        self.res2 += self.gen2;
        self.res3 += self.gen3;
    };
    this.costCard = function (card) {
        switch (card.card_elem) {
            case 1:
                self.res1 -= card.card_cost;
                break;
            case 2:
                self.res2 -= card.card_cost;
                break;
            case 3:
                self.res3 -= card.card_cost;
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