import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import ReactLoading from 'react-loading';

import { GetApp, InsertDriveFile } from '@material-ui/icons';


import { Container, Title, CreateDate, LeftContainer, CenterContainer, RightContainer } from './styles';

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

function renderIcon(file) {
	switch (file.status) {
	case 'loading':
	case 'standBy':
		return <ReactLoading className='loading' type='spin' color='#5b5b6b' />;
	case 'download':
		return <GetApp />;
	case 'uploading':
		return <CircularProgressbar strokeWidth={14} value={file.progress} styles={progressStyles} />;
	default: return false;
	}
}

export default function File({ file }) {
	return (
		<Container>
			<LeftContainer>
				<InsertDriveFile style={{ color: '#cccccc' }} />
			</LeftContainer>
			<CenterContainer>
				<Title>{file.originalName || file.name}</Title>
				<CreateDate>{file.createdAt}</CreateDate>
			</CenterContainer>
			<RightContainer>
				{renderIcon(file)}
			</RightContainer>
		</Container>
	);
}