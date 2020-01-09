import React from 'react';
import ReactLoading from 'react-loading';

export default function LoadingBlock() {
	return (
		<div style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
			<ReactLoading className='loading' type='bubbles' color='#323246' height={50} />
		</div>
	)
}
