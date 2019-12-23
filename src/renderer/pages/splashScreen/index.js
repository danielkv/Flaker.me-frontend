import React, { useState, useEffect } from 'react';

import { ipcRenderer } from 'electron';
import path from 'path';

import WindowContainer from '../../components/WindowContainer';

import { Container, Message } from './styles';

export default function SplashScreen() {
	const [message, setMessage] = useState('Carregando...');

	useEffect(() => {
		ipcRenderer.on('message', setMessage);
	}, [])

	return (
		<WindowContainer>
			<Container>
				<img src={path.resolve(__dirname, '..', '..', '..', 'assets', 'images', 'logo-flaker.png')} />
				<Message>{message}</Message>
			</Container>
		</WindowContainer>
	)
}
