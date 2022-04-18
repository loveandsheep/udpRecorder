const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

socket.on('listening', () => {
    const address = socket.address();
    console.log('UDP socket listening on ' + address.port);
});

socket.on('message', (message, remote) => {
	console.log('received...size = ' + message.length);
});

exports.listen = function(){
	socket.bind(51000);
}