import gql from 'graphql-tag';

export const IS_WATCHING = gql`
	query {
		isWatching @client
	}
`;

export const START_WATCHING = gql`
	mutation {
		startWatching @client
	}
`;

export const STOP_WATCHING = gql`
	mutation {
		stopWatching @client
	}
`;