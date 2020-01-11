import React from 'react';

import { useQuery } from '@apollo/react-hooks';

import { convertFileSize } from '../../../utils';
import { Container, Size, SizeText } from './styles';

import { COMPANY_LIMITS } from '../../../../queries/files';
import { GET_COMPANY } from '../../../../queries/user';

export default function CompanyLimits() {
	const { data: { company } } = useQuery(GET_COMPANY);
	const { data: { company: { size = 0, limit = 0 } = {}, } = {}, loading: loadingLimits, error } = useQuery(COMPANY_LIMITS, {
		pollInterval: 30000,
		variables: { id: company }
	})

	if (loadingLimits) return true;
	if (error) return true;

	const sizeDisplay = convertFileSize(size);
	const limitDisplay = convertFileSize(limit);

	return (
		<Container>
			<Size limit={limit} size={size} />
			<SizeText limit={limit} size={size}>
				{`${sizeDisplay} / ${limitDisplay}`}
			</SizeText>
		</Container>
	)
}
