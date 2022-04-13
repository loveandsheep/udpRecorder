const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
    //react => electron
    eFunc: async(data) => await ipcRenderer.invoke('eFunc', data),
    rec : async(data) => await ipcRenderer.invoke('rec', data),
    stop: async(data) => await ipcRenderer.invoke('stop', data),
    play: async(data) => await ipcRenderer.invoke('play', data),
    load: async(data) => await ipcRenderer.invoke('load', data),
    save: async(data) => await ipcRenderer.invoke('save', data),
    loop: async(data) => await ipcRenderer.invoke('loop', data),
    
    //electron => reaect
    receive: (channel, func) => {
		let validChannel = ["dataSize", "stop", "time", "fileName"];//function list
		if (validChannel.includes(channel)) {
			ipcRenderer.on(channel, (event, ...args) => func(...args));
		}
	}
});

//(window as any).ipc.eFunc(data);
//(window as any).ipc.receive("func", (data: any) => {});
// mainWindow.webContents.send('oscReceive', element);