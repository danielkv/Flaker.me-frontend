import gql from 'graphql-tag';

export const GET_USER = gql`
	query {
		user (id: 1) {
			id
			first_name
		}
	}
`;