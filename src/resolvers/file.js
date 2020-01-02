import fs from 'fs';
import { uniqueId } from 'lodash';
import mime from 'mime-types';
import { basename } from 'path';
import request from 'request';

import mainScreenFn from '../main/windows/main';

import {
	CREATE_FILE,
	FINISH_FILE_UPLOAD,
	GET_TEMP_FILES,
	TEMP_FILE_FRAGMENT,
	UPLOAD_FILE,
	REQUEST_UPLOAD_URI,
	UPDATE_FILE_PROGRESS,
	GET_USER_FILES,
} from '../queries/files';
import { GET_LOGGED_IN_USER_ID } from '../queries/user';

export default {
	Mutation: {
		addTempFile: (_, { path }, { client, cache }) => {
			// get temp files already added
			const { tempFiles } = cache.readQuery({ query: GET_TEMP_FILES });

			// get temp file stats
			const stats = fs.statSync(path);

			// create temp file
			const file = {
				id: uniqueId(),
				path,
				originalName: basename(path),
				createdAt: (new Date()).getTime(),
				progress: 0,
				bytesCount: 0,
				size: stats.size,
				status: 'loading',
				__typename: 'TempFile',
			}

			// add temp file to cache
			cache.writeQuery({ query: GET_TEMP_FILES, data: { tempFiles: [file, ...tempFiles] } });

			// handle file upload
			client.mutate({ mutation: UPLOAD_FILE, variables: { file } });

			// update temp file on renderer
			mainScreenFn.get().webContents.send('updateTempFiles');
		},
		uploadFile: async (_, { file }, { client }) => {
			// request upload URI from server
			const { data: { requestUploadUri: uploadUri = null } } = await client.query({ query: REQUEST_UPLOAD_URI, variables: { originalName: file.originalName } });
			// case uploadUri is undefined exit function
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
			fileStream.pipe(request.post(requestOptions, (err, reponse, newFileString) => {
				if (err) console.log(err);

				const newFile = JSON.parse(newFileString);
				client.mutate({ mutation: FINISH_FILE_UPLOAD, variables: { file: Object.assign(file, { name: newFile.name, bucket: newFile.bucket }) } });
			}));

			// case errors occurs
			fileStream.on('error', (err)=>{
				console.log(err);
				/* fileError(file, err, 'download');
				//log to server
				logger(`Error uploading file '${file.originalname}': ${err}`, {status:206}); */
			})
		
			// when receive any data (progress)
			fileStream.on('data', async (chunk) => {
				const buffer = new Buffer.from(chunk);
				const bytesCount = buffer.length;

				client.mutate({ mutation: UPDATE_FILE_PROGRESS, variables: { id: file.id, bytesCount } });
			});
		},
		updateFileProgress: (_, { id, bytesCount }, { cache }) => {
			const cacheID = `TempFile:${id}`;
			const file = cache.readFragment({ fragment: TEMP_FILE_FRAGMENT, id: cacheID });
			
			// status
			file.status = 'uploading';
			file.bytesCount += bytesCount;
			
			const prevProgress = file.progress;
			const nextProgress = Math.round((file.bytesCount * 100) / file.size);
			const progressDifference = (nextProgress - prevProgress) >= 3;
			if (progressDifference) file.progress = nextProgress;
			
			// save to cache
			cache.writeFragment({ fragment: TEMP_FILE_FRAGMENT, id: cacheID, data: file });
			
			// update on renderer
			if (progressDifference) mainScreenFn.get().webContents.send('updateTempFiles');
		},
		finishFileUpload: (_, { file }, { cache, client }) => {
			// get temp file
			const cacheID = `TempFile:${file.id}`;
			const tempFile = cache.readFragment({ fragment: TEMP_FILE_FRAGMENT, id: cacheID });
			
			// update file status to standBy
			cache.writeFragment({ fragment: TEMP_FILE_FRAGMENT, id: cacheID, data: Object.assign(tempFile, { status: 'loading' }) });
			// update on renderer
			mainScreenFn.get().webContents.send('updateTempFiles');

			const saveFile = {
				originalName: file.originalName,
				name: file.name,
				size: file.size,
				bucket: file.bucket,
				createdAt: file.createdAt,
			}

			const { loggedUserId } = cache.readQuery({ query: GET_LOGGED_IN_USER_ID });
			client.mutate({ mutation: CREATE_FILE, variables: { data: saveFile }, refetchQueries: [{ query: GET_USER_FILES, variables: { id: loggedUserId } }] })
				.then(() => {
					// get temp files
					const { tempFiles } = cache.readQuery({ query: GET_TEMP_FILES });
					
					// remove tempFile uploaded
					const tempFileIndex = tempFiles.findIndex((f) => f.id === tempFile.id);
					tempFiles.splice(tempFileIndex, 1);

					// save in cache
					cache.writeQuery({ query: GET_TEMP_FILES, data: { tempFiles } });
					// update in renderer
					mainScreenFn.get().webContents.send('updateTempFiles');
				})
		},
	}
}