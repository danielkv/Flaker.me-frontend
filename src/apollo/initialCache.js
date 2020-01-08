const initialCache = {
	loggedUserId: null,
	isUserLoggedIn: false,
	userToken: null,
	company: null,

	isWatching: false, // is monitoring directories
	files: [], // all files: local + online
}

export default initialCache;