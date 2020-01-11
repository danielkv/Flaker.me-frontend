import { ApolloLink } from 'apollo-link';

import { GET_USER_TOKEN, GET_COMPANY } from '../queries/user';

export const createAuthLink = (cache) => new ApolloLink((operation, forward)=> {
	const set_headers = getHeaders(cache);
		
	operation.setContext(({ headers = {} }) => {
		return {
			headers: Object.assign(headers, set_headers)
		}
	});
	
	return forward(operation);
})

export function getHeaders(cache) {
	const headers = {};

	// get logged in user's token
	const { userToken = null } = cache.readQuery({ query: GET_USER_TOKEN });
	if (userToken) headers.authorization = `Bearer ${userToken}`;

	// get logged in user company's id
	const { company = null } = cache.readQuery({ query: GET_COMPANY });
	if (userToken && company) headers.company_id = company;

	return headers;
}