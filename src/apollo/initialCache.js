const initialCache = {
	loggedUserId: null,
	isUserLoggedIn: false,
	userToken: null,
	company: null,

	isWatching: false, // is monitoring directories
	tempFiles: [], // files for upload, standby, error uploading
}

export default initialCache;