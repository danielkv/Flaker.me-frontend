import React from 'react';
import { useHistory } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import { Settings as SettingsIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons';
import path from 'path';

import { Header, HeaderRightInfo } from './styles';

export default function HeaderComponent() {
	const history = useHistory();

	return (
		<Header disableDrag>
			<img src={path.resolve(__dirname, '..', '..', '..', 'assets', 'images', 'logo-flaker-mini-monocolor.png')} />
			<HeaderRightInfo>
				<IconButton onClick={()=>history.push('/settings')}><SettingsIcon fontSize='small' style={{ color: '#848490' }} /></IconButton>
				<IconButton><KeyboardArrowDownIcon fontSize='small' style={{ color: '#ffffff' }} /></IconButton>
			</HeaderRightInfo>
		</Header>
	)
}
