/**
 * Created by nikita on 16.11.2016.
 */

// TODO: Сделать его так же, как card.js
function Messenger() {

    const isTestClient = (process.argv[2] == 'test');

    this.send = function (socket, messageType, data = {}) {
        data.messageType = messageType;
        data = JSON.stringify(data);
        (isTestClient) ? socket.send(data) : socket.write(data);
        console.log(data);
    }
}

module.exports = Messenger;