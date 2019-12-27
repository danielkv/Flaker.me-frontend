import React from 'react';
import { HashRouter } from 'react-router-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import { IconButton } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Settings as SettingsIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons';
import electron from 'electron';
import path from 'path';

import WindowContainer from '../components/WindowContainer';

import theme from '../theme';
import Routes from './routes';
import { Header, HeaderRightInfo } from './styles';

const ApolloClient = electron.remote.getGlobal('ApolloClient');

export default function Pages() {
	return (
		<ApolloProvider client={ApolloClient}>
			<ThemeProvider theme={theme}>
				<WindowContainer>
					<HashRouter hashType='slash'>

						<Header disableDrag>
							<img src={path.resolve(__dirname, '..', '..', 'assets', 'images', 'logo-flaker-mini-monocolor.png')} />
							<HeaderRightInfo>
								<IconButton><SettingsIcon fontSize='small' style={{ color: '#848490' }} /></IconButton>
								<IconButton><KeyboardArrowDownIcon fontSize='small' style={{ color: '#ffffff' }} /></IconButton>
							</HeaderRightInfo>
						</Header>

						<Routes />
					</HashRouter>
				</WindowContainer>
			</ThemeProvider>
		</ApolloProvider>
	)
}
