/**
 * Created by nikita on 11.11.2016.
 */
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

function Bot() {
    this.newGame = function (turn) {
        this.tower_hp = 30;
        this.turn = turn;
    };
    this.useCard = function (card_id, owner) {
        cards.getCardByID(card_id, function (card) {
            if (owner) {
                this.tower_hp += card.card_self_tower_hp;
            } else {
                this.tower_hp += card.card_enemy_tower_hp;
            }
            changeTurn();
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
module.exports = Bot;