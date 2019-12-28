/* eslint-disable no-nested-ternary */
import React from 'react';
import ReactLoading from 'react-loading';

import { useQuery } from '@apollo/react-hooks';
import { FormHelperText } from '@material-ui/core';

import File from './file';
import { Container, FilesContainer, Footer, StatusContainer, StatusText, StatusIcon, UserInfo } from './styles';

import { GET_USER_FILES, GET_TEMP_FILES } from '../../../apollo/queries/files';
import { GET_LOGGED_IN_USER_ID, GET_USER } from '../../../apollo/queries/user';
import { IS_WATCHING } from '../../../apollo/queries/watcher';


export default function Files() {
	const { data: { loggedUserId } = {} } = useQuery(GET_LOGGED_IN_USER_ID);
	const { data: { user = null } = {} } = useQuery(GET_USER, { variables: { id: loggedUserId } });
	const { data: { user: { files = [] } = {} } = {}, loading: loadingFiles } = useQuery(GET_USER_FILES, { variables: { id: loggedUserId } });
	const { data: { tempFiles = [] } } = useQuery(GET_TEMP_FILES);

	const { data: { isWatching } = {} } = useQuery(IS_WATCHING);

	const filesList = [...tempFiles, ...files];

	return (
		<Container>
			<FilesContainer>
				{loadingFiles
					? (
						<div style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
							<ReactLoading className='loading' type='bubbles' color='#323246' height={50} />
						</div>
					)
					: filesList.length
						? filesList.map((file, index) => <File key={index} file={file} />)
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
