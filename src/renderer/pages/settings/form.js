import React from 'react';
import ReactLoading from 'react-loading';
import { useHistory } from 'react-router-dom';

import { Fab, Button, TextField, FormHelperText } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { remote } from 'electron';
import path from 'path';

import { FieldsContainer, ButtonsContainer } from '../../components/Forms';

export default function Settings({ handleSubmit, handleChange, isSubmitting, values: { watch, lifecycle }, errors, setFieldValue }) {
	// COMMON
	const history = useHistory();

	// Open dialog to select folder to watch
	function openWatchSelection(defaultPath) {
		const directory = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
			properties: ['openDirectory'],
			message: 'Selecione a pasta a ser monitarada',
			defaultPath: defaultPath || '',
		});

		// if no directory selected
		if (!directory) return;

		if (directory.length) setFieldValue('watch.value', directory);
	}
	
	return (
		<form onSubmit={handleSubmit}>
			<Fab onClick={()=>history.push('/files')} style={{ marginBottom: 20 }} size='small'><ArrowBack style={{ fontSize: 20 }} /></Fab>
			<FieldsContainer>
				<Button
					disabled={isSubmitting}
					onClick={(e)=>{
						openWatchSelection(watch.value[0]);
						e.preventDefault();
					}}
				>
					{watch.value[0] ? path.basename(watch.value[0]) : 'Selecionar pasta'}
				</Button>
				<FormHelperText error={!!errors.watch}>
					{errors.watch
						? errors.watch.value
						: 'Todos arquivos dentro da pasta selecionada serão enviados para nuvem'}
				</FormHelperText>
				
				<TextField
					style={{ marginTop: 40 }}
					label='Excluir em quantos (dias)'
					type='number'
					name='lifecycle.value'
					value={lifecycle.value}
					disabled={isSubmitting}
					error={!!errors.lifecycle}
					helperText={errors.lifecycle || ''}
					onChange={handleChange}
				/>
				<FormHelperText>0 para nunca excluir</FormHelperText>
			</FieldsContainer>
			<ButtonsContainer>
				<Button
					style={{ marginTop: 40 }}
					color='primary'
					type='submit'
					disabled={isSubmitting}
				>
					{
						isSubmitting
							? <ReactLoading className='loading' type='bubbles' color='#323246' height={25} />
							: 'Salvar'
					}
				</Button>
			</ButtonsContainer>
		</form>
	)
}
