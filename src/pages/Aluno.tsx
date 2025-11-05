
import React from 'react';
import TopBar from '../components/TopBar';
import { currentUser } from '../lib/auth';
import { getPlanFor, addCheckin, getCheckins, addChat, getChat } from '../lib/store';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Aluno(){
  const u:any = currentUser();
  const email = u?.email;
  const [plan,setPlan] = React.useState<any>(getPlanFor(email));
  const [checkins,setCheckins] = React.useState<any[]>(getCheckins(email));
  const [chat,setChat] = React.useState<any[]>(getChat(email));
  const [msg,setMsg] = React.useState('');

  function registrarCheckin(){
    const peso = Number(prompt('Peso de hoje (kg):',''));
    const notas = prompt('Notas/dor/sono/alimentação:','');
    const entry = { date: new Date().toISOString().slice(0,10), peso, notas };
    addCheckin(email, entry);
    setCheckins(getCheckins(email));
    setMsg('Check-in registrado.');
    setTimeout(()=>setMsg(''),1500);
  }

  function enviarChat(){
    const text = prompt('Mensagem para o professor:');
    if(!text) return;
    addChat(email, { author:'ALUNO', text, ts: Date.now() });
    setChat(getChat(email));
    alert('Mensagem enviada.');
  }

  return (
    <div className="container">
      <TopBar/>
      <div className="card">
        <div className="row" style={{justifyContent:'space-between'}}>
          <strong>Meu plano</strong>
          <div className="row">
            <button className="btn-ghost" onClick={registrarCheckin}>+ Check-in</button>
            <button className="btn-ghost" onClick={enviarChat}>Enviar mensagem</button>
          </div>
        </div>
        <div className="kv">{msg}</div>
      </div>

      {plan ? plan.days.map((d:any, idx:number)=>(
        <div className="card" key={idx}>
          <strong>{d.name}</strong>
          {d.items.map((it:any, ii:number)=>(
            <div key={ii} className="card">
              <div><b>{it.name}</b></div>
              <div className="row" style={{flexWrap:'wrap'}}>
                {it.sets.map((s:any, si:number)=>(
                  <div key={si} className="kv">[{s.type}] {s.weight||'-'}kg × {s.reps||'-'} @ {s.rpe||'-'} • descanso {s.rest||'-'}s&nbsp;&nbsp;</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )) : <div className="card">Seu professor ainda não cadastrou um plano.</div>}

      <div className="card">
        <strong>Evolução do peso</strong>
        <div style={{width:'100%', height:240}}>
          <ResponsiveContainer>
            <LineChart data={checkins.map((c:any)=>({date:c.date, peso:c.peso}))}>
              <XAxis dataKey="date" hide={false}/>
              <YAxis dataKey="peso" />
              <Tooltip />
              <Line dataKey="peso" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <strong>Chat</strong>
        {chat.slice().reverse().map((m:any, i:number)=>(
          <div key={i} className="kv">{new Date(m.ts).toLocaleString()} — <b>{m.author}</b>: {m.text}</div>
        ))}
      </div>
    </div>
  );
}
