/* eslint-disable import/no-cycle */
import { Tray, Menu, app } from 'electron';
import path from 'path';

import client from '../../apollo/client';
import mainScreenFn from '../windows/main';

import { LOG_USER_OUT, GET_LOGGED_IN_USER_ID } from '../../queries/user';

let trayIcon = null;

export function getTrayIcon() {
	return trayIcon;
}

export function createContextMenu(userStatus) {
	const mainScreen = mainScreenFn.get();

	if (userStatus === 'loggedIn') {
		return Menu.buildFromTemplate([
			{ label: 'Configurações', click: ()=> { mainScreen.webContents.send('redirectTo', 'settings'); mainScreen.show(); } },
			{ type: 'separator' },
			{ label: 'Logout', click: () => client.mutate({ mutation: LOG_USER_OUT }) },
			{ role: 'quit', label: 'Fechar' },
		]);
	}

	return Menu.buildFromTemplate([
		{ role: 'quit', label: 'Fechar' },
	]);
}

export function destroyTrayIcon() {
	if (!trayIcon) return;
	trayIcon.destroy();
	trayIcon = null;
}

export function createTrayIcon() {
	if (trayIcon) return;

	const mainScreen = mainScreenFn.get();

	trayIcon = new Tray(path.resolve(__dirname, '..', '..', 'assets', 'icons', 'tray-icon.png'));

	trayIcon.setToolTip('Flaker.me');
	
	trayIcon.setContextMenu(createContextMenu(mainScreen));

	trayIcon.on('click', () => {
		const { loggedUserId } = client.readQuery({ query: GET_LOGGED_IN_USER_ID });

		if (mainScreen) {
			if (mainScreen.isVisible()) {
				mainScreen.hide();
				if (loggedUserId) mainScreen.webContents.send('redirectTo', 'files');
			} else {
				mainScreen.show();
			}
		}
	});
	
	trayIcon.on('balloon-click', ()=>{
		if (mainScreen) mainScreen.show();
	});

	app.on('before-quit', () => {
		destroyTrayIcon();
	});
}