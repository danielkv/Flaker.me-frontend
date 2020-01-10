/* eslint-disable no-nested-ternary */
import React, { useEffect, useCallback, useState } from 'react';
import ReactLoading from 'react-loading';

import { useMutation, useQuery, useApolloClient } from '@apollo/react-hooks';
import { FormHelperText } from '@material-ui/core';
import { Block } from '@material-ui/icons';
import { ipcRenderer } from 'electron';

import LoadingBlock from '../../components/LoadingBlock';
import NoWatchFolder from '../../components/NoWatchFolder';

import File from './file';
import CompanyLimits from './size';
import { Container, FilesContainer, Footer, StatusContainer, StatusText, StatusIcon, UserInfo } from './styles';

import { GET_FILES } from '../../../queries/files';
import { GET_USER_SETTINGS } from '../../../queries/settings';
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
	const { data: { user: { settings = null } = {} } = {}, loading: loadingSettings } = useQuery(GET_USER_SETTINGS, { variables: { id: loggedUserId } });
	
	useEffect(() => {
		// start monitoring
		startWatching();
		// get files
		getFiles();

		// setup getFiles listener
		ipcRenderer.on('updateFileList', getFiles);

		return () => {
			// stop monitoring
			stopWatching();

			// remove listener updateFileList
			ipcRenderer.removeAllListeners('updateFileList');
		}
	}, []);

	if (loadingFiles || loadingSettings) return <LoadingBlock />;

	const watch = settings.find((set) => set.key === 'watch');
	const checkWatchFolder = watch && watch.value && (watch.value !== '' && watch.value !== '[]');

	return (
		<Container>
			{checkWatchFolder
				? (
					<FilesContainer>
						{files.length
							? files.map((file, index) => <File key={index} file={file} />)
							: (
								<div style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
									<Block style={{ color: '#ccc', fontSize: 50 }} />
									<FormHelperText>Não há nenhum arquivo salvo</FormHelperText>
								</div>
							)}
					</FilesContainer>
				)
				: <NoWatchFolder />}
			<CompanyLimits />
			<Footer>
				<StatusContainer>
					<StatusIcon color={isWatching ? '#54963d' : '#ffaa00'} />
					<StatusText>{isWatching ? 'Monitorando' : 'Aguardando'}</StatusText>
				</StatusContainer>
				
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