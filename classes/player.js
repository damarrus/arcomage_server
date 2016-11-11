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
        this.turn = turn;
    };
    this.useCard = function (card_id, owner, callback) {
        cards.getCardByID(card_id, function (card) {
            if (owner) {
                this.tower_hp += card.card_self_tower_hp;
            } else {
                this.tower_hp += card.card_enemy_tower_hp;
            }
            changeTurn();
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