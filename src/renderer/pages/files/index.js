/* eslint-disable no-nested-ternary */
import React from 'react';
import ReactLoading from 'react-loading';

import { useQuery } from '@apollo/react-hooks';
import { FormHelperText } from '@material-ui/core';

import File from './file';
import { Container, FilesContainer, Footer, StatusContainer, StatusText, StatusIcon, UserInfo } from './styles';

import { GET_USER_FILES } from '../../../apollo/queries/files';
import { GET_LOGGED_IN_USER_ID, GET_USER } from '../../../apollo/queries/user';

const files = [
	{
		id: 1,
		name: 'file_156562_asdwdasd546549874wd4s548d.zip',
		originalName: 'file_156562.zip',
		size: 177000,
		url: 'http://localdeacesso/teste',
		bucket: 'teste',
		createdAt: '23/05/2019 15:33',
	},
	{
		id: 2,
		name: 'file_156562_asdwdasd546549874wd4s548d.zip',
		originalName: 'file_156562.zip',
		size: 171697,
		url: 'http://localdeacesso/teste',
		bucket: 'teste',
		createdAt: '23/05/2019 15:33',
	},
	{
		id: 3,
		name: 'file_156562_asdwdasd546549874wd4s548d.zip',
		originalName: 'file_156562.zip',
		size: 1725000,
		url: 'http://localdeacesso/teste',
		bucket: 'teste',
		createdAt: '23/05/2019 15:33',
	},
	{
		id: 4,
		name: 'file_156562_asdwdasd546549874wd4s548d.zip',
		originalName: 'file_156562.zip',
		size: 177890,
		url: 'http://localdeacesso/teste',
		bucket: 'teste',
		createdAt: '23/05/2019 15:33',
	},
]
const loadingFiles = false;


export default function Files() {
	const { data: { loggedUserInId } = {} } = useQuery(GET_LOGGED_IN_USER_ID);
	const { data: { user = null } = {} } = useQuery(GET_USER, { variables: { id: loggedUserInId } });
	// const { data: { user: { files = [] } = {} } = {}, loading: loadingFiles } = useQuery(GET_USER_FILES, { variables: { id: loggedUserInId } });

	return (
		<Container>
			<FilesContainer>
				{loadingFiles
					? (
						<div style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
							<ReactLoading className='loading' type='bubbles' color='#323246' height={50} />
						</div>
					)
					: files.length
						? files.map((file, index) => <File key={index} file={file} />)
						: <FormHelperText>Não há nenhum arquivo salvo</FormHelperText>}
			</FilesContainer>
			{/* <this.sizeLimit size={size} limit={limit} /> */}
			<Footer>
				<StatusContainer>
					<StatusText>Monitorando</StatusText>
					<StatusIcon stat='watching' />
				</StatusContainer>
				
				{user != null && (
					<UserInfo>
						{`${user.name} (${user.email})`}
					</UserInfo>
				)}
			</Footer>
		</Container>
	)
}
