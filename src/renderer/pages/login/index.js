import React from 'react';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';

import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormContainer, FieldsContainer, ButtonsContainer } from '../../components/Forms';

const validationSchema = Yup.object().shape({
	email: Yup.string().email('Email inválido').required('Campo obrigatório'),
	password: Yup.string().required('Campo obrigatório'),
})

const initialValues = {
	email: '',
	password: '',
}

export default function Login() {
	function onSubmit(result) {
		// log user In
	}

	const {
		handleSubmit,
		handleChange,
		isSubmitting,
		values: { email, password }
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
					<TextField label='Email' name='email' type='email' onChange={handleChange} value={email} />
					<TextField label='Senha' name='password' type='password' onChange={handleChange} value={password} />
				</FieldsContainer>
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