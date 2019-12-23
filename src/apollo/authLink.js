import { ApolloLink } from 'apollo-link';

const authLink = new ApolloLink((operation, forward)=> {
	/* const { isUserLoggedIn } = cache.readQuery({ query: IS_USER_LOGGED_IN });
	const set_headers = {};

	const { userToken } = cache.readQuery({ query: GET_USER_TOKEN });
	if (userToken) set_headers.authorization = `Bearer ${userToken}`;

	const { selectedCompany } = cache.readQuery({ query: GET_SELECTED_COMPANY });
	if (isUserLoggedIn && selectedCompany) set_headers.company_id = selectedCompany;
	
	const { selectedBranch } = cache.readQuery({ query: GET_SELECTED_BRANCH });
	if (isUserLoggedIn && selectedBranch) set_headers.branch_id = selectedBranch;
		
	operation.setContext(({ headers }) => {
		return {
			headers: { ...headers, ...set_headers }
		}
	}); */
	
	return forward(operation);
})

export default authLink;