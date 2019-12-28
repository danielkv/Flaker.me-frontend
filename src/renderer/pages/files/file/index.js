import React from 'react';

import { InsertDriveFile } from '@material-ui/icons';
// import { CircularProgressbar } from 'react-circular-progressbar';

import { Container, Title, CreateDate, LeftContainer, CenterContainer, RightContainer } from './styles';

/* const progressStyles = {
	root: {
		display: 'block',
		width: 24,
		height: 24
	},
	path: {
		stroke: '#5b5b6b',
		strokeLinecap: 'round',
		transition: 'stroke-dashoffset 0.5s ease 0s',
	},
	trail: {
		stroke: '#d6d6d6',
	},
} */

export default function Files({ file }) {
	return (
		<Container>
			<LeftContainer>
				<InsertDriveFile style={{ color: '#cccccc' }} />
			</LeftContainer>
			<CenterContainer>
				<Title>{file.originalName || file.name}</Title>
				<CreateDate>{file.createdAt}</CreateDate>
			</CenterContainer>
			{/* 	<RightContainer>
				
			</RightContainer> */}
		</Container>
	);
}