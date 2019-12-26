import React from 'react'
import { Switch, Route, HashRouter } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import { Settings as SettingsIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons';
import path from 'path';

import WindowContainer from '../components/WindowContainer';

import CreateAccount from './createAccount';
import Files from './files';
import ForgotPassword from './forgotPassword';
import Login from './login';
import SplashScreen from './splashScreen';
import { Header, HeaderRightInfo } from './styles';

export default function Main() {
	return (
		<WindowContainer>
			<HashRouter hashType='slash'>

				<Header disableDrag>
					<img src={path.resolve(__dirname, '..', '..', 'assets', 'images', 'logo-flaker-mini-monocolor.png')} />
							
					<HeaderRightInfo>
						<IconButton><SettingsIcon fontSize='small' style={{ color: '#848490' }} /></IconButton>
						<IconButton><KeyboardArrowDownIcon fontSize='small' style={{ color: '#ffffff' }} /></IconButton>
					</HeaderRightInfo>
				</Header>
				<Switch>
					<Route exact path='/' component={SplashScreen} />

					<Route path='/login' component={Login} />
					<Route path='/createAccount' component={CreateAccount} />
					<Route path='/forgotPassword' component={ForgotPassword} />

					<Route path='/files' component={Files} />
				</Switch>
			</HashRouter>
		</WindowContainer>
	)
}