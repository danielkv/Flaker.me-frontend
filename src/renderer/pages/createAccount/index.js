import React from 'react';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/react-hooks';
import { Typography, FormHelperText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik';
import { cloneDeep } from 'lodash';
import * as Yup from 'yup';

import { FormContainer, FieldsContainer, ButtonsContainer } from '../../components/Forms';

import { getErrors } from '../../../errors';


import { CREATE_USER } from '../../../queries/user';


const validationSchema = Yup.object().shape({
	token: Yup.string().required('Campo obrigatório'),
	firstName: Yup.string().required('Campo obrigatório'),
	lastName: Yup.string().required('Campo obrigatório'),
	email: Yup.string().email('Email inválido').required('Campo obrigatório'),
	password: Yup.string().required('Campo obrigatório'),
	repeat_password: Yup.string().test('confirm_passaword', 'Não é igual a senha', function confirm(value) {
		return value === this.parent.password;
	}),
})

const initialValues = {
	token: '',
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	repeat_password: '',
}

export default function CreateAccount({ history }) {
	const [createUser, { error: errorCreating }] = useMutation(CREATE_USER);

	function onSubmit(result) {
		const dataSave = cloneDeep(result);
		delete dataSave.repeat_password;
		return createUser({ variables: { data: dataSave } })
			.then(()=>{
				history.push('/login');
			})
	}

	const {
		handleSubmit,
		handleChange,
		isSubmitting,
		values: { token, firstName, lastName, email, password, repeat_password },
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
					<TextField
						label='Nome'
						name='firstName'
						onChange={handleChange}
						value={firstName}
						error={!!errors.firstName}
						helperText={errors.firstName}
						disabled={isSubmitting}
					/>
					<TextField
						label='Sobrenome'
						name='lastName'
						onChange={handleChange}
						value={lastName}
						error={!!errors.lastName}
						helperText={errors.lastName}
						disabled={isSubmitting}
					/>
					<TextField
						label='Email'
						name='email'
						onChange={handleChange}
						value={email}
						error={!!errors.email}
						helperText={errors.email}
						disabled={isSubmitting}
					/>
					<TextField
						label='Senha'
						name='password'
						onChange={handleChange}
						value={password}
						error={!!errors.password}
						helperText={errors.password}
						disabled={isSubmitting}
						type='password'
					/>
					<TextField
						label='Repetir senha'
						name='repeat_password'
						onChange={handleChange}
						value={repeat_password}
						error={!!errors.repeat_password}
						helperText={errors.repeat_password}
						disabled={isSubmitting}
						type='password'
					/>
					<TextField
						label='Token de segurança'
						name='token'
						disabled={isSubmitting}
						onChange={handleChange}
						value={token}
						error={!!errors.token}
						helperText={errors.token}
					/>
				</FieldsContainer>
				<ButtonsContainer>
					<Button size='large' disabled={isSubmitting} color='primary' type='submit'>
						{isSubmitting
							? <ReactLoading className='loading' type='spin' height={25} />
							: 'Criar conta'}
					</Button>
					<Button variant='text' component={Link} to='/login'>Já possuo uma conta</Button>
				</ButtonsContainer>
				{!!errorCreating && <FormHelperText error>{getErrors(errorCreating)}</FormHelperText>}
			</form>
		</FormContainer>
	)
}
