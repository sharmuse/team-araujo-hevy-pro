
import React from 'react';
import TopBar from '../components/TopBar';
import { getEmailCfg, setEmailCfg } from '../lib/email';
import { getReminders, saveReminders } from '../lib/notify';

export default function EmailConfig(){
  const [cfg,setCfg] = React.useState<any>(getEmailCfg());
  const [rem,setRem] = React.useState<any>(getReminders());

  function save(){
    setEmailCfg(cfg);
    saveReminders(rem);
    alert('Configurações salvas.');
  }

  return (
    <div className="container">
      <TopBar/>
      <div className="card">
        <strong>Envio de e-mails</strong>
        <div className="row">
          <select className="select" value={cfg.provider||'mailto'} onChange={e=>setCfg({...cfg, provider:e.target.value})}>
            <option value="mailto">Abrir programa de e-mail (mailto)</option>
            <option value="emailjs">EmailJS (chaves públicas)</option>
          </select>
        </div>
        {cfg.provider==='emailjs' && (
          <div className="grid" style={{marginTop:12}}>
            <input className="input" placeholder="Public Key" value={cfg.emailjs?.publicKey||''} onChange={e=>setCfg({ ...cfg, emailjs:{...(cfg.emailjs||{}), publicKey:e.target.value} })}/>
            <input className="input" placeholder="Service ID" value={cfg.emailjs?.serviceId||''} onChange={e=>setCfg({ ...cfg, emailjs:{...(cfg.emailjs||{}), serviceId:e.target.value} })}/>
            <input className="input" placeholder="Template ID" value={cfg.emailjs?.templateId||''} onChange={e=>setCfg({ ...cfg, emailjs:{...(cfg.emailjs||{}), templateId:e.target.value} })}/>
          </div>
        )}
      </div>
      <div className="card">
        <strong>Lembretes (notificações do navegador)</strong>
        <div className="grid" style={{maxWidth:420}}>
          <label>Treino — hora<input className="input" type="number" value={rem.treino.hour} onChange={e=>setRem({...rem, treino:{...rem.treino, hour:Number(e.target.value)}})}/></label>
          <label>Treino — minuto<input className="input" type="number" value={rem.treino.minute} onChange={e=>setRem({...rem, treino:{...rem.treino, minute:Number(e.target.value)}})}/></label>
          <label><input type="checkbox" checked={rem.treino.enabled} onChange={e=>setRem({...rem, treino:{...rem.treino, enabled:e.target.checked}})}/> Ativar</label>
          <hr/>
          <label>Check-in — hora<input className="input" type="number" value={rem.checkin.hour} onChange={e=>setRem({...rem, checkin:{...rem.checkin, hour:Number(e.target.value)}})}/></label>
          <label>Check-in — minuto<input className="input" type="number" value={rem.checkin.minute} onChange={e=>setRem({...rem, checkin:{...rem.checkin, minute:Number(e.target.value)}})}/></label>
          <label><input type="checkbox" checked={rem.checkin.enabled} onChange={e=>setRem({...rem, checkin:{...rem.checkin, enabled:e.target.checked}})}/> Ativar</label>
        </div>
        <button className="btn" onClick={save}>Salvar configurações</button>
      </div>
    </div>
  );
}
