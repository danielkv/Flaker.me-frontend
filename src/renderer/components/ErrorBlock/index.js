import React from 'react';

import { Error } from '@material-ui/icons'

export default function LoadingBlock({ error }) {
	return (
		<div style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
			<Error style={{ color: '#cc0000' }} />
			<div style={{ color: '#00000' }}>
				{error}
			</div>
		</div>
	)
}
