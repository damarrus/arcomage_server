/**
 * Created by nikita on 21.12.2016.
 */

function Gameconf(callback) {
    const db = require('./db');
    const Messenger = require('./messenger');

    var messenger = new Messenger();

    var query = "SELECT * FROM gameconf WHERE gameconf_id = 1";
    db.query(query, function(err, result) {
        callback(result[0]);
    });
}
module.exports = Gameconf;
