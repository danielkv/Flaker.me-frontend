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
	token: Yup.string().required('Campo obrigatório'),
	name: Yup.string().required('Campo obrigatório'),
	email: Yup.string().email('Email inválido').required('Campo obrigatório'),
	password: Yup.string().required('Campo obrigatório'),
	repeat_password: Yup.string().test('confirm_passaword', 'Não é igual a senha', function confirm(value) {
		return value === this.parent.password;
	}),
})

const initialValues = {
	token: '',
	name: '',
	email: '',
	password: '',
	repeat_password: '',
}

export default function CreateAccount() {
	function onSubmit(result) {

	}

	const {
		handleSubmit,
		handleChange,
		isSubmitting,
		values: { token, name, email, password, repeat_password },
		errors,
	} = useFormik({
		onSubmit,
		initialValues,
		validationSchema,
	})

	return (
		<FormContainer>
			<form onSubmit={handleSubmit}>
				<Typography variant='h5'>Criar nova conta</Typography>
				<Typography variant='caption' style={{ marginBottom: 15, color: '#999' }}>Crie um novo usuário</Typography>
				<FieldsContainer>
					<TextField label='Token' name='token' onChange={handleChange} value={token} error={!!errors.token} helperText={errors.token} />
					<TextField label='Nome' name='name' onChange={handleChange} value={name} error={!!errors.name} helperText={errors.name} />
					<TextField label='Email' name='email' onChange={handleChange} value={email} error={!!errors.email} helperText={errors.email} />
					<TextField label='Senha' name='password' onChange={handleChange} value={password} error={!!errors.password} helperText={errors.password} />
					<TextField label='Repetir senha' name='repeat_password' onChange={handleChange} value={repeat_password} error={!!errors.repeat_password} helperText={errors.repeat_password} />
				</FieldsContainer>
				<ButtonsContainer>
					<Button size='large' disabled={isSubmitting} color='primary' type='submit'>
						{isSubmitting
							? <ReactLoading className='loading' type='spin' height={25} />
							: 'Login'}
					</Button>
					<Button variant='text' component={Link} to='/login'>Já possuo uma conta</Button>
				</ButtonsContainer>
			</form>
		</FormContainer>
	)
}
