import { InMemoryCache } from 'apollo-cache-inmemory';

export const initialCache = {
	loggedUserId: null,
	isUserLoggedIn: false,
	userToken: null,
	company: null,

	isWatching: false, // is monitoring directories
	tempFiles: [], // files for upload, standby, error uploading
}

export function createApolloCache() {
	const cache = new InMemoryCache({});
	cache.writeData({ data: initialCache });

	return cache;
}