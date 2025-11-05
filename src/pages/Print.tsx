
import React from 'react';
import TopBar from '../components/TopBar';
import { currentUser } from '../lib/auth';
import { getPlanFor, getCheckins } from '../lib/store';
import jsPDF from 'jspdf';

export default function PrintPage(){
  const u:any = currentUser();
  const email = u?.role==='PROFESSOR' ? prompt('E-mail do aluno para imprimir:') || '' : u?.email;
  const plan = getPlanFor(email||u?.email);
  const checkins = getCheckins(email||u?.email);

  function toPDF(){
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    let y = 40;
    doc.setFontSize(16);
    doc.text('Team Araújo — Plano de Treino', 40, y); y+=24;
    doc.setFontSize(12);
    if(plan){
      plan.days.forEach((d:any)=>{
        doc.text('Dia: '+d.name, 40, y); y+=18;
        d.items.forEach((it:any)=>{
          doc.text(' • '+it.name, 60, y); y+=16;
          it.sets.forEach((s:any)=>{
            doc.text(`   - [${s.type}] ${s.weight||'-'}kg x ${s.reps||'-'} @ ${s.rpe||'-'} • ${s.rest||'-'}s`, 70, y);
            y+=14;
          });
        });
        y+=10;
      });
    }
    y+=20;
    doc.setFontSize(14);
    doc.text('Últimos check-ins', 40, y); y+=18;
    doc.setFontSize(12);
    checkins.slice(-10).forEach((c:any)=>{
      doc.text(`${c.date} — ${c.peso||'-'} kg — ${c.notas||''}`, 60, y); y+=14;
    });
    doc.save('plano-team-araujo.pdf');
  }

  return (
    <div className="container print-wrap">
      <TopBar/>
      <div className="card">
        <div className="row" style={{justifyContent:'space-between'}}>
          <strong>Impressão</strong>
          <button className="btn" onClick={toPDF}>Exportar PDF</button>
        </div>
      </div>
      {plan ? plan.days.map((d:any,i:number)=>(
        <div className="card" key={i}>
          <strong>{d.name}</strong>
          {d.items.map((it:any,ii:number)=>(
            <div className="kv" key={ii}><b>{it.name}</b>: {it.sets.map((s:any)=>`[${s.type}] ${s.weight||'-'}kg x ${s.reps||'-'} @ ${s.rpe||'-'} • ${s.rest||'-'}s`).join(' | ')}</div>
          ))}
        </div>
      )) : <div className="card">Sem plano.</div>}
      <div className="card">
        <strong>Check-ins (10 mais recentes)</strong>
        {checkins.slice(-10).map((c:any,idx:number)=>(
          <div className="kv" key={idx}>{c.date} — {c.peso||'-'} kg — {c.notas||''}</div>
        ))}
      </div>
    </div>
  );
}
