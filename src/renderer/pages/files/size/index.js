import React from 'react';

import { useQuery } from '@apollo/react-hooks';

import { Container, Size, SizeText } from './styles';

import { COMPANY_LIMITS } from '../../../../queries/files';
import { GET_COMPANY } from '../../../../queries/user';

function convertSize(bytes, decimals = 1) {
	return `${(bytes / 1024 / 1024 / 1024).toFixed(decimals).replace('.', ',')}GB`;
}

export default function CompanyLimits() {
	const { data: { company } } = useQuery(GET_COMPANY);
	const { data: { company: { size = 0, limit = 0 } = {}, } = {}, loading: loadingLimits, error } = useQuery(COMPANY_LIMITS, {
		pollInterval: 30000,
		variables: { id: company }
	})

	if (loadingLimits) return <div>teste</div>;
	if (error) return true;

	const sizeDisplay = convertSize(size);
	const limitDisplay = convertSize(limit);

	return (
		<Container>
			<Size limit={limit} size={size} />
			<SizeText limit={limit} size={size}>
				{`${sizeDisplay} / ${limitDisplay}`}
			</SizeText>
		</Container>
	)
}
