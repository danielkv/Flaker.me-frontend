import client from '../apollo/client';
import User from './controller/user';
import storage from './storage';
import mainScreenFn from './windows/main';

import { START_WATCHING } from '../apollo/queries/watcher';

async function init() {
	// init storage
	storage.init();

	// create an instante of splashscreen
	const mainScreen = await mainScreenFn.create();

	mainScreen.on('ready-to-show', () => {
		User.initEvents();
		
		User.authenticate()
			.then(()=>{
				// user logged in => send user to files
				mainScreen.webContents.send('redirectTo', 'files');

				// start monitoring
				client.mutate({ mutation: START_WATCHING });
			})
			.catch(()=>{
				// no user logged in => send user to login
				mainScreen.webContents.send('redirectTo', 'login');
			});
	})
}

export default init;