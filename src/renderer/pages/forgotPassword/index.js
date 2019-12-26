import React from 'react'

export default function ForgotPassword() {
	return (
		<FieldsContainer>
			<Label>Email</Label>
			<Input type='email' onChange={(event)=>this.setForgotPassFields({email: event.target.value})} value={this.state.forgot_password.email} />

			{this.state.loading ?
			<div style={{justifyContent:'center'}}><ReactLoading className='loading' type='bubbles' color='#323246' height={50} /></div> :
			<SubmitButton onClick={(e)=>{this.recoverPassword(); e.preventDefault();}} value='Recuperar senha' />}

			<div style={{justifyContent:"center"}}><Link onClick={(e)=>{this.setState({error:'', page:'login'}); e.preventDefault();}} href='#'>Logar</Link></div>

		</FieldsContainer>
	)
}
