import React from 'react';

import path from 'path';

import { Container, Message } from './styles';

export default function SplashScreen() {
	return (
		<Container>
			<img src={path.resolve(__dirname, '..', '..', '..', 'assets', 'images', 'logo-flaker.png')} />
			<Message>carregando...</Message>
		</Container>
	)
}
