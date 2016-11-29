/**
 * Created by nikita on 18.11.2016.
 */

const db = require('./db');
const async = require('async');

function Deck(isNew, params, callback) {
    var cards = [],
        deck_id = params.deck_id || 0,
        deck_num = params.deck_num,
        deck_name = params.deck_name,
        player_id = params.player_id,
        query;
    if (isNew) {
        query = 'SELECT max(deck_num) as max_num FROM deck WHERE player_id='+player_id;
        db.query(query, function(err, result) {
            query = "INSERT INTO deck (deck_num, deck_name, player_id) VALUES " +
                "("+(result[0].max_num+1)+",'"+deck_name+"',"+player_id+")";
            db.query(query, function(err, result) {
                deck_id = result.insertId;
                callback();
            });
        });
    } else {
        query = 'SELECT card_id FROM deckcard WHERE deck_id='+deck_id;
        db.query(query, function(err, result) {
            if (result.length > 0) {
                var count = 0;
                result.forEach(function (item, i, arr) {
                    ++count;
                    cards.push(item.card_id);
                    if (count == result.length) {
                        callback();
                    }
                });
            } else {
                callback();
            }
        });
    }

    this.setDeckName = function (deck_name, callback) {
        var query = "UPDATE deck SET deck_name='"+deck_name+"' WHERE deck_id="+deck_id;
        db.query(query, function(err, result) {
            callback();
        });
    };
    this.deleteDeck = function (callback) {
        var query = "DELETE FROM deck WHERE deck_id="+deck_id;
        db.query(query, function(err, result) {
            query = "DELETE FROM deckcard WHERE deck_id="+deck_id;
            db.query(query, function(err, result) {
                callback();
            });
        });
    };
    this.getDeckNum = function () {
        return deck_num;
    };
    this.getDeckCardsID = function (callback) {
        callback(cards);
    };
    this.getDeckInfo = function (callback) {
        callback({deck_num: deck_num, deck_name: deck_name});
    };
    this.setDeckCards = function (card_ids, callback) {
        var query = 'SELECT count(*) as counter FROM deckcard WHERE deck_id='+deck_id;
        db.query(query, function(err, result) {
            if (result[0].counter > 0) {
                query = 'DELETE FROM deckcard WHERE deck_id=' + deck_id;
                db.query(query, function (err, result) {
                    query = 'INSERT INTO deckcard (deck_id, card_id) VALUES';
                    var count = 0;
                    console.log(count);
                    card_ids.forEach(function (card_id, i, arr) {
                        ++count;
                        query += ' (' + deck_id + ', ' + card_id + '),';
                        if (count == card_ids.length) {
                            query = query.substring(0, query.length - 1);
                            db.query(query, function (err, result) {
                                cards = card_ids;
                                callback();
                            });
                        }
                    });
                });
            } else {
                query = 'INSERT INTO deckcard (deck_id, card_id) VALUES';
                var count = 0;
                console.log(count);
                card_ids.forEach(function (card_id, i, arr) {
                    ++count;
                    query += ' (' + deck_id + ', ' + card_id + '),';
                    if (count == card_ids.length) {
                        query = query.substring(0, query.length - 1);
                        db.query(query, function (err, result) {
                            cards = card_ids;
                            callback();
                        });
                    }
                });
            }
        });
    };
}

module.exports = Deck;