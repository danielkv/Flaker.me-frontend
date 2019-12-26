import React from 'react';

export default function CreateAccount() {
	return (
		<FieldsContainer>
			<Label>Nome</Label>
			<Input type='text' onChange={(event)=>this.setCreateUserFields({name: event.target.value})} value={this.state.create_account.name} />
			<Label>Email</Label>
			<Input type='email' onChange={(event)=>this.setCreateUserFields({email: event.target.value})} value={this.state.create_account.email} />
			<Label>Senha</Label>
			<Input type='password' onChange={(event)=>this.setCreateUserFields({password:event.target.value})} value={this.state.create_account.password} />
			<Label>Repetir senha</Label>
			<Input type='password' onChange={(event)=>this.setCreateUserFields({password_repeat:event.target.value})} value={this.state.create_account.password_repeat} />
			

			{this.state.loading ?
			<div style={{justifyContent:'center'}}><ReactLoading className='loading' type='bubbles' color='#323246' height={50} /></div> :
			<SubmitButton onClick={(e)=>{this.createUser(); e.preventDefault();}} value='Registrar' />}

			<div style={{justifyContent:"center"}}><Link onClick={(e)=>{this.setState({error:'', page:'login'}); e.preventDefault();}} href='#'>Logar</Link></div>
		</FieldsContainer>
	)
}
