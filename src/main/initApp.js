import User from './controller/user';
import storage from './store';
import splashScreenFn from './windows/splashScreen';

async function init() {
	// init storage
	storage.init();

	// create an instante of splashscreen
	const splashScreen = await splashScreenFn.create();

	// fire when scree is ready
	splashScreen.on('ready-to-show', async () => {
		// set the message on splashboard
		splashScreenFn.showMessage('Autenticando usuário');

		// authenticates user and load settings
		User.authenticate()
			.then(() => {
				// create files settings
				// create and open files window
			})
			.catch(() => {
				// create and open login window
			})
	})
}

export default init;