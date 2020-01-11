import { WebSocketLink } from 'apollo-link-ws';
import WebSocket from 'ws';

import { getHeaders } from './authLink';

export function createWsLink(cache) {
	const wsLink = new WebSocketLink({
		uri: 'ws://localhost:4000/graphql',
		webSocketImpl: WebSocket,
		options: {
			reconnect: true
		}
	})

	const subscriptionMiddleware = {
		applyMiddleware(options, next) {
			options.setContext({
				headers: getHeaders(cache)
			});
			next();
		},
	};

	wsLink.subscriptionClient.use([subscriptionMiddleware]);

	return wsLink;
}
