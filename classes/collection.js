/**
 * Created by nikita on 18.11.2016.
 */

const db = require('./db');
const Deck = require('./deck');
const async = require('async');
const carder = require('./card');

function Collection(player_id, callback) {

    var cards = [];
    var decks = [];
    var self = this;

    construct(callback);
    
    function construct(callback) {
        var query = 'SELECT count(*) as count_collection FROM collection WHERE player_id='+player_id;
        db.query(query, function(err, result) {
            if (result[0].count_collection == 0) {
                setStartCollectionAndDeck(function () {
                    loadCollection(function () {
                        loadDecks(callback);
                    });
                });
            } else {
                loadCollection(function () {
                    loadDecks(callback);
                });
            }
        });
    }
    function loadCollection(callback) {
        var query = 'SELECT card_id FROM collection WHERE player_id='+player_id;
        db.query(query, function(err, result) {
            var count = 0;
            result.forEach(function (item, i, arr) {
                ++count;
                cards.push(item.card_id);
                if (count == result.length) {
                    callback();
                }
            });
        });
    }
    function loadDecks(callback) {
        var query = 'SELECT count(*) as count_decks FROM deck WHERE player_id='+player_id;
        db.query(query, function(err, result) {
            if (result[0].count_decks == 0) {
                callback(false);
            } else {
                query = 'SELECT * FROM deck WHERE player_id=' + player_id;
                db.query(query, function (err, result) {
                    var count = 0;
                    result.forEach(function (item, i, arr) {
                        ++count;
                        decks.push(new Deck(false, item, function () {
                            if (count == result.length) {
                                callback();
                            }
                        }));
                    });
                });
            }
        });
    }
    function setStartCollectionAndDeck(callback) {
        var query = 'INSERT INTO collection (player_id, card_id, card_amount) VALUES ' +
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
            query = "INSERT INTO deck (deck_num, deck_name, player_id) VALUES (1, 'startDeck', "+player_id+")";
            db.query(query, function (err, result) {
                console.log(result);
                query = 'INSERT INTO deckcard (deck_id, card_id) VALUES ' +
                    '(' + result.insertId + ', 1),' +
                    '(' + result.insertId + ', 2),' +
                    '(' + result.insertId + ', 3),' +
                    '(' + result.insertId + ', 4),' +
                    '(' + result.insertId + ', 5),' +
                    '(' + result.insertId + ', 6),' +
                    '(' + result.insertId + ', 7),' +
                    '(' + result.insertId + ', 8),' +
                    '(' + result.insertId + ', 9),' +
                    '(' + result.insertId + ', 10),' +
                    '(' + result.insertId + ', 11),' +
                    '(' + result.insertId + ', 12),' +
                    '(' + result.insertId + ', 13),' +
                    '(' + result.insertId + ', 14),' +
                    '(' + result.insertId + ', 15)';
                db.query(query, function (err, result) {
                    callback();
                });
            });
        });
    }
    this.getCardsID = function (callback) {
        callback(cards);
    };
    this.getAllDecks = function () {
        var result = [];
        async.each(decks, function (deck, callback) {
            result.push(deck.getDeckInfo());
            callback();
        }, function (err) {
            callback(result);
        })
    };
    this.getDeckByNum = function(deck_num, callback) {
        decks.forEach(function (deck, i, arr) {
            if (deck.getDeckNum() == deck_num) {
                callback(deck);
            }
        })
    };
    this.createDeck = function (deck_name) {
        decks.push(new Deck(true, {player_id:player_id,deck_name:deck_name}, function () {

        }));
    };
    this.getDecks = function (callback) {
        callback(decks);
    };
}

module.exports = Collection;