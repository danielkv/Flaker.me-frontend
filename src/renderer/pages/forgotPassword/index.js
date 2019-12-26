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
})

const initialValues = {
	email: '',
}

export default function ForgotPassword() {
	function onSubmit(result) {

	}

	const {
		handleSubmit,
		handleChange,
		isSubmitting,
		values: { email },
		errors,
	} = useFormik({
		onSubmit,
		initialValues,
		validationSchema,
	})

	return (
		<FormContainer>
			<Typography variant='h5'>Recuperar senha</Typography>
			<Typography variant='caption' style={{ marginBottom: 15, color: '#999' }}>Digite seu email abaixo</Typography>
			<form onSubmit={handleSubmit}>
				<FieldsContainer>
					<TextField label='Email' name='email' onChange={handleChange} value={email} error={!!errors.email} helperText={errors.email} />
				</FieldsContainer>
				<ButtonsContainer>
					<Button size='large' disabled={isSubmitting} color='primary' type='submit'>
						{isSubmitting
							? <ReactLoading className='loading' type='spin' height={25} />
							: 'Login'}
					</Button>
					<Button variant='text' component={Link} to='/login'>Logar</Button>
				</ButtonsContainer>
			</form>
		</FormContainer>
	)
}
