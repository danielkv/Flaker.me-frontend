import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import ReactLoading from 'react-loading';

import { useMutation } from '@apollo/react-hooks';
import { IconButton } from '@material-ui/core';
import { GetApp, InsertDriveFile, Error } from '@material-ui/icons';
import { isEqual } from 'lodash';

import { Container, Title, CreateDate, LeftContainer, CenterContainer, RightContainer } from './styles';

import { UPLOAD_FILE } from '../../../../queries/files';

const progressStyles = ({
	root: {
		display: 'block',
		width: 20,
		height: 20
	},
	path: {
		stroke: '#5b5b6b',
		strokeLinecap: 'round',
		transition: 'stroke-dashoffset 0.5s ease 0s',
	},
	trail: {
		stroke: '#d6d6d6',
	},
});


function File({ file }) {
	// MUTATIONS
	const [reUploadFile] = useMutation(UPLOAD_FILE, { variables: { file } })

	// FUNCTIONS
	function renderIcon(fileInfo) {
		switch (fileInfo.status) {
		case 'loading':
			return <ReactLoading className='loading' type='spin' color='#5b5b6b' />;
		case 'download':
			return <GetApp />;
		case 'error':
			return <IconButton onClick={()=>reUploadFile()} size='small'><Error style={{ color: '#ca4238', fontSize: 22 }} /></IconButton>;
		case 'uploading':
			return <CircularProgressbar strokeWidth={14} value={fileInfo.progress} styles={progressStyles} />;
		case 'standBy':
		default: return false;
		}
	}

	return (
		<Container>
			<LeftContainer>
				<InsertDriveFile style={{ color: '#cccccc' }} />
			</LeftContainer>
			<CenterContainer>
				<Title>{file.originalName || file.name}</Title>
				<CreateDate>{file.helperText || file.createdAt}</CreateDate>
			</CenterContainer>
			<RightContainer>
				{renderIcon(file)}
			</RightContainer>
		</Container>
	);
}

export default React.memo(File, (prev, next) => {
	return isEqual(prev, next);
})