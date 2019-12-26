import storage from './storage';
import mainScreenFn from './windows/main';

async function init() {
	// init storage
	storage.init();

	// create an instante of splashscreen
	await mainScreenFn.create();
}

export default init;