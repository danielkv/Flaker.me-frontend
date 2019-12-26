import React from 'react';
import ReactLoading from 'react-loading';

import path from 'path';

import { Container, Spinner } from './styles';

export default function SplashScreen() {
	return (
		<Container>
			<img src={path.resolve(__dirname, '..', '..', '..', 'assets', 'images', 'logo-flaker.png')} />
			<Spinner><ReactLoading className='loading' type='spin' color='#323246' height={20} /></Spinner>
		</Container>
	)
}
