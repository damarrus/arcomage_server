/**
 * Created by nikita on 18.11.2016.
 */

const db = require('./db');

function Deck(player_id) {

    var cards = [];

    var query = 'SELECT count(*) as count_collection FROM collection WHERE player_id='+player_id;
    db.query(query, function(err, result) {
        if (result[0].count_collection == 0) {
            query = 'INSERT INTO collection (player_id, card_id, card_num) VALUES ' +
                '('+player_id+', 1, 1),' +
                '('+player_id+', 2, 1),' +
                '('+player_id+', 3, 1),' +
                '('+player_id+', 4, 1),' +
                '('+player_id+', 5, 1),' +
                '('+player_id+', 6, 1),' +
                '('+player_id+', 7, 1),' +
                '('+player_id+', 8, 1),' +
                '('+player_id+', 9, 1),' +
                '('+player_id+', 10, 1),' +
                '('+player_id+', 11, 1),' +
                '('+player_id+', 12, 1),' +
                '('+player_id+', 13, 1),' +
                '('+player_id+', 14, 1),' +
                '('+player_id+', 15, 1)';
            db.query(query, function(err, result) {
                query = 'SELECT card_id FROM collection WHERE player_id='+player_id;
                db.query(query, function(err, result) {
                    cards = result;
                });
            });
        } else {
            query = 'SELECT card_id FROM collection WHERE player_id='+player_id;
            db.query(query, function(err, result) {
                cards = result;
            });
        }
    });

    this.getCollection = function () {
        return cards;
    }

}

module.exports = Deck;