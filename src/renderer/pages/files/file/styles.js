import { Paper } from '@material-ui/core';

import styled from 'styled-components';

export const Container = styled(Paper)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	min-height: 80px;
	
	margin: 5px;
	padding: 8px 15px;
	
`;

export const LeftContainer = styled.div`
	width: 40px;
`;
export const CenterContainer = styled.div`
	display: flexbox;
	flex: 1;
	flex-direction: column;
`;
export const RightContainer = styled.div`
	flex-direction:row;
	align-items: center;
	justify-content: flex-end;
`;
export const Title = styled.div`
	font-size:14px;
	color:#4d4d4d;
`;
export const CreateDate = styled.div`
	font-size:13px;
	color:#808080;
`;

export const SizeContainer = styled.div`
	position:relative;
	height:6px;
	background-color:#ccc;
`;

export const Size = styled.div`
	position:absolute;
	top:0;
	left:0;
	bottom:0;
	width:${({ size, limit })=>{
		return (size * 100) / limit;
	}}%;
	background-color:#a00;
`;
export const SizeText = styled.div`
	position:absolute;
	border-radius:3px;
	color:#fff;
	background-color:#a00;
	padding:7px 10px;
	box-shadow:2px 2px 2px rgba(0,0,0,0.3);
	
	left:${({ size, limit })=>{
		const left = ((size * 100) / limit) - 48;
		if (left < 0) return 0;
		if (left > 253) return 253;
		return left;
	}}px;

	top:200px;
	bottom:13px;
	opacity:0;
	-webkit-transition:opacity 0.2s;
	
	${SizeContainer}:hover & {
		
		top:auto;
		opacity:1;
	}
	::before {
		content:'';
		position:absolute;
		top:100%;
		left:50%;
		margin-left:-4px;
		border-left:4px solid transparent;
		border-right:4px solid transparent;
		border-top:4px solid #a00;
	}
`;