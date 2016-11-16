/**
 * Created by nikita on 16.11.2016.
 */

const Match = require('./match');
const Player = require('./player');
const Messenger = require('./messenger');
const db = require('./db');

function Game() {

    var messenger = new Messenger();
    var matches = [];
    var inSearch = [];

    this.auth = function (socket, player_login, player_password) {
        var query = 'SELECT count(*) as count_player FROM player WHERE player_login='+player_login+' AND player_password='+player_password;
        db.query(query, function(err, result) {
            if (result[0].count_player != 0){
                query = 'SELECT * FROM player WHERE player_login='+player_login+' AND player_password='+player_password;
                db.query(query, function(err, result) {
                    socket.player = new Player(result[0], socket);
                    messenger.send(socket, "auth", {
                        valid: true
                    });
                });
            } else {
                messenger.send(socket, "auth", {
                    valid: false
                });
            }
        });
    };

    this.searchGame = function (socket) {
        if (!inSearch[0]) {
            inSearch.push(socket);
            socket.player.inSearch = true;
        } else {
            console.log('игра найдена');
            var opponent = inSearch[0];
            inSearch.splice(inSearch.indexOf(opponent), 1);

            opponent.opponent = socket;
            socket.opponent = opponent;
            opponent.player.inSearch = false;

            var match = new Match(socket, opponent, "searchGame", function () {
                matches[match.getMatchID()] = match;
            });

        }
    };

    this.startGame = function (socket) {
        setTimeout(function () {
            var match = matches[socket.matchID];
            match.readyPlayer(socket.player.player_id);
            if (match.getReadyPlayer()) {
                match.sendCardStart();
            }
        }, 500)
    };

    this.useCard = function (socket, card_id, discard) {
        var match = matches[socket.matchID];
        match.useCard(socket.player.player_id, card_id, discard);
    };

    this.closeMatch = function () {

    };
}

module.exports = Game;