import { BrowserWindow, screen } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';

let mainScreen = null;

function get() {
	return mainScreen;
}

function create() {
	// if instance exists only return it
	if (mainScreen) return mainScreen;

	// get primary screen dimentions
	const { width: wScreen, height: hScreen } = screen.getPrimaryDisplay().workAreaSize;

	mainScreen = new BrowserWindow({
		width: 370,
		height: 570,
		x: wScreen - 370,
		y: hScreen - 570,
		frame: false,
		resizable: false,
		titleBarStyle: 'hidden',
		icon: path.resolve(__dirname, '..', '..', 'assets', 'icons', 'icon-32.png'),
		show: false,
		transparent: true,
		maximizable: false,
		skipTaskbar: true,
		alwaysOnTop: true,
		movable: false,
	});

	// eslint-disable-next-line no-undef
	if (isDevMode) {
		installExtension(REACT_DEVELOPER_TOOLS)
			// .then(()=>installExtension(APOLLO_DEVELOPER_TOOLS, true))
			.then(()=>mainScreen.webContents.openDevTools());
	}

	// and load the index.html of the app.
	mainScreen.loadURL(`file://${path.resolve(__dirname, '..', '..', '..', 'public', 'index.html')}`);

	// Emitted when the window is closed.
	mainScreen.on('closed', () => {
		mainScreen = null;
	});

	mainScreen.on('ready-to-show', () => {
		mainScreen.show();
	});

	return mainScreen;
}

export default {
	get,
	create,
}