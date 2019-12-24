import gql from 'graphql-tag';

export const GET_USER = gql`
	query ($id: ID!) {
		user (id: $id) {
			id
			firstName
		}
	}
`;

export const AUTHENTICATE = gql`
	query ($token: String!) {
		authenticate (token: $token) {
			id
			firstName
			email
			company {
				id
				name
			}
		}
	}
`;