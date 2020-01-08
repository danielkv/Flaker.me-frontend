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

export const ADD_FILES = gql`
	mutation AddFiles ($data: [File!]!) {
		addFiles(data: $data) @client
	}
`;

export const ADD_ONLINE_FILES = gql`
	mutation AddOnlineFiles ($data: [File!]!) {
		addOnlineFiles(data: $data) @client
	}
`;

export const ADD_LOCAL_FILE = gql`
	mutation AddLocalFile ($path: String!) {
		addLocalFile(path: $path) @client
	}
`;

export const UPDATE_FILE = gql`
	mutation UpdateFile ($id: ID!, $data: File!, $update: Boolean) {
		updateFile(id: $id, data: $data, update: $update) @client
	}
`;

export const UPDATE_FILE_PROGRESS = gql`
	mutation UpdateFileProgress ($id: ID!, $bytesCount: Int!) {
		updateFileProgress(id: $id, bytesCount: $bytesCount) @client
	}
`;

export const FILE_FRAGMENT = gql`
	fragment FragFile on File {
		id
		originalName
		createdAt
		bytesCount
		size
		status
		
		#online
		name
		url
		bucket
		
		#local
		path
		progress

		#helper
		helperText
	}
`;

export const FINISH_FILE_UPLOAD = gql`
	mutation ($file: File!) {
		finishFileUpload(file: $file) @client
	}
`;

export const COMPANY_LIMITS = gql`
	query($id: ID!) {
		company(id: $id) {
			id
			limit
			size
		}
	}
`;

export const GET_FILES = gql`
	query {
		files @client {
			...FragFile
		}
	}

	${FILE_FRAGMENT}
`;

export const UPLOAD_FILE = gql`
	mutation ($file: File!) {
		uploadFile(file: $file) @client
	}
`;

export const REQUEST_UPLOAD_URI = gql`
	query ($originalName: String!, $size: Long!) {
		requestUploadUri(originalName: $originalName, size: $size)
	}
`;