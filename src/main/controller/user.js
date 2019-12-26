import client from '../../apollo/client';
import storage from '../storage';

import { GET_USER } from '../../apollo/queries/user';

async function authenticate() {
	// get user token from local storage
	const userToken = storage.get('userToken');

	if (userToken) {
		// look for user
		const { data: { authenticate: user = null } = {} } = await client.query({ query: GET_USER, variables: { token: userToken } });

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

export default {
	authenticate,
	logUserIn,
	logUserOut,
}