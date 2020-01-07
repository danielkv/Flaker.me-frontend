import { createApolloCache } from '../apollo/cache';
import { createApolloClient } from '../apollo/client';
import storage from './storage';
import mainScreenFn from './windows/main';

import { AUTHENTICATE_CLIENT } from '../queries/user';

async function init() {
	// init storage
	storage.init();

	// create a global instance of apollo cache
	global.apolloCache = createApolloCache();

	// create a main client instance
	const client = createApolloClient(global.apolloCache);

	// create an instante of splashscreen
	const mainScreen = await mainScreenFn.create();

	mainScreen.on('ready-to-show', () => {
		client.mutate({ mutation: AUTHENTICATE_CLIENT })
			.then(()=>{
				// user logged in => send user to files
				mainScreen.webContents.send('redirectTo', 'files');
			})
			.catch(()=>{
				// no user logged in => send user to login
				mainScreen.webContents.send('redirectTo', 'login');
			});
	})
}

export default init;