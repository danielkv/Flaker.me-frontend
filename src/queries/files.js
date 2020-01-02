import gql from 'graphql-tag';

export const GET_USER_FILES = gql`
	query ($id: ID!) {
		user (id: $id) {
			id
			files {
				id
				name
				originalName
				size
				url
				bucket
				createdAt
			}
		}
	}
`;

export const CREATE_FILE = gql`
	mutation CreateFile ($data: FileInput!) {
		createFile(data: $data) {
			id
			name
			originalName
			size
			url
			bucket
			createdAt
		}
	}
`;

export const ADD_TEMP_FILE = gql`
	mutation AddTempFile ($path: String!) {
		addTempFile(path: $path) @client
	}
`;

export const UPDATE_FILE_PROGRESS = gql`
	mutation UpdateFileProgress ($id: ID!, $bytesCount: Int!) {
		updateFileProgress(id: $id, bytesCount: $bytesCount) @client
	}
`;

/* export const GET_TEMP_FILE = gql`
	query ($id: ID!) {
		tempFiles(id: $id) @client {
			id
			path
			originalName
			progress
			bytesCount
			size
			createdAt
			status
		}
	}
`; */

export const TEMP_FILE_FRAGMENT = gql`
	fragment GetTempfile on TempFile {
		id
		path
		originalName
		progress
		createdAt
		bytesCount
		size
		status
	}
`;

export const FINISH_FILE_UPLOAD = gql`
	mutation ($file: TempFile!) {
		finishFileUpload(file: $file) @client
	}
`;

export const GET_TEMP_FILES = gql`
	query {
		tempFiles @client {
			id
			path
			originalName
			createdAt
			progress
			bytesCount
			size
			status
		}
	}
`;

export const UPLOAD_FILE = gql`
	mutation ($file: TempFile!) {
		uploadFile(file: $file) @client
	}
`;

export const REQUEST_UPLOAD_URI = gql`
	query ($originalName: String!) {
		requestUploadUri(originalName: $originalName)
	}
`;