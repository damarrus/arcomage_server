/**
 * Created by nikita on 18.11.2016.
 */

const db = require('./db');
const Deck = require('./deck');

function Collection(player_id, callback) {

    var cards = [];
    var decks = [];

    construct(callback);
    
    function construct(callback) {
        var query = 'SELECT count(*) as count_collection FROM collection WHERE player_id='+player_id;
        db.query(query, function(err, result) {
            if (result[0].count_collection == 0) {
                setStartCollectionAndDeck(function () {
                    
                });
            } else {
                query = 'SELECT card_id FROM collection WHERE player_id='+player_id;
                db.query(query, function(err, result) {
                    cards = result;
                    callback();
                });
            }
        });
    }
    function loadDecks(callback) {
        var query = 'SELECT count(*) as count_decks FROM deck WHERE player_id='+player_id;
        db.query(query, function(err, result) {
            if (result[0].count_decks == 0) {
                startDeck(callback);
            } else {
                query = 'SELECT deck_id, deck_name FROM collection WHERE player_id=' + player_id;
                db.query(query, function (err, result) {

                });
            }
        });
    }
    function setStartCollectionAndDeck(callback) {
        var query = 'INSERT INTO collection (player_id, card_id, card_num) VALUES ' +
            '(' + player_id + ', 1, 1),' +
            '(' + player_id + ', 2, 1),' +
            '(' + player_id + ', 3, 1),' +
            '(' + player_id + ', 4, 1),' +
            '(' + player_id + ', 5, 1),' +
            '(' + player_id + ', 6, 1),' +
            '(' + player_id + ', 7, 1),' +
            '(' + player_id + ', 8, 1),' +
            '(' + player_id + ', 9, 1),' +
            '(' + player_id + ', 10, 1),' +
            '(' + player_id + ', 11, 1),' +
            '(' + player_id + ', 12, 1),' +
            '(' + player_id + ', 13, 1),' +
            '(' + player_id + ', 14, 1),' +
            '(' + player_id + ', 15, 1),' +
            '(' + player_id + ', 16, 1),' +
            '(' + player_id + ', 17, 1),' +
            '(' + player_id + ', 18, 1),' +
            '(' + player_id + ', 19, 1),' +
            '(' + player_id + ', 20, 1)';
        db.query(query, function (err, result) {
            query = 'SELECT card_id FROM collection WHERE player_id=' + player_id;
            db.query(query, function (err, result) {
                cards = result;
                query = 'INSERT INTO deck (player_id, deck_name) VALUES ('+player_id+',startDeck)';
                db.query(query, function (err, result) {
                    query = 'SELECT deck_id, deck_name FROM collection WHERE player_id=' + player_id;
                    db.query(query, function (err, result) {
                        query = 'INSERT INTO deckcard (deck_id, card_id) VALUES ' +
                            '(' + result.deck_id + ', 1),' +
                            '(' + result.deck_id + ', 2),' +
                            '(' + result.deck_id + ', 3),' +
                            '(' + result.deck_id + ', 4),' +
                            '(' + result.deck_id + ', 5),' +
                            '(' + result.deck_id + ', 6),' +
                            '(' + result.deck_id + ', 7),' +
                            '(' + result.deck_id + ', 8),' +
                            '(' + result.deck_id + ', 9),' +
                            '(' + result.deck_id + ', 10),' +
                            '(' + result.deck_id + ', 11),' +
                            '(' + result.deck_id + ', 12),' +
                            '(' + result.deck_id + ', 13),' +
                            '(' + result.deck_id + ', 14),' +
                            '(' + result.deck_id + ', 15)';
                        db.query(query, function (err, result) {
                            callback();
                        });
                    });
                });
            });
        });
    }
    function startDeck(callback) {

    }

    this.getCollection = function () {
        return cards;
    };
    this.getDecks = function () {
        return decks;
    };


}

module.exports = Collection;