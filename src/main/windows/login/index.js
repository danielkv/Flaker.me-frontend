function create () {
	windows.loginScreen = new BrowserWindow({
		width: 495,
		height: 550,
		frame: false,
		resizable: false,
		titleBarStyle: 'hidden',
		show: false,
		transparent: true,
		maximizable: false,
		icon: path.resolve(__dirname, '..', 'assets', 'icons', 'icon-32.png'),
	});

	// eslint-disable-next-line no-undef
	if (isDevMode) {
		await installExtension(REACT_DEVELOPER_TOOLS);
		windows.loginScreen.webContents.openDevTools();
	}
  
	// and load the index.html of the app.
	windows.loginScreen.loadURL(`file://${path.resolve(__dirname, '..', 'pages/login')}/index.html`);
  
	// Emitted when the window is closed.
	windows.loginScreen.on('closed', () => {
		windows.loginScreen = null;
	});
	
	windows.loginScreen.on('ready-to-show', () => {
		windows.loginScreen.show();
	});
}