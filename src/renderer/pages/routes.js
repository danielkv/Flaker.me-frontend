import React, { useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom';

import { ipcRenderer } from 'electron';

import CreateAccount from './createAccount';
import Files from './files';
import ForgotPassword from './forgotPassword';
import Login from './login';
import SplashScreen from './splashScreen';
import { ContentContainer } from './styles';

export default function Main() {
	const history = useHistory();
	
	useEffect(() => {
		ipcRenderer.on('redirectTo', (e, to)=>{
			history.push(to);
		})
	}, [])

	return (
		<ContentContainer>
			<Switch>
				<Route exact path='/' component={SplashScreen} />

				<Route path='/login' component={Login} />
				<Route path='/createAccount' component={CreateAccount} />
				<Route path='/forgotPassword' component={ForgotPassword} />

				<Route path='/files' component={Files} />
			</Switch>
		</ContentContainer>
	)
}