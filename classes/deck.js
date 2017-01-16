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
        query,
        full = true,
        max_card = 20;
    if (isNew) {
        query = "SELECT max(deck_num) as max_num FROM deck WHERE player_id='"+player_id+"'";
        db.query(query, function(err, result) {
            if ((result[0].max_num == (deck_num - 1)) || (result[0].max_num == null && deck_num == 1)) {
                query = "SELECT count(deck_name) as count_deck_name FROM deck " +
                    "WHERE deck_name='"+deck_name+"' AND player_id='"+player_id+"' LIMIT 1";
                db.query(query, function(err, result) {
                    if (result[0].count_deck_name == 0) {
                        query = "INSERT INTO deck (deck_num, deck_name, player_id) VALUES " +
                            "('" + deck_num + "','" + deck_name + "','" + player_id + "')";
                        db.query(query, function (err, result) {
                            deck_id = result.insertId;
                            callback(true);
                        });
                    } else {
                        callback('deckNameIsNotUnique');
                    }
                });
            } else {
                callback('invalidDeckNum');
            }
        });
    } else {
        query = 'SELECT card_id FROM deckcard WHERE deck_id='+deck_id;
        db.query(query, function(err, result) {
            if (result.length > 0) {
                var count = 0;
                result.forEach(function (item, i, arr) {
                    ++count;
                    cards.push(item.card_id);
                    if (item.card_id == 0) {
                        full = false;
                    }
                    if (count == result.length) {
                        callback();
                    }
                });
            } else {
                callback();
            }
        });
    }

    this.setDeckNum = function (new_deck_num) {
        deck_num = new_deck_num;
    };

    this.isDeckFull = function () {
        return full;
    };

    this.setDeckName = function (deck_name, callback) {
        var query = "SELECT count(deck_name) as count_deck_name FROM deck " +
            "WHERE deck_name='"+deck_name+"' AND player_id='"+player_id+"' LIMIT 1";
        db.query(query, function(err, result) {
            if (result[0].count_deck_name == 0) {
                query = "UPDATE deck SET deck_name='"+deck_name+"' WHERE deck_id="+deck_id;
                db.query(query, function(err, result) {
                    callback(true);
                });
            } else {
                callback('deckNameIsNotUnique');
            }
        });
    };
    this.deleteDeck = function (callback) {
        var query = "SELECT count(deck_id) as count_deck_id FROM deck " +
            "WHERE deck_num = '"+deck_num+"' AND player_id = '"+player_id+"' LIMIT 1";
        db.query(query, function(err, result) {
            if (result[0].count_deck_id > 0) {
                query = "DELETE FROM deck WHERE deck_id="+deck_id;
                db.query(query, function(err, result) {
                    query = "DELETE FROM deckcard WHERE deck_id="+deck_id;
                    db.query(query, function(err, result) {
                        callback(true);
                    });
                });
            } else {
                callback('undefinedDeckNum');
            }
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
                    card_ids.forEach(function (card_id, i, arr) {
                        ++count;
                        query += ' (' + deck_id + ', ' + card_id + '),';
                        if (count == card_ids.length) {
                            query = query.substring(0, query.length - 1);
                            db.query(query, function (err, result) {
                                cards = card_ids;
                                var count_full = 0;
                                full = true;
                                card_ids.forEach(function (item, i, arr) {
                                    ++count_full;
                                    if (item == 0) {
                                        full = false;
                                    }
                                    if (count_full == card_ids.length) {
                                        callback();
                                    }
                                });
                            });
                        }
                    });
                });
            } else {
                query = 'INSERT INTO deckcard (deck_id, card_id) VALUES';
                var count = 0;
                card_ids.forEach(function (card_id, i, arr) {
                    ++count;
                    query += ' (' + deck_id + ', ' + card_id + '),';
                    if (count == card_ids.length) {
                        query = query.substring(0, query.length - 1);
                        db.query(query, function (err, result) {
                            cards = card_ids;
                            var count_full = 0;
                            full = true;
                            card_ids.forEach(function (item, i, arr) {
                                ++count_full;
                                if (item == 0) {
                                    full = false;
                                }
                                if (count_full == card_ids.length) {
                                    callback();
                                }
                            });
                        });
                    }
                });
            }
        });
    };
}

module.exports = Deck;