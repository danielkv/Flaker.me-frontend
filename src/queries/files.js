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
export const ADD_TEMP_FILE = gql`
	mutation ($path: String!) {
		addTempFile(path: $path) @client
	}
`;

export const GET_TEMP_FILES = gql`
	query {
		tempFiles @client {
			id
			originalName
			path
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