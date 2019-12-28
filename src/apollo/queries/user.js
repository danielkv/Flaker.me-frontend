import gql from 'graphql-tag';

export const GET_LOGGED_IN_USER_ID = gql`
	query {
		loggedUserId @client
	}
`;

export const GET_USER = gql`
	query ($id: ID!) {
		user (id: $id) {
			id
			firstName
		}
	}
`;

export const LOGIN = gql`
	mutation ($email: String!, $password: String!) {
		login (email: $email, password: $password) {
			user {
				id
				firstName
				email
				company {
					id
					name
				}
			}
			token
		}
	}
`;

export const AUTHENTICATE = gql`
	mutation ($token: String!) {
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