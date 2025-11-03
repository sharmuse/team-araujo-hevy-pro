import React from 'react';
import Login from './pages/Login';
import Professor from './pages/Professor';
import Aluno from './pages/Aluno';
import PrintPage from './pages/Print';
import EmailConfig from './pages/EmailConfig';
import Reports from './pages/Reports';
import { currentUser } from './lib/auth';
import { initTheme } from './lib/theme';
import { startTicker } from './lib/notify';
function useHash(){ const [h,setH]=React.useState(location.hash||'#/login'); React.useEffect(()=>{ const on=()=>setH(location.hash||'#/login'); window.addEventListener('hashchange',on); return()=>window.removeEventListener('hashchange',on); },[]); return h; }
export default function App(){ React.useEffect(()=>{ initTheme(); startTicker(); },[]); const hash=useHash(); const user=currentUser(); if(hash.startsWith('#/print')) return <PrintPage/>; if(hash.startsWith('#/emailcfg')) return <EmailConfig/>; if(hash.startsWith('#/reports')) return <Reports/>; if(hash.startsWith('#/professor')){ if(!('loggedIn' in user && user.loggedIn) || (user as any).role!=='PROFESSOR'){ location.hash = '#/login'; return <Login/>; } return <Professor/>; } if(hash.startsWith('#/aluno')){ if(!('loggedIn' in user && user.loggedIn) || (user as any).role!=='ALUNO'){ location.hash = '#/login'; return <Login/>; } return <Aluno/>; } if(('loggedIn' in user && user.loggedIn)){ const target=(user as any).role==='PROFESSOR'?'#/professor':'#/aluno'; if(location.hash!==target){ location.hash=target; } return (user as any).role==='PROFESSOR'? <Professor/> : <Aluno/>; } if(location.hash !== '#/login'){ location.hash='#/login'; } return <Login/>; }
