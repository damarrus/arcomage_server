/**
 * Created by nikita on 11.11.2016.
 */

const Collection = require('./collection');
const carder = require('./card');
const Messenger = require('./messenger');

function Player(info = {}, socket = false) {
    // Основные параметры игрока
    var messenger = new Messenger();
    var self = this,
        inSearch = false,
        inGame = false,
        ready = false,
        collection_obj = false,
        collection = false,
        deck_num = false,
        player_id = info.player_id || 0,
        player_name = info.player_name || 'bot_name',
        player_login = info.player_login || 'bot_login';
    // Параметры игрока в игре
    var turn, tower_hp, wall_hp, res1, res2, res3, gen1, gen2, gen3;
    var deckCards = [];
    var handCards = [];

    this.player_id = info.player_id || 0;
    this.player_name = info.player_name || 'bot_name';

    if (!socket) {
        ready = true;
    }
    this.collection = new Collection(player_id, function () {});

    this.setDeckNum = function (new_deck_num, callback) {
        this.collection.getDeckByNum(new_deck_num, function (deck) {
            deck.getDeckCardsID(function (cards) {
                if (deck.isDeckFull()) {
                    var count = 0;
                    deck_num = new_deck_num;
                    deckCards = [];
                    cards.forEach(function (item, i, arr) {
                        ++count;
                        deckCards.push(item);
                        if (count == cards.length) {
                            callback(true);
                        }
                    });
                } else {
                    callback(false);
                }
            });
        });
    };

    this.gethandCards = function () {
        return handCards;
    };

    this.setCardsToDeck = function (callback = function () {}) {
        this.collection.getDeckByNum(deck_num, function (deck) {
            deck.getDeckCardsID(function (cards) {
                deckCards = cards;
                function setStartCardsToHand (callback, count = 0) {
                    if (count == 6) {
                        callback();
                    } else {
                        setRandomCardFromDeckToHand(function () {
                            ++count;
                            setStartCardsToHand(callback, count);
                        });
                    }
                }
                setStartCardsToHand(function () {
                    callback();
                });
            })
        });
    };

    function setRandomCardFromDeckToHand(callback) {
        var i = Math.floor(Math.random() * deckCards.length);
        if (deckCards.length != 0) {
            handCards.push(deckCards[i]);
            carder.getCardByID(deckCards[i], function (card) {
                messenger.send(socket, "getCardRandom", card);
                deckCards.splice(i,1);
                callback();
            });
        } else {
            callback();
        }
    }
    this.changeCardFromHand = function (card_id, callback) {
        var count = 0;
        handCards.forEach(function (item, i, arr) {
            if (count == 0 && item == card_id) {
                ++count;
                handCards.splice(i,1);
                setRandomCardFromDeckToHand(function () {
                    callback();
                });
            }
        });
    };

    /*this.loadCollection = function (callback) {
        if (!this.collection) {
            new Collection(player_id, function (coll) {
                collection_obj = coll;
                self.collection = coll;
                callback(coll);
            });
        } else {
            callback(false);
        }
    };*/
    /*this.getCollection = function (callback) {
        callback(collection_obj);
    };*/
    this.getCollectionCardsID = function (callback) {
        this.loadCollection(function () {
            callback(collection.getCollectionCardsID());
        });
    };
    this.getCollectionCards = function (callback) {
        this.getCollectionCardsID(function (cards) {

        });
    };
    this.getDeckCards = function (deck_num, callback) {
        collection.getDeckCards(deck_num, function (cards) {
            carder.getCardByMultipleID(cards, function (result) {
                callback(result);
            });
        });
    };
    this.setDeckCards = function (deck_num, cards, callback) {
        collection.setDeckCards(deck_num, cards, function () {
            callback();
        });
    };

    this.setInSearch = function (bool) {inSearch = bool;};
    this.getInSearch = function () {return inSearch;};
    this.setReady = function (bool) {ready = bool;};
    this.getReady = function () {return ready;};
    this.setInGame = function (bool) {inGame = bool;};
    this.getInGame = function () {return inGame;};
    this.getParam = function (type) {
        switch (type) {
            case 'turn':return turn;
            case 'tower_hp':return tower_hp;
            case 'wall_hp':return wall_hp;
            case 'res1':return res1;
            case 'res2':return res2;
            case 'res3':return res3;
            case 'gen1':return gen1;
            case 'gen2':return gen2;
            case 'gen3':return gen3;
            case 'player_id':return player_id;
            case 'player_name':return player_name;
            case 'player_login':return player_login;
        }
    };
    this.setParam = function (type, value) {
        switch (type) {
            case 'turn':turn = value; break;
            case 'tower_hp':tower_hp = value; break;
            case 'wall_hp':wall_hp = value; break;
            case 'res1':res1 = value; break;
            case 'res2':res2 = value; break;
            case 'res3':res3 = value; break;
            case 'gen1':gen1 = value; break;
            case 'gen2':gen2 = value; break;
            case 'gen3':gen3 = value; break;
            case 'player_id':player_id = value; break;
        }
    };
    this.getPlayerStatus = function () {
        return {
            turn: turn,
            tower_hp: tower_hp,
            wall_hp: wall_hp,
            res1: res1,
            res2: res2,
            res3: res3,
            gen1: gen1,
            gen2: gen2,
            gen3: gen3
        }
    };

    this.setPlayerStatus = function (turn_val, tower_hp_val, wall_hp_val,
                                     res1_val, res2_val, res3_val,
                                     gen1_val, gen2_val, gen3_val) {
        turn = turn_val;
        tower_hp = tower_hp_val;
        wall_hp = wall_hp_val;
        res1 = res1_val;
        res2 = res2_val;
        res3 = res3_val;
        gen1 = gen1_val;
        gen2 = gen2_val;
        gen3 = gen3_val;
        if (turn_val) this.growthRes(function () {});

    };
    this.resetPlayerStatus = function () {
        turn = 0;
        tower_hp = 0;
        wall_hp = 0;
        res1 = 0;
        res2 = 0;
        res3 = 0;
        gen1 = 0;
        gen2 = 0;
        gen3 = 0;
    };
    this.changePlayerStatus = function (turn_val = turn, tower_hp_val = 0, wall_hp_val = 0, hp_val = 0,
                                        res1_val = 0, res2_val = 0, res3_val = 0,
                                        gen1_val = 0 , gen2_val = 0, gen3_val = 0, callback) {
        turn = turn_val;
        tower_hp += tower_hp_val;
        wall_hp += wall_hp_val;
        wall_hp += hp_val;
        if (wall_hp < 0) {
            tower_hp += wall_hp;
            wall_hp = 0;
        }
        res1 = ((res1 + res1_val) >= 0) ? (res1 + res1_val) : 0;
        res2 = ((res2 + res2_val) >= 0) ? (res2 + res2_val) : 0;
        res3 = ((res3 + res3_val) >= 0) ? (res3 + res3_val) : 0;

        gen1 = ((gen1 + gen1_val) >= 1) ? (gen1 + gen1_val) : 1;
        gen2 = ((gen2 + gen2_val) >= 1) ? (gen2 + gen2_val) : 1;
        gen3 = ((gen3 + gen3_val) >= 1) ? (gen3 + gen3_val) : 1;
        callback();
    };
    this.growthRes = function (callback) {
        res1 += gen1;
        res2 += gen2;
        res3 += gen3;
        callback();
    };
    this.costCard = function (card, callback) {
        if (res1 - card.card_res1 < 0 || res2 - card.card_res2 < 0 || res3 - card.card_res3 < 0) {
            callback(false);
        } else {
            res1 -= card.card_res1;
            res2 -= card.card_res2;
            res3 -= card.card_res3;
            callback(true);
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