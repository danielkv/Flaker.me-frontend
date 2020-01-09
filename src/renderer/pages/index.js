import React from 'react';
import { HashRouter } from 'react-router-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/core/styles';
import electron from 'electron';

import Header from '../components/Header';
import WindowContainer from '../components/WindowContainer';

import theme from '../theme';
import Routes from './routes';

const ApolloClient = electron.remote.getGlobal('ApolloClient');

export default function Pages() {
	return (
		<ApolloProvider client={ApolloClient}>
			<ThemeProvider theme={theme}>
				<WindowContainer>
					<HashRouter hashType='slash'>
						<Header />
						<Routes />
					</HashRouter>
				</WindowContainer>
			</ThemeProvider>
		</ApolloProvider>
	)
}
