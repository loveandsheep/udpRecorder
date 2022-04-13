const recorder = require('./udpParse');
const {app, BrowserWindow, dialog} = require('electron')
const path = require('path')
const {ipcMain} = require('electron');
const isDev = require("electron-is-dev");
let mainWindow;

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 600,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	mainWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);

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