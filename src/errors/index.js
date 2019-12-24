export const getErrors = (err) => {
	if (err.graphQLErrors) {
		if (err.graphQLErrors[0] && err.graphQLErrors[0].message) {
			return err.graphQLErrors[0].message;
		}
	}

	if (err.networkError) return err.networkError.message;

	if (err.message) return err.message;

	return err;
}