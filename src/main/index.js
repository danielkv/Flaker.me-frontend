import { app } from 'electron';
import { enableLiveReload } from 'electron-compile';

import initApp from './initApp';

// Keep a global reference of isDevMode
global.isDevMode = !!process.execPath.match(/[\\/]electron/);

// eslint-disable-next-line no-undef
if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=> {
	initApp();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});