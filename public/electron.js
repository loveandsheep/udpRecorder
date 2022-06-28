const recorder = require('./udpParse');
const {app, BrowserWindow, dialog} = require('electron')
const path = require('path')
const fs = require('fs');
const {ipcMain} = require('electron');
const isDev = require("electron-is-dev");
let mainWindow;

function createWindow () {

	var info_path = path.join(app.getPath("userData"), "windowInfo.json");
	var bounds_info;
	
	try{
		bounds_info = JSON.parse(fs.readFileSync(info_path, 'utf8'));
	}
	catch{
		bounds_info = {x: 200, y: 200, width: 600, height: 600};
	}

	mainWindow = new BrowserWindow({
		x: bounds_info.x,
		y: bounds_info.y,
		width: bounds_info.width,
		height: bounds_info.height,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	mainWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);

	mainWindow.on('close', function() {
		recorder.saveRoute();
		fs.writeFileSync(info_path, JSON.stringify(mainWindow.getBounds()));
	});

}

app.whenReady().then(() => {
	createWindow()
	
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
});

ipcMain.handle('eFunc', (e, data) => {
	console.log(data);
});

ipcMain.handle('rec', (e, data) => {
	recorder.rec(mainWindow, data);
});

ipcMain.handle('stop', (e, data) => {
	recorder.stop();
});

ipcMain.handle('play', (e, data) => {
	recorder.play(mainWindow, data);
});

ipcMain.handle('loop', (e, data) => {
	recorder.setLoop(data);
})

ipcMain.handle('routeTable', (e, data) => {
	recorder.setTable(data.table);
})

ipcMain.handle('splitReady', (e, data) => {
	recorder.loadRoute(mainWindow);
})

ipcMain.handle('routeSet', (e, data) => {
	//routingを有効にする
	//有効にできたらreactにtrueを返す
	if (data.enable)
	{
		recorder.splitReceive();
	}
	else
	{
		recorder.splitClose();
	}
	mainWindow.webContents.send('route', {enable: data.enable});
})

ipcMain.handle('load', (e, data) => {
	const path = dialog.showOpenDialogSync(mainWindow, {
		buttonLabel: '読み込み',
		filters: [
			{name: 'UDP data', extensions: ['udp']}
		],
		properties: [
			'openFile',
		]
	})

	if (path !== undefined)
	{
		recorder.load(mainWindow, path[0]);
	}
});

ipcMain.handle('save', (e, data) => {
	const path = dialog.showSaveDialogSync(mainWindow, {
		buttonLabel: '保存',
		filters: [
			{name: 'UDP data', extensions: ['udp']}
		],
		properties: [
			'openFile',
		]
	})

	if (path !== undefined) recorder.save(mainWindow, path);
});