import React from 'react'

export default function Files() {
	return (
		<Container>
			<FilesContainer>
				{loading
					? <div style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}><ReactLoading className='loading' type='bubbles' color='#323246' height={50} /></div>
			
					: files.length ? (
						<FilesWrapper>
							{files.map((file, index) => <File key={index} file={file} />)}
						</FilesWrapper>
					)
						: <InfoMessage>Não há nenhum arquivo salvo</InfoMessage>}
			</FilesContainer>
			<this.sizeLimit size={size} limit={limit} />
			<Footer>
				<StatusContainer>
					<StatusText>{this.getStatusText(status)}</StatusText>
					<StatusIcon stat={status} />
				</StatusContainer>
				
				{user != null && (
					<UserInfo>
						{`${user.name} (${user.email})`}
					</UserInfo>
				)}
			</Footer>
		</Container>
	)
}
