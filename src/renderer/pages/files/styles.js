import styled from 'styled-components';

export const Container = styled.div`
	flex: 1;
	background-color: #f1f1f1;
	flex-direction:column;
`;

export const FilesContainer = styled.div`
	flex:1;
	flex-direction:column;
	justify-content:flex-start;
	align-items:stretch;
`;

export const Footer = styled.div`
	height:40px;
	background-color:#e6e6e6;
	flex-direction:row;
	align-items:center;
	justify-content:space-between;
	
	padding : 0 15px;
`;

export const StatusContainer = styled.div`
	flex-direction:row;
	align-items:center;
`;

export const UserInfo = styled.div`
		color:#888;
	`;

export const StatusText = styled.div`
		font-size:13px;
		color:#333;
	`;

export const StatusIcon = styled.div`
	width: 8px;
	height: 8px;
	margin: 10px;
	border-radius: 5px;
	background-color: ${({ stat }) => {
		if (stat === 'watching') return '#54963d';
		if (stat === 'uploading') return '#e6b400';
		if (stat === 'error') return '#c1272d';

		return '#333';
	}};
`;