
import React from 'react';
import { login, signup } from '../lib/auth';

export default function Login(){
  const [mode,setMode] = React.useState<'login'|'signup'>('login');
  const [name,setName] = React.useState('');
  const [email,setEmail] = React.useState('');
  const [password,setPassword] = React.useState('');
  const [role,setRole] = React.useState<'PROFESSOR'|'ALUNO'>('ALUNO');
  const [err,setErr] = React.useState<string|undefined>();

  function go(role:string){
    location.hash = role==='PROFESSOR' ? '#/professor' : '#/aluno';
  }

  const onSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    try{
      if(mode==='login'){
        const u = login(email, password);
        go(u.role);
      }else{
        const u = signup(name||'Usuário', email, role, password||'123456');
        go(u.role);
      }
    }catch(ex:any){
      setErr(ex?.message || 'Erro');
    }
  }

  return (
    <div className="center">
      <div className="auth card">
        <div className="logo"><img src="/src/assets/logo.svg" width={40}/></div>
        <h2 style={{marginTop:0, textAlign:'center'}}>Team Araújo — Hevy Pro</h2>
        <div className="tabbar" style={{justifyContent:'center'}}>
          <button className={'tab '+(mode==='login'?'active':'')} onClick={()=>setMode('login')}>Entrar</button>
          <button className={'tab '+(mode==='signup'?'active':'')} onClick={()=>setMode('signup')}>Criar conta</button>
        </div>
        <form className="grid" onSubmit={onSubmit}>
          {mode==='signup' && <input className="input" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)}/>}
          <input className="input" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)}/>
          <input className="input" placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
          {mode==='signup' && (
            <select className="select" value={role} onChange={e=>setRole(e.target.value as any)}>
              <option value="ALUNO">Aluno</option>
              <option value="PROFESSOR">Professor</option>
            </select>
          )}
          {err && <div style={{color:'#ef4444', fontSize:12}}>{err}</div>}
          <button className="btn" type="submit">{mode==='login'?'Entrar':'Criar conta'}</button>
        </form>
      </div>
    </div>
  );
}
