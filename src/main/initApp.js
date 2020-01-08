/* eslint-disable no-console */
import client from '../apollo/client';
import storage from './storage';
import mainScreenFn from './windows/main';

import { GET_USER_FILES, ADD_ONLINE_FILES } from '../queries/files';
import { AUTHENTICATE_CLIENT, GET_LOGGED_IN_USER_ID } from '../queries/user';

async function init() {
	// init storage
	storage.init();

	// create an instante of splashscreen
	const mainScreen = await mainScreenFn.create();

	mainScreen.on('ready-to-show', () => {
		client.mutate({ mutation: AUTHENTICATE_CLIENT })
			.then(async ()=>{
				// load online files
				const { loggedUserId } = client.readQuery({ query: GET_LOGGED_IN_USER_ID });
				// eslint-disable-next-line max-len
				const { data: { user: { files = [] } } } = await client.query({ query: GET_USER_FILES, variables: { id: loggedUserId }, fetchPolicy: 'no-cache' });

				await client.mutate({ mutation: ADD_ONLINE_FILES, variables: { data: files } });

				// user logged in => send user to files
				mainScreen.webContents.send('redirectTo', 'files');
			})
			.catch((err)=>{
				// eslint-disable-next-line no-undef
				if (isDevMode) console.log(err);

				// no user logged in => send user to login
				mainScreen.webContents.send('redirectTo', 'login');
			});
	})
}

export default init;