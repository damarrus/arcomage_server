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
    };
    this.multipleSend = function (socket, messageType, array = []) {
        var data = '';
        var count = 0;
        array.forEach(function (item, i, arr) {
            ++count;
            item.messageType = messageType;
            data += JSON.stringify(item);
            if (count % 25) {
                data = '';
                var data1 = '';
                setTimeout(function () {
                    (isTestClient) ? socket.send(data1) : socket.write(data1);
                    console.log('send multiple '+messageType);
                }, 500 * count / 25);
            }
            if (count == array.length) {
                (isTestClient) ? socket.send(data) : socket.write(data);
                console.log('send multiple '+messageType);
                //console.log(data);
            }
        });
    };
    this.arraySend = function (socket, messageType, array = [], data = {}) {
        var string = '';
        var count = 0;
        array.forEach(function (item, i, arr) {
            ++count;
            string += item+',';
            if (count == array.length) {
                string = string.substring(0, string.length - 1);
                data.messageType = messageType;
                data.card_ids = string;
                data = JSON.stringify(data);
                (isTestClient) ? socket.send(data) : socket.write(data);
                console.log('send array '+messageType);
            }
        });
    };
}

module.exports = Messenger;