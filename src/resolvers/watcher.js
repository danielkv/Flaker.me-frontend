import chokidar from 'chokidar';

import { ADD_TEMP_FILE } from '../queries/files';
import { GET_USER_SETTINGS } from '../queries/settings';
import { GET_LOGGED_IN_USER_ID } from '../queries/user';


let watcher;

export default {
	Mutation: {
		startWatching: async (_, __, { client, cache }) => {
			// get directories for monitoring
			const { loggedUserId } = client.readQuery({ query: GET_LOGGED_IN_USER_ID });
			const { data: { user: { settings } } } = await client.query({ query: GET_USER_SETTINGS, variables: { id: loggedUserId } });

			// find watch directories in settings array
			const watch = JSON.parse(settings.find((s) => s.key === 'watch').value);

			// start monitoring directories
			watcher = await chokidar.watch(watch[0], {
				persistent: true,
				awaitWriteFinish: true,
			});

			// fires this event when add file to directory
			watcher.on('add', (path) => {
				client.mutate({ mutation: ADD_TEMP_FILE, variables: { path } });
			})

			// update cache variable
			cache.writeData({ data: { isWatching: true } });
		},
		stopWatching: (_, __, { cache }) => {
			// stop all monitoring directories
			watcher.close();

			// update cache variable
			cache.writeData({ data: { isWatching: false } });
		}
	},
}