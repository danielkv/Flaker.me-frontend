/* eslint-disable import/no-cycle */
import storage from '../main/storage';
import { getTrayIcon, createContextMenu } from '../main/trayIcon';
import mainScreenFn from '../main/windows/main';

import { GET_USER_FILES, ADD_ONLINE_FILES, CHECK_DELETED_FILES, UPDATE_FILE, STOP_ALL_FILE_STREAMING } from '../queries/files';
import { AUTHENTICATE, LOG_USER_IN, GET_LOGGED_IN_USER_ID, INIT_USER } from '../queries/user';

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
			if (user) await client.mutate({ mutation: LOG_USER_IN, variables: { user, token: userToken } });
		},

		logUserIn: async (_, { user, token }, { cache, client }) => {
			// log user in cache
			cache.writeData({ data: { loggedUserId: user.id, userToken: token, company: user.company.id } });
			storage.set('userToken', token);

			// load initial user data from server
			await client.mutate({ mutation: INIT_USER });

			// recreate tray icon context menu WITH logout and settings
			const trayIcon = getTrayIcon();
			trayIcon.setContextMenu(createContextMenu('loggedIn'));
		},
		
		logUserOut: async (_, __, { client }) => {
			const mainScreen = mainScreenFn.get();

			// send user to login page
			mainScreen.webContents.send('redirectTo', 'login');
			if (!mainScreen.isVisible()) mainScreen.show();

			// stop all file uploading
			await client.mutate({ mutation: STOP_ALL_FILE_STREAMING })

			// clean all cache and reset data
			client.resetStore();
			storage.remove('userToken');

			// recreate tray icon context menu with NO logout and settings
			const trayIcon = getTrayIcon();
			trayIcon.setContextMenu(createContextMenu('loggedOut'));
		},

		initUser: async (_, __, { client }) => {
			// load online files
			const { loggedUserId } = client.readQuery({ query: GET_LOGGED_IN_USER_ID });
			// eslint-disable-next-line max-len
			const { data: { user: { files = [] } } } = await client.query({ query: GET_USER_FILES, variables: { id: loggedUserId }, fetchPolicy: 'no-cache' });

			await client.mutate({ mutation: ADD_ONLINE_FILES, variables: { data: files } });

			// check for deleted files
			await client.mutate({ mutation: CHECK_DELETED_FILES, fetchPolicy: 'no-cache' })
				.then(({ data: { checkDeletedFiles: deletedFiles } }) => {
					deletedFiles.forEach(file => {
						client.mutate({
							mutation: UPDATE_FILE,
							variables: {
								id: file.id,
								data: { helperText: 'Esse arquivo foi excluido da nuvem', status: 'deleted' }
							}
						})
					})
				})
		}
	}
}