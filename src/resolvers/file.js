import fs from 'fs';
import { uniqueId } from 'lodash';
import mime from 'mime-types';
import { basename } from 'path';
import request from 'request';

import { GET_TEMP_FILES, UPLOAD_FILE, REQUEST_UPLOAD_URI } from '../queries/files';

export default {
	Mutation: {
		addTempFile: (_, { path }, { client, cache }) => {
			// get temp files already added
			const { tempFiles } = cache.readQuery({ query: GET_TEMP_FILES });

			// get temp file stats
			const stats = fs.statSync(path);

			// create temp file
			const file = {
				path,
				originalName: basename(path),
		
				id: uniqueId(),
				uploadStatus: 0,
				size: stats.size,
				status: 'standBy',
				__typename: 'TempFile',
			}

			// add temp file to cache
			cache.writeQuery({ query: GET_TEMP_FILES, data: { tempFiles: [file, ...tempFiles] } });

			// handle file upload
			client.mutate({ mutation: UPLOAD_FILE, variables: { file } });
		},
		uploadFile: async (_, { file }, { client }) => {
			// request upload URI from server
			const { data: { requestUploadUri: uploadUri = null } } = await client.query({ query: REQUEST_UPLOAD_URI, variables: { originalName: file.originalName } });

			if (!uploadUri) return;
			
			// create new file stream
			const fileStream = fs.createReadStream(file.path, { highWaterMark: 128 * 1024 });
			
			// setup headers
			const requestOptions = {
				url: uploadUri,
				headers: {
					'Content-Type': mime.lookup(file.path),
					'Content-Length': file.size,
				}
			}

			// pipe temp file to gCloud
			fileStream.pipe(request.post(requestOptions, (err, response, new_file) => {
				if (err) console.log(err);
				// if (err) return fileError(file, err);
				// if (typeof new_file !== 'object') new_file = JSON.parse(new_file);
				
				// save file in database
			}));

			// if an errors occurs
			fileStream.on('error', (err)=>{
				console.log(err);
				/* fileError(file, err, 'download');
				//log to server
				logger(`Error uploading file '${file.originalname}': ${err}`, {status:206}); */
			})
		
			// if receive any data (progress)
			fileStream.on('data', (chunk)=> {

				
				/* const buffer = new Buffer.from(chunk);
				fileProgress(file, buffer, 'uploading'); */
			});
		},
	},
	Query: {
	}
}