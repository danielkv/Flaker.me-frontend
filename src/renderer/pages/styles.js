import styled from 'styled-components';

export const ContentContainer = styled.div`
	flex: 1;
`;

export const Header = styled.div`
	height:38px;
	align-items:center;
	padding:0 10px;
	justify-content:space-between;
	background-color:#323246;
	border-radius:3px 3px 0 0;
	position:relative;

	-webkit-user-select: none;
	-webkit-app-region: ${props => (props.disableDrag ? 'no-drag' : 'drag')};
`;

export const Footer = styled.div`
	height:40px;
	background-color:#e6e6e6;
	flex-direction:row;
	align-items:center;
	justify-content:space-between;
	
	padding : 0 15px;
`;

export const HeaderRightInfo = styled.div`
	color:#9898a2;
	font-size:12px;
`;