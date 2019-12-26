import React from 'react';
import ReactLoading from 'react-loading';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useFormik, Form } from 'formik';
import * as Yup from 'yup';

import WindowContainer from '../../components/WindowContainer';

const validationSchema = Yup.object().shape({
	email: Yup.string().email().required('Campo obrigatório'),
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
		<WindowContainer>
			<Form onSubmit={handleSubmit}>
				<TextField variant='outlined' label='Email' name='email' type='email' onChange={handleChange} value={email} />

				<TextField variant='outlined' label='Senha' name='password' type='password' onChange={handleChange} value={password} />

				{isSubmitting
					? (
						<div style={{ justifyContent: 'center' }}>
							<ReactLoading className='loading' type='bubbles' color='#323246' height={50} />
						</div>
					)
					: <Button type='submit' label='Login' />}

				{/* <div style={{ justifyContent: 'center' }}>
					<Link href='#'>Registrar</Link>
				</div> */}
				
			</Form>
		</WindowContainer>
	)
}