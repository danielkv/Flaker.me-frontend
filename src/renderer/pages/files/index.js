/* eslint-disable no-nested-ternary */
import React, { useEffect, useCallback, useState } from 'react';
import ReactLoading from 'react-loading';

import { useMutation, useQuery, useApolloClient } from '@apollo/react-hooks';
import { FormHelperText } from '@material-ui/core';
import { ipcRenderer } from 'electron';

import File from './file';
import CompanyLimits from './size';
import { Container, FilesContainer, Footer, StatusContainer, StatusText, StatusIcon, UserInfo } from './styles';

import { GET_FILES } from '../../../queries/files';
import { GET_LOGGED_IN_USER_ID, GET_USER } from '../../../queries/user';
import { IS_WATCHING, START_WATCHING, STOP_WATCHING } from '../../../queries/watcher';

export default function Files() {
	// COMMOM
	const [files, setFiles] = useState([]);
	const [loadingFiles, setLoadingFiles] = useState(true);
	const client = useApolloClient();
	const getFiles = useCallback(() => {
		client.query({ query: GET_FILES })
			.then(({ data: { files: tFiles } }) => {
				setFiles(tFiles);
				if (loadingFiles) setLoadingFiles(false);
			})
	}, [setFiles, setLoadingFiles, loadingFiles]);

	// MUTATIONS
	const [startWatching] = useMutation(START_WATCHING);
	const [stopWatching] = useMutation(STOP_WATCHING);
	
	// QUERIES
	const { data: { loggedUserId } } = useQuery(GET_LOGGED_IN_USER_ID);
	const { data: { user = null } = {}, loading: loadingUser } = useQuery(GET_USER, { variables: { id: loggedUserId } });
	const { data: { isWatching = false } = {} } = useQuery(IS_WATCHING);
	
	useEffect(() => {
		// start monitoring
		startWatching();
		// get files
		getFiles();

		// setup updateFileList event
		ipcRenderer.on('updateFileList', getFiles);

		return () => {
			// stop monitoring
			stopWatching();
		}
	}, []);

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
			<CompanyLimits />
			<Footer>
				{isWatching && (
					<StatusContainer>
						<StatusIcon />
						<StatusText>Monitorando</StatusText>
					</StatusContainer>
				)}
				
				{loadingUser
					? <ReactLoading type='spin' className='loading' color='#cccccc' />
					: (user
						&& (
							<UserInfo>
								{`${user.firstName} (${user.email})`}
							</UserInfo>
						)
					)}
			</Footer>
		</Container>
	)
}