import client from '../apollo/client';
import splashScreenFunctions from './windows/splashScreen';

import { GET_USER } from '../apollo/queries/user';

function init() {
	// create an instante of splashscreen
	const splashScreen = splashScreenFunctions.create();

	client.query({ query: GET_USER })
		.then(()=>{
			console.log('foi')
		})
		.catch((err)=>{
			console.error(err);
		})
	
	
}

export default init;