import React from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { IconButton } from '@material-ui/core';
import { Settings as SettingsIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons';
import { remote } from 'electron';
import path from 'path';

import { Header, HeaderRightInfo } from './styles';

import { GET_LOGGED_IN_USER_ID } from '../../../queries/user';

export default function HeaderComponent() {
	const history = useHistory();

	const { data: { loggedUserId } } = useQuery(GET_LOGGED_IN_USER_ID);

	return (
		<Header disableDrag>
			<img src={path.resolve(__dirname, '..', '..', '..', 'assets', 'images', 'logo-flaker-mini-monocolor.png')} />
			<HeaderRightInfo>
				{!!loggedUserId && (
					<IconButton onClick={()=>history.push('/settings')}>
						<SettingsIcon fontSize='small' style={{ color: '#848490' }} />
					</IconButton>
				)}
				<IconButton title='Minimizar' alt='Minimizar' onClick={()=>remote.getCurrentWindow().hide()}>
					<KeyboardArrowDownIcon fontSize='small' style={{ color: '#ffffff' }} />
				</IconButton>
			</HeaderRightInfo>
		</Header>
	)
}
