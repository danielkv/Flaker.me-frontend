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