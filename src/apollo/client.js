import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import authLink from './authLink';
import initialCache from './initialCache';

const host = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000/graphql';
const httpLink = createHttpLink({ uri: host, fetch });

const cache = new InMemoryCache({});
cache.writeData({ data: initialCache });

const client = new ApolloClient({
	cache,
	link: from([authLink, httpLink]),
	/* defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network'
		}
	} */
});

client.onResetStore(()=>cache.writeData({ data: initialCache }));
client.onClearStore(()=>cache.writeData({ data: initialCache }));

// set global apollo client for renderer
global.ApolloClient = client;

export default client;