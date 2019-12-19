import { BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';

async function create() {
	// Create the browser window.
	let splashScreen = new BrowserWindow({
		width: 400,
		height: 150,
		frame: false,
		resizable: false,
		titleBarStyle: 'hidden',
		show: false,
		transparent: true,
		maximizable: false,
		icon: path.resolve(__dirname, '..', 'assets', 'icons', 'icon-32.png'),
		movable: false,
		center: true,
	});

	// eslint-disable-next-line no-undef
	if (isDevMode) {
		await installExtension(REACT_DEVELOPER_TOOLS);
		splashScreen.webContents.openDevTools();
	}
  
	// and load the index.html of the app.
	splashScreen.loadURL(`file://${path.resolve(__dirname, '..', '..', 'public', 'index.html?page=App')}`);
  
	// Emitted when the window is closed.
	splashScreen.on('closed', () => {
		splashScreen = null;
	});
	
	splashScreen.on('ready-to-show', () => {
		splashScreen.show();
	});

	return splashScreen;
}

export default {
	create
}