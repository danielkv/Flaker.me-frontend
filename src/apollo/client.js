/* eslint-disable import/no-cycle */
import { HttpLink } from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { concat } from 'apollo-link';
// import { createHttpLink } from 'apollo-link-http';
import { merge } from 'lodash';
import fetch from 'node-fetch';

import fileResolvers from '../resolvers/file';
import userResolvers from '../resolvers/user';
import watcherResolvers from '../resolvers/watcher';
import { createAuthLink } from './authLink';
import initialCache from './initialCache';


const host = !process.execPath.match(/[\\/]electron/) ? 'https://flakerme-backend.herokuapp.com/graphql' : 'http://localhost:4000/graphql';
const httpLink = new HttpLink({ uri: host, fetch });

const cache = new InMemoryCache({});
cache.writeData({ data: initialCache });

const resolvers = merge(fileResolvers, watcherResolvers, userResolvers);

const client = new ApolloClient({
	cache,
	resolvers,
	link: concat(createAuthLink(cache), httpLink)
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