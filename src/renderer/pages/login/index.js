import React from 'react';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/react-hooks';
import { Typography, Button, FormHelperText, TextField } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormContainer, FieldsContainer, ButtonsContainer } from '../../components/Forms';

import { getErrors } from '../../../errors'

import { LOGIN } from '../../../apollo/queries/user';

const validationSchema = Yup.object().shape({
	email: Yup.string().email('Email inválido').required('Campo obrigatório'),
	password: Yup.string().required('Campo obrigatório'),
});

const initialValues = {
	email: '',
	password: '',
}

export default function Login({ history }) {
	const [login, { error }] = useMutation(LOGIN);

	function onSubmit(result) {
		return login({ variables: { email: result.email, password: result.password } })
			.then(({ data: { login: loginData } }) => {
				ipcRenderer.send('logUserIn', loginData);
				history.push('/files');
			})
	}

	const {
		handleSubmit,
		handleChange,
		isSubmitting,
		values: { email, password },
		errors,
	} = useFormik({
		onSubmit,
		initialValues,
		validationSchema,
	})

	return (
		<FormContainer>
			<form onSubmit={handleSubmit}>
				<Typography variant='h5'>Login</Typography>
				<Typography variant='caption' style={{ marginBottom: 30, color: '#999' }}>Acesse com seus dados</Typography>
				<FieldsContainer>
					<TextField
						label='Email'
						name='email'
						type='email'
						onChange={handleChange}
						value={email}
						error={!!errors.email}
						helperText={errors.email}
					/>
					<TextField
						label='Senha'
						name='password'
						type='password'
						onChange={handleChange}
						value={password}
						error={!!errors.password}
						helperText={errors.password}
					/>
				</FieldsContainer>
				{!!error && <FormHelperText error style={{ textAlign: 'center' }}>{getErrors(error)}</FormHelperText>}
				<ButtonsContainer>
					<Button size='large' disabled={isSubmitting} color='primary' type='submit'>
						{isSubmitting
							? <ReactLoading className='loading' type='spin' height={25} />
							: 'Login'}
					</Button>
					<Button component={Link} to='/createAccount'>Registrar</Button>
					<Button component={Link} to='/forgotPassword' variant='text' size='small'>Esqueci minha senha</Button>
				</ButtonsContainer>
			</form>
		</FormContainer>
	)
}