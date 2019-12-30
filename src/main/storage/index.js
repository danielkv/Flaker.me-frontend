import electron from 'electron';
import fs from 'fs';
import path from 'path';

// Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
// app.getPath('userData') will return a string of the user's app data directory path.
// eslint-disable-next-line no-undef
let userDataPath = null;
let PATH = null;


let store;

function init() {
	userDataPath = global.isDevMode ? path.resolve(__dirname, '..', '..', '..') : (electron.app || electron.remote.app).getPath('userData');
	PATH = path.join(userDataPath, 'settings.json');

	try {
		const fileData = fs.readFileSync(PATH);
		store = JSON.parse(fileData);
	} catch (err) {
		store = {};
	}
}
	
function remove(key) {
	delete store[key];

	fs.writeFileSync(PATH, JSON.stringify(store));
}

// This will just return the property on the `data` object
function get(key) {
	return store[key];
}
	
// ...and this will set it
function set(key, val) {
	store[key] = val;
	// Wait, I thought using the node.js' synchronous APIs was bad form?
	// We're not writing a server so there's not nearly the same IO demand on the process
	// Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
	// we might lose that data. Note that in a real app, we would try/catch this.
	fs.writeFileSync(PATH, JSON.stringify(store));
}

// expose the class
export default {
	init,
	set,
	get,
	remove,
};