import fs from 'fs';
import { uniqueId } from 'lodash';
import mime from 'mime-types';
import { basename } from 'path';
import request from 'request';

import { getErrors } from '../errors';
import mainScreenFn from '../main/windows/main';

import {
	CREATE_FILE,
	FINISH_FILE_UPLOAD,
	GET_FILES,
	FILE_FRAGMENT,
	UPLOAD_FILE,
	REQUEST_UPLOAD_URI,
	UPDATE_FILE_PROGRESS,
	ADD_FILES,
	UPDATE_FILE,
	STOP_FILE_STREAMING,
} from '../queries/files';
import { GET_LOGGED_IN_USER_ID } from '../queries/user';

export default {
	Mutation: {
		addLocalFile: (_, { path }, { client, cache }) => {
			// get list of files
			const { files } = cache.readQuery({ query: GET_FILES });
			
			// get temp file stats
			const stats = fs.statSync(path);

			// create and normalize local file
			const file = {
				id: uniqueId('local_'),
				path,
				originalName: basename(path),
				createdAt: '',
				progress: 0,
				bytesCount: 0,
				status: 'standBy',
				size: stats.size, // converted to kb
				__typename: 'File',
				stream: null,

				name: '',
				url: '',
				bucket: '',
				helperText: '',
			}

			// if originalName and size are different of files add new file to list
			if (!files.find((f) => f.originalName === file.originalName && f.size === file.size)) {
				// add local files to apollo cache
				client.mutate({ mutation: ADD_FILES, variables: { data: [file] } })
					// handle file upload
					.then(()=>client.mutate({ mutation: UPLOAD_FILE, variables: { file } }));
			}
		},
		addOnlineFiles: (_, { data }, { client }) => {
			// normalize online files
			const files = data.map((file) => Object.assign(file, {
				path: '',
				progress: 0,
				bytesCount: file.size,
				status: 'standBy',
				helperText: '',
				stream: null,
			}));

			// add online files to apollo cache
			client.mutate({ mutation: ADD_FILES, variables: { data: files } });
		},
		addFiles: (_, { data }, { cache }) => {
			// get files already added
			const { files } = cache.readQuery({ query: GET_FILES });

			// add files to cache
			cache.writeQuery({ query: GET_FILES, data: { files: [...data, ...files] } });

			// update file on renderer
			mainScreenFn.get().webContents.send('updateFileList', 'addFiles');
		},
		uploadFile: async (_, { file }, { client }) => {
			file.status = 'loading';
			file.helperText = 'aguardando...';
			client.mutate({ mutation: UPDATE_FILE, variables: { id: file.id, data: file } });

			// request upload URI from server
			const uriResult = await client.query({
				query: REQUEST_UPLOAD_URI,
				variables: { originalName: file.originalName, size: file.size }
			})
				.catch((err)=>{
					client.mutate({
						mutation: UPDATE_FILE,
						variables: {
							id: file.id,
							data: {
								status: 'error',
								helperText: getErrors(err)
							}
						}
					})
				})

			// if some error occurs it will return nothing to result
			if (!uriResult) return;
				
			// case uploadUri is undefined exit function
			const { data: { requestUploadUri: uploadUri = null } } = uriResult;
			if (!uploadUri) return;
			
			// create new file stream
			const fileStream = fs.createReadStream(file.path, { highWaterMark: 128 * 1024 });
			const { loggedUserId } = client.readQuery({ query: GET_LOGGED_IN_USER_ID });

			// case user logout when processing uploadUri
			if (!loggedUserId) return;

			client.mutate({ mutation: UPDATE_FILE, variables: { id: file.id, data: { stream: fileStream }, update: false } });
			
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
				try {
					if (err) throw err;
				
					const newFile = JSON.parse(newFileString);
					client.mutate({
						mutation: FINISH_FILE_UPLOAD,
						variables: {
							file: Object.assign(file, { name: newFile.name, bucket: newFile.bucket })
						}
					});
				} catch (finalError) {
					client.mutate({
						mutation: UPDATE_FILE,
						variables: {
							id: file.id,
							data: {
								status: 'error',
								helperText: getErrors(finalError)
							}
						}
					})
				}
			}));

			// case errors occurs
			fileStream.on('error', (err)=>{
				client.mutate({
					mutation: UPDATE_FILE,
					variables: {
						id: file.id,
						data: {
							status: 'error',
							helperText: getErrors(err)
						}
					}
				})
			})
		
			// when receive any data (progress)
			fileStream.on('data', (chunk) => {
				// eslint-disable-next-line new-cap
				const buffer = new Buffer.from(chunk);
				const bytesCount = buffer && buffer.length ? buffer.length : 0;

				client.mutate({ mutation: UPDATE_FILE_PROGRESS, variables: { id: file.id, bytesCount } });
			});
		},
		stopFileStreaming: (_, { id, update = true }, { cache, client }) => {
			const cacheID = `File:${id}`;
			const file = cache.readFragment({ fragment: FILE_FRAGMENT, id: cacheID });
			
			// destroy file stream
			if (file.stream) file.stream.destroy();
			
			// update in cache
			const updateData = {
				stream: null,
				helperText: 'Upload cancelado',
				status: 'error',
			}
			
			client.mutate({ mutation: UPDATE_FILE, variables: { id: file.id, data: updateData, update } });
		},
		stopAllFileStreaming: (_, { update = true }, { cache, client }) => {
			const { files } = cache.readQuery({ query: GET_FILES });

			// filter only streaming files
			files.forEach(file => {
				// update in cache
				if (file.stream) client.mutate({ mutation: STOP_FILE_STREAMING, variables: { id: file.id, update } });
			})
		},
		updateFileProgress: (_, { id, bytesCount }, { client, cache }) => {
			const cacheID = `File:${id}`;
			const file = cache.readFragment({ fragment: FILE_FRAGMENT, id: cacheID });

			// case file doesn't exist
			if (!file) return;
			
			// status
			file.status = 'uploading';
			file.bytesCount += bytesCount;
			file.helperText = 'enviando...';
			
			// progress
			const prevProgress = file.progress;
			const nextProgress = Math.round((file.bytesCount * 100) / file.size);
			const updateRenderer = (nextProgress - prevProgress) >= 4;
			if (updateRenderer) file.progress = nextProgress;
			
			// update file in cache
			client.mutate({ mutation: UPDATE_FILE, variables: { id, data: file, update: updateRenderer } });
		},
		updateFile: (_, { id, data, update = true }, { cache }) => {
			const cacheID = `File:${id}`;
			const file = cache.readFragment({ fragment: FILE_FRAGMENT, id: cacheID });

			// case file doesn't exist
			if (!file) return;
			
			// file new state
			const newState = Object.assign(file, data);
			
			// save to cache
			cache.writeFragment({ fragment: FILE_FRAGMENT, id: cacheID, data: newState });
			
			// update on renderer
			if (update) mainScreenFn.get().webContents.send('updateFileList', 'updateFile');
		},
		finishFileUpload: (_, { file }, { client }) => {
			// update file status to loading
			client.mutate({ mutation: UPDATE_FILE, variables: { id: file.id, data: { status: 'loading' } } });
			
			const saveFile = {
				originalName: file.originalName,
				name: file.name,
				size: file.size,
				bucket: file.bucket,
			}

			client.mutate({ mutation: CREATE_FILE, variables: { data: saveFile } })
				.then(({ data: { createFile: newFile } }) => {
					client.mutate({
						mutation: UPDATE_FILE,
						variables: {
							id: file.id,
							data: Object.assign(file, saveFile, {
								status: 'standBy',
								url: newFile.url,
								createdAt: newFile.createdAt,
								helperText: '',
								stream: null,
							})
						}
					});
				})
				.catch((err) => {
					client.mutate({
						mutation: UPDATE_FILE,
						variables: {
							id: file.id,
							data: {
								status: 'error',
								helperText: getErrors(err)
							}
						}
					})
				});
		}
	}
}