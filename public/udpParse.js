const dgram = require('dgram');
let socket = dgram.createSocket('udp4');
const {app} = require('electron')
const path = require('path')
const fs = require('fs');
const { clearInterval } = require('timers');

//データ長[2]経過時間[4]メッセージ[n]が続く
const SIZE_MLEN = 2;//バイナリのデータ長
const SIZE_PASSED = 4;//

let isRecording = false;
let recTime = Date.now();
let playId = 0;
let timerId = 0;
let dataSizeInt = 0;
let buffer = new ArrayBuffer(1000 * 1000 * 1000);
let dv = new DataView(buffer);
let u8Arr = new Uint8Array(buffer);
let dataOffset = 0;
let totalSize = 0;
let isLoop = true;

let splitRecv;
let routeTable = [];

exports.saveRoute = function() {
	var info_path = path.join(app.getPath("userData"), "routes.json");
	fs.writeFileSync(info_path, JSON.stringify(routeTable));
}

exports.loadRoute = function(mainWindow) {
	var info_path = path.join(app.getPath("userData"), "routes.json");
	var data;
	try{
		data = {route: JSON.parse(fs.readFileSync(info_path, 'utf8'))};
	}
	catch{
		data = {route: []};
	}
	mainWindow.webContents.send('routeTable', data);
}

exports.setTable = function(data) {
	routeTable = data;
}

exports.splitReceive = function() {
	console.log('call splitReceive()');
	splitRecv = dgram.createSocket('udp4');
	splitRecv.bind(51000, () => {
		splitRecv.setRecvBufferSize(65536 * 100);	
		splitRecv.on('message', (message, remote) => {
			for (rt of routeTable) {
				if (rt.srchost == remote.address)
				{
					splitRecv.send(message, rt.dstport, rt.dsthost);
				}
			}
		});
	})
}

exports.splitClose = function() {
	console.log('call splitClose()');
	splitRecv.close();
}

exports.setLoop = function(l) {
	isLoop = !l;
}

exports.rec = function(mainWindow, prop) {
	isRecording = true;
	recTime = Date.now();
	dataOffset = 0;
	totalSize = 0;
	console.log('starting :' + dataOffset);
	socket.bind(prop.port, () => {
		console.log('bufSize :' + socket.getRecvBufferSize());
		socket.setRecvBufferSize(65536 * 100);	
		console.log('bufSize :' + socket.getRecvBufferSize());
	});

	clearInterval(dataSizeInt);
	dataSizeInt = setInterval(() => {
		mainWindow.webContents.send('dataSize', dataOffset);
	}, 500);

	clearInterval(timerId);

	timerId = setInterval(() => {
		const passed = Date.now() - recTime;
		mainWindow.webContents.send('time', passed);
	}, 100);

}

exports.stop = function() {
	isRecording = false;
	clearInterval(playId);
	console.log('closed.');
	clearInterval(dataSizeInt);
	clearInterval(timerId);
}

exports.load = function(mainWindow, path) {
	const buf = fs.readFileSync(path);
	console.log('buffer :' + buf.byteLength);
	totalSize = buf.byteLength;
	u8Arr.set(buf, 0);
	const index = path.lastIndexOf('\\') + 1;
	mainWindow.webContents.send('dataSize', totalSize);
	mainWindow.webContents.send('fileName', path.substring(index));
}

exports.save = function(mainWindow, path) {
	fs.writeFile(path, u8Arr.slice(0, dataOffset), err => {
		const index = path.lastIndexOf('\\') + 1;
		mainWindow.webContents.send('fileName', path.substring(index));
	});
}

exports.play = function(mainWindow, prop) {
	recTime = Date.now();
	dataOffset = 0;
	clearInterval(playId);
	clearInterval(timerId);

	timerId = setInterval(() => {
		const passed = Date.now() - recTime;
		mainWindow.webContents.send('time', passed);
	}, 100);

	playId = setInterval(() => {
		//Playからの経過時間を取得
		const passed = Date.now() - recTime;

		//次のメッセージのデータサイズと、送信時刻を取得
		let dataSize = dv.getUint16(dataOffset);
		let lastTime = dv.getUint32(dataOffset + 2);
		
		while (lastTime <= passed)
		{
			//メッセージの内容を切り出し
			const buf = u8Arr.slice(
							dataOffset + SIZE_MLEN + SIZE_PASSED, 
							dataOffset + dataSize);
			
			//メッセージを送信
			socket.send(buf, prop.port, prop.host);

			//次のメッセージ用にデータオフセット
			dataOffset += dataSize;
			dataSize = dv.getUint16(dataOffset);
			lastTime = dv.getUint32(dataOffset + 2);
			if (dataOffset >= totalSize) break;
		}

		if (dataOffset >= totalSize) 
		{
			if (isLoop)
			{
				//ループの場合頭出し
				recTime = Date.now();
				dataOffset = 0;	
			}
			else
			{
				mainWindow.webContents.send('stop', 0);
				console.log('finish');
				clearInterval(playId);
				clearInterval(timerId);
			}
		}

	}, 1);

}

socket.on('listening', () => {
	const address = socket.address();
	console.log('UDP socket listening on ' + address.address + ":" + address.port);
});


socket.on('message', (message, remote) => {

	if (isRecording)
	{
		const now = Date.now();
		const passed = now - recTime;
		const messageLength = SIZE_MLEN + SIZE_PASSED + message.length;
		

		dv.setUint16(dataOffset, messageLength);
		dataOffset += SIZE_MLEN;
		dv.setUint32(dataOffset, passed);
		dataOffset += SIZE_PASSED;

		u8Arr.set(message, dataOffset);
		dataOffset += message.length;
		totalSize = dataOffset;
	}

});

socket.on("error", (err) => {
	console.log("server error: \n" + err.stack);
	socket.close();
});