/* eslint-disable no-console */
import client from '../apollo/client';
import { getErrors } from '../errors';
import storage from './storage';
import { createTrayIcon } from './trayIcon';
import mainScreenFn from './windows/main';

import { AUTHENTICATE_CLIENT } from '../queries/user';

async function init() {
	// init storage
	storage.init();

	// create an instante of splashscreen
	const mainScreen = await mainScreenFn.create();

	// create app tray icon
	createTrayIcon();

	mainScreen.on('ready-to-show', () => {
		client.mutate({ mutation: AUTHENTICATE_CLIENT })
			.then(() => {
				// user logged in => send user to files
				mainScreen.webContents.send('redirectTo', 'files');
			})
			.catch((err)=>{
				// eslint-disable-next-line no-undef
				if (isDevMode) console.log(getErrors(err));

				// no user logged in => send user to login
				mainScreen.webContents.send('redirectTo', 'login');
			});
	})
}

export default init;