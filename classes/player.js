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
    }

    this.newGame = function (turn) {
        this.tower_hp = 30;
        this.wall_hp = 15;
        this.turn = turn;
        this.res1 = 10;
        this.res2 = 10;
        this.res3 = 10;
        this.gen1 = 2;
        this.gen2 = 2;
        this.gen3 = 2;
    };
    this.useCard = function (card_id, owner, callback) {
        cards.getCardByID(card_id, function (card) {
            if (owner) {
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
                self.turn = false;
                self.tower_hp += card.card_self_tower_hp;
                self.wall_hp += card.card_self_wall_hp;

                if (self.wall_hp < 0) {
                    self.tower_hp += self.wall_hp;
                    self.wall_hp = 0;
                }

                self.gen1 += card.card_self_gen1;
                self.gen2 += card.card_self_gen2;
                self.gen3 += card.card_self_gen3;

                self.res1 += card.card_self_res1;
                self.res2 += card.card_self_res2;
                self.res3 += card.card_self_res3;
            } else {
                self.turn = true;
                self.tower_hp += card.card_enemy_tower_hp;
                self.wall_hp += card.card_enemy_wall_hp;

                if (self.wall_hp < 0) {
                    self.tower_hp += self.wall_hp;
                    self.wall_hp = 0;
                }

                self.gen1 += card.card_self_gen1;
                self.gen2 += card.card_self_gen2;
                self.gen3 += card.card_self_gen3;

                self.res1 += card.card_self_res1;
                self.res2 += card.card_self_res2;
                self.res3 += card.card_self_res3;

                self.res1 += self.gen1;
                self.res2 += self.gen2;
                self.res3 += self.gen3;
            }
            //changeTurn();
            callback();
        });
    };

    function changeTurn() {
        if (this.turn == true) {
            this.turn = false;
        } else if (this.turn == false) {
            this.turn = true;
        }
    }
}
module.exports = Player;