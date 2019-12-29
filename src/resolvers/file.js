import { uniqueId } from 'lodash';
import { basename } from 'path';

import { GET_TEMP_FILES } from '../queries/files';

export default {
	Mutation: {
		addTempFile: (_, { path }, { cache }) => {
			// get files already added
			const { tempFiles } = cache.readQuery({ query: GET_TEMP_FILES });

			// create temp file
			const file = {
				path,
				originalName: basename(path),
		
				id: uniqueId(),
				status: 'standBy',
				__typename: 'TempFile',
			}

			// add temp file to cache
			cache.writeQuery({ query: GET_TEMP_FILES, data: { tempFiles: [file, ...tempFiles] } });
		}
	}
}