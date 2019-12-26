import User from './controller/user';
import storage from './storage';
import mainScreenFn from './windows/main';

async function init() {
	// init storage
	storage.init();

	// create an instante of splashscreen
	const mainScreen = await mainScreenFn.create();

	mainScreen.on('ready-to-show', ()=>{
		User.authenticate()
			.then(()=>{
				mainScreen.webContents.send('redirectTo', 'login');
			})
			.catch(()=>{
				mainScreen.webContents.send('redirectTo', 'login');

			});
	})
}

export default init;