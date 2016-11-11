/**
 * Created by nikita on 11.11.2016.
 */

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

function Match(player1_id, player2_id) {
    var matchID;
    var query = 'INSERT INTO matches (match_player1_id, match_player2_id, match_result) VALUES ('+ player1_id +','+ player2_id +',0)';
    console.log(query);
    connection.query(query, function(err, result) {
        //console.log(result.insertId);
        matchID = result.insertId;
    });

    this.tower_hp = 30;
    setTimeout(function () {
        console.log(matchID)
    }, 1000);
    console.log('матч создан');
}
module.exports = Match;