import { ipcMain } from 'electron';

import client from '../../apollo/client';
import storage from '../storage';

import { AUTHENTICATE } from '../../apollo/queries/user';

async function authenticate() {
	// get user token from local storage
	const userToken = storage.get('userToken');

	if (userToken) {
		console.log(userToken);
		// look for user
		const { data: { authenticate: user = null } = {} } = await client.mutate({ mutation: AUTHENTICATE, variables: { token: userToken } });

		if (user) logUserIn(user, userToken);

		return user;
	}

	return false;
}

function logUserIn(user, token) {
	client.writeData({ data: { userLoggedInId: user.id, userToken: token, company: user.company.id } });
	storage.set('userToken', token);
}

function logUserOut() {
	client.resetStore();
	storage.remove('userToken');
}

// events
function initEvents() {
	ipcMain.on('logUserIn', (e, { user, token }) => logUserIn(user, token));
	ipcMain.on('logUserOut', logUserOut);
}

export default {
	authenticate,
	logUserIn,
	logUserOut,
	initEvents,
}