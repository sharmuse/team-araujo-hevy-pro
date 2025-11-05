
import React from 'react';
import TopBar from '../components/TopBar';
import { listByRole } from '../lib/auth';
import { getPlanFor, getCheckins } from '../lib/store';

export default function Reports(){
  const alunos = listByRole('ALUNO');
  const rows = alunos.map((a:any)=>{
    const p = getPlanFor(a.email);
    let volume = 0;
    if(p){
      p.days.forEach((d:any)=>d.items.forEach((it:any)=>it.sets.forEach((s:any)=>{
        const w = Number(s.weight||0); const r=Number(s.reps||0);
        volume += (isFinite(w*r)?(w*r):0);
      })));
    }
    const checks = getCheckins(a.email);
    const last = checks.length? checks[checks.length-1] : null;
    return { aluno:a.name, email:a.email, volume: Math.round(volume), peso:last?.peso||'-', checkin:last?.date||'-' };
  });

  return (
    <div className="container">
      <TopBar/>
      <div className="card">
        <strong>Relatório geral</strong>
        <table className="table">
          <thead><tr><th>Aluno</th><th>E-mail</th><th>Volume estimado (kg×reps)</th><th>Último peso</th><th>Último check-in</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(<tr key={i}><td>{r.aluno}</td><td>{r.email}</td><td>{r.volume}</td><td>{r.peso}</td><td>{r.checkin}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
