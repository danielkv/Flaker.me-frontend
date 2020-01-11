import { Tray, Menu, app } from 'electron';
import path from 'path';

import client from '../../apollo/client';
import mainScreenFn from '../windows/main';

import { LOG_USER_OUT } from '../../queries/user';

let trayIcon = null;

export function destroyTrayIcon() {
	if (!trayIcon) return;
	trayIcon.destroy();
	trayIcon = null;
}

export function createTrayIcon() {
	if (trayIcon) return;

	const mainScreen = mainScreenFn.get();

	trayIcon = new Tray(path.resolve(__dirname, '..', 'assets', 'icons', 'tray-icon.png'));

	trayIcon.setToolTip('Flaker.me');
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Configurações', click: ()=> { mainScreen.webContents.send('redirectTo', 'settings'); } },
		{ type: 'separator' },
		{ label: 'Logout', click: ()=> client.mutate({ mutation: LOG_USER_OUT }) },
		{ role: 'quit', label: 'Fechar' },
	]);
	trayIcon.setContextMenu(contextMenu);

	trayIcon.on('click', ()=>{
		// eslint-disable-next-line no-unused-expressions
		if (mainScreen) mainScreen.isVisible() ? mainScreen.hide() : mainScreen.show();
	});
	
	trayIcon.on('balloon-click', ()=>{
		if (mainScreen) mainScreen.show();
	});

	app.on('before-quit', () => {
		destroyTrayIcon();
	});
}