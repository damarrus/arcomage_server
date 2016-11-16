/**
 * Created by nikita on 16.11.2016.
 */

const db = require('./db');
var card = {
    getCardByID: function(card_id, callback) {
        var query = 'SELECT * FROM card WHERE card_id='+card_id;
        db.query(query, function(err, result) {
            callback(result[0]);
        });
    },
    getCardRandom: function(callback) {
        var query = 'SELECT count(*) as count_card FROM card';
        db.query(query, function(err, result) {
            var id = Math.floor(Math.random() * (result[0].count_card)) + 1;
            query = 'SELECT * FROM card WHERE card_id='+id;
            db.query(query, function(err, result) {
                callback(result[0]);
            });
        });
    },
};

module.exports = card;