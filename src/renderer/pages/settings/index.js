import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { FormHelperText } from '@material-ui/core';
import { Formik } from 'formik';
import { cloneDeep } from 'lodash';
import * as Yup from 'yup';

import { FormContainer } from '../../components/Forms';
import LoadingBlock from '../../components/LoadingBlock';

import { getErrors } from '../../../errors';
import Form from './form';

import { GET_USER_SETTINGS, SAVE_SETTINGS } from '../../../queries/settings';
import { GET_LOGGED_IN_USER_ID } from '../../../queries/user';

const validationSchema = Yup.object().shape({
	watch: Yup.object().shape({
		value: Yup.array().of(Yup.string())
	}),
	lifecycle: Yup.object().shape({
		value: Yup.number(),
	})
});


export default function Settings({ history }) {
	// queries
	const { data: { loggedUserId } } = useQuery(GET_LOGGED_IN_USER_ID);
	const { data: { user: { settings } }, loading: loadingSettings } = useQuery(GET_USER_SETTINGS, { variables: { id: loggedUserId } });

	// mutations
	const [saveSettings, { error: errorSaving }] = useMutation(SAVE_SETTINGS, { refetchQueries: [{ query: GET_USER_SETTINGS, variables: { id: loggedUserId } }] });

	// functions
	function onSubmit(result) {
		const newResult = cloneDeep(result);
		newResult.watch.value = JSON.stringify(newResult.watch.value);
		const dataSave = Object.keys(result).map((key)=>{
			// eslint-disable-next-line no-underscore-dangle
			delete newResult[key].__typename;
			return newResult[key];
		})
		return saveSettings({ variables: { data: dataSave } })
			.then(() => {
				history.push('/files');
			})
	}

	if (loadingSettings) return <LoadingBlock />;

	const watchSetting = settings.find((set)=>set.key === 'watch');
	const lifecycle = settings.find((set)=>set.key === 'lifecycle');

	const initialValues = {
		watch: watchSetting
			// eslint-disable-next-line prefer-object-spread
			? Object.assign({}, watchSetting, { value: JSON.parse(watchSetting.value), action: 'update' })
			: [{ action: 'create', key: 'watch', value: '' }],
		lifecycle: lifecycle
			// eslint-disable-next-line prefer-object-spread
			? Object.assign({}, lifecycle, { action: 'update' })
			: { action: 'create', key: 'lifecycle', value: '0' },
	}

	return (
		<FormContainer>
			<Formik
				onSubmit={onSubmit}
				initialValues={initialValues}
				validationSchema={validationSchema}
				component={Form}
			/>
			{!!errorSaving && <FormHelperText error>{getErrors(errorSaving)}</FormHelperText>}
		</FormContainer>
	)
}
