import chokidar from 'chokidar';

import { ADD_LOCAL_FILE } from '../queries/files';
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
			const watchSetting = settings.find((s) => s.key === 'watch');

			// if watch folder was't selected
			if (!watchSetting || !watchSetting.value || watchSetting.value === '' || watchSetting.value === '[]') return;
			const watch = JSON.parse(watchSetting.value);

			// start monitoring directories
			watcher = chokidar.watch(watch[0], {
				persistent: true,
				awaitWriteFinish: true,
			});
			
			// fires this event when add file to directory
			watcher.on('add', (path) => {
				client.mutate({ mutation: ADD_LOCAL_FILE, variables: { path } });
			})

			// update cache variables
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