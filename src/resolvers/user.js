import storage from '../main/storage';

import { AUTHENTICATE, LOG_USER_IN } from '../queries/user';

export default {
	Mutation: {
		authenticateClient: async (_, __, { client }) => {
			// get user token from local storage
			const userToken = storage.get('userToken');
			// if token does not exists throw an error
			if (!userToken) throw new Error('Token não encontrado.');
			
			// look for user
			const { data: { authenticate: user = null } = {} } = await client.mutate({ mutation: AUTHENTICATE, variables: { token: userToken } });
	
			// log local user
			if (user) client.mutate({ mutation: LOG_USER_IN, variables: { user, token: userToken } });
		},

		logUserIn: (_, { user, token }, { cache }) => {
			cache.writeData({ data: { loggedUserId: user.id, userToken: token, company: user.company.id } });
			storage.set('userToken', token);

			return null;
		},
		
		logUserOut: (_, __, { client }) => {
			client.resetStore();
			storage.remove('userToken');
			
			return null;
		}
	}
}