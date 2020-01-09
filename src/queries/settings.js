import gql from 'graphql-tag';

export const GET_USER_SETTINGS = gql`
	query ($id: ID!) {
		user (id: $id) {
			id
			settings {
				id
				key
				value
			}
		}
	}
`;

export const SAVE_SETTINGS = gql`
	mutation ($data: [MetaInput!]!) {
		saveSettings(data: $data) {
			id
			key
			value
		}
	}
`;