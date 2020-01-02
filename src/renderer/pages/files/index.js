/* eslint-disable no-nested-ternary */
import React, { useEffect, useCallback, useState } from 'react';
import ReactLoading from 'react-loading';

import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { FormHelperText } from '@material-ui/core';
import { ipcRenderer } from 'electron';

import File from './file';
import { Container, FilesContainer, Footer, StatusContainer, StatusText, StatusIcon, UserInfo } from './styles';

import { GET_USER_FILES, GET_TEMP_FILES } from '../../../queries/files';
import { GET_LOGGED_IN_USER_ID, GET_USER } from '../../../queries/user';
import { IS_WATCHING, START_WATCHING, STOP_WATCHING } from '../../../queries/watcher';

const sortFiles = (a, b) => {
	if (a.createdAt > b.createdAt) return -1;
	if (b.createdAt > a.createdAt) return 1;
	return 0;
}


export default function Files() {
	// COMMOM
	const client = useApolloClient();
	const [tempFiles, setTempFiles] = useState([]);
	const updateTempFiles = useCallback(async () => {
		const { data: { tempFiles: tempFilesResult = [] } } = await client.query({ query: GET_TEMP_FILES });
		setTempFiles(tempFilesResult);
	})

	// MUTATIONS
	const [startWatching] = useMutation(START_WATCHING);
	const [stopWatching] = useMutation(STOP_WATCHING);

	// QUERIES
	const { data: { loggedUserId } = {} } = useQuery(GET_LOGGED_IN_USER_ID);
	const { data: { user = null } = {} } = useQuery(GET_USER, { variables: { id: loggedUserId } });
	const { data: { user: { files = [] } = {} } = {}, loading: loadingFiles } = useQuery(GET_USER_FILES, { variables: { id: loggedUserId } });

	useEffect(() => {
		// start monitoring
		startWatching();

		// setup updateTempFiles event
		ipcRenderer.on('updateTempFiles', updateTempFiles);

		return () => {
			// stop monitoring
			stopWatching();
		}
	}, []);

	// const { data: { isWatching } = {} } = useQuery(IS_WATCHING);

	const filesList = [...tempFiles, ...files];
	filesList.sort(sortFiles);

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
					<button onClick={()=>{ stopWatching(); startWatching() }}>Monitorar</button>
					<StatusText>Monitorando</StatusText>
					<StatusIcon stat='watching' />
				</StatusContainer>
				
				{!!user && (
					<UserInfo>
						{`${user.name} (${user.email})`}
					</UserInfo>
				)}
			</Footer>
		</Container>
	)
}