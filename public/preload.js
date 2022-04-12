const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
    //react => electron
    eFunc: async(data) => await ipcRenderer.invoke('eFunc', data),
    
    //electron => reaect
    receive: (channel, func) => {
		let validChannel = ["func"];//function list
		if (validChannel.includes(channel)) {
			ipcRenderer.on(channel, (event, ...args) => func(...args));
		}
	}
});

//(window as any).ipc.eFunc(data);
//(window as any).ipc.receive("func", (data: any) => {});