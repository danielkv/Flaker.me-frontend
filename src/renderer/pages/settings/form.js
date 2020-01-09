import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';
import { useHistory } from 'react-router-dom';

import { Button, TextField, FormHelperText } from '@material-ui/core';
import { ipcRenderer, remote } from 'electron';
import path from 'path';

import { FormContainer, FieldsContainer, ButtonsContainer } from '../../components/Forms';

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
			<FieldsContainer>
				<Button
					disabled={isSubmitting}
					onClick={(e)=>{
						openWatchSelection(watch.value[0]);
						e.preventDefault();
					}}
				>
					{watch ? path.basename(watch.value[0]) : 'Selecionar pasta'}
				</Button>
				{!!errors.watch && <FormHelperText error>{errors.watch.value}</FormHelperText>}
				
				<TextField
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
				<Button onClick={()=>history.push('/files')}>Cancelar</Button>
			</ButtonsContainer>
		</form>
	)
}
