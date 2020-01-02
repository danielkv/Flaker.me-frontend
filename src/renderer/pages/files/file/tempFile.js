import React from 'react';

import { useQuery, useApolloClient } from '@apollo/react-hooks';

import File from './index';

import { GET_TEMP_FILE } from '../../../../queries/files';


export default function TempFile({ id }) {
	const client = useApolloClient()
	console.log(client.readQuery({ query: GET_TEMP_FILE, variables: { id } }));
	const { data: { file = null } = {}, error } = useQuery(GET_TEMP_FILE, { variables: { id } });

	if (error) console.log(error);

	console.log(file);

	if (!file) return false;

	return <File file={file} />
}