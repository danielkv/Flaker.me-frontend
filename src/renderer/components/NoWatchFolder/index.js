import React from 'react'
import { useHistory } from 'react-router-dom';

import { Typography, Button } from '@material-ui/core';
import { Warning } from '@material-ui/icons';

export default function NoWatchFolder() {
	const history = useHistory();

	return (
		<div style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
			<Warning style={{ fontSize: 45, color: '#ffaa00', marginBottom: 10 }} />
			<Typography style={{ color: '#888', marginBottom: 20, textAlign: 'center', }} variant='body1'>Nenhuma pasta para monitoramento foi selecionada</Typography>
			<Button onClick={()=>history.push('/settings')} color='primary'>Configurações</Button>
		</div>
	)
}
