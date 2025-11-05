
import React from 'react';
import TopBar from '../components/TopBar';
import { currentUser, listByRole, signup } from '../lib/auth';
import { addStudent, getPlanFor, setPlanFor, LIB } from '../lib/store';
import { sendEmail } from '../lib/email';

type Set = { type:'AQ'|'ID'|'TR'; weight?:number; reps?:number; rpe?:number; rest?:number };
type Item = { name:string; sets:Set[] };
type Day = { name:string; items:Item[] };
type Plan = { days: Day[]; notes?:string };

const templates: Record<string,Plan> = {
  'PPL 6x': { days:[
    { name:'Peito/Ombro/Tríceps', items:[{name:'Supino reto barra', sets:[{type:'AQ'},{type:'ID'},{type:'TR'},{type:'TR'}]}]},
    { name:'Costas/Bíceps', items:[{name:'Remada curvada', sets:[{type:'AQ'},{type:'ID'},{type:'TR'}]}]},
    { name:'Pernas', items:[{name:'Agachamento livre', sets:[{type:'AQ'},{type:'ID'},{type:'TR'},{type:'TR'}]}]},
    { name:'Peito/Ombro/Tríceps', items:[]},
    { name:'Costas/Bíceps', items:[]},
    { name:'Pernas', items:[]},
  ]},
  'FullBody 3x': { days:[
    { name:'Full A', items:[{name:'Agachamento livre', sets:[{type:'AQ'},{type:'TR'},{type:'TR'}]}]},
    { name:'Full B', items:[{name:'Supino reto barra', sets:[{type:'AQ'},{type:'TR'},{type:'TR'}]}]},
    { name:'Full C', items:[{name:'Remada curvada', sets:[{type:'AQ'},{type:'TR'},{type:'TR'}]}]},
  ]},
  'Força→Hiper (12s)': { days:[
    { name:'Força — A', items:[{name:'Supino reto barra', sets:[{type:'ID'},{type:'TR'},{type:'TR'},{type:'TR'}]}]},
    { name:'Força — B', items:[{name:'Agachamento livre', sets:[{type:'ID'},{type:'TR'},{type:'TR'},{type:'TR'}]}]},
    { name:'Descanso', items:[]},
    { name:'Hiper — A', items:[{name:'Supino inclinado halter', sets:[{type:'AQ'},{type:'TR'},{type:'TR'}]}]},
    { name:'Hiper — B', items:[{name:'Hack machine', sets:[{type:'AQ'},{type:'TR'},{type:'TR'}]}]},
    { name:'Descanso', items:[]},
  ]}
};

export default function Professor(){
  const prof = currentUser();
  const [alunos,setAlunos] = React.useState<any[]>(listByRole('ALUNO'));
  const [sel,setSel] = React.useState<string>('');
  const [plan,setPlan] = React.useState<Plan|null>(null);
  const [msg,setMsg] = React.useState('');

  React.useEffect(()=>{
    if(sel){
      setPlan(getPlanFor(sel) || { days:[], notes:'' });
    } else {
      setPlan(null);
    }
  },[sel]);

  function cadastrarAluno(){
    const name = prompt('Nome do aluno:');
    const email = prompt('E-mail do aluno:');
    const pass = prompt('Senha para o aluno (ex: 123456):','123456');
    if(!name||!email||!pass) return;
    const sess = prof; // preserva sessão do professor
    try{
      signup(name, email, 'ALUNO', pass);
      localStorage.setItem('ta_session_v1', JSON.stringify(sess));
      addStudent(email);
      alert('Aluno criado.');
      setAlunos(listByRole('ALUNO'));
    }catch(e:any){
      alert('Erro: '+(e?.message||e));
    }
  }

  function addDay(){ if(!plan) return; setPlan({...plan, days:[...plan.days, {name:'Novo dia', items:[]}]}); }
  function addItem(d:number){ if(!plan) return; const p = structuredClone(plan); p.days[d].items.push({name:'Novo exercício', sets:[{type:'AQ'},{type:'ID'},{type:'TR'}]}); setPlan(p); }
  function addSet(d:number,i:number){ if(!plan) return; const p=structuredClone(plan); p.days[d].items[i].sets.push({type:'TR'}); setPlan(p); }
  function save(){ if(!plan||!sel) return; setPlanFor(sel, plan); setMsg('Plano salvo.'); setTimeout(()=>setMsg(''),1500); }

  function loadTemplate(key:string){ if(!sel) return alert('Selecione um aluno.'); setPlan(JSON.parse(JSON.stringify(templates[key]))); }
  function cloneFrom(){ const email = prompt('Clonar plano de qual e-mail?'); if(!email) return; const other = getPlanFor(email); if(!other) return alert('Aluno não possui plano.'); setPlan(JSON.parse(JSON.stringify(other))); }

  async function avisarEmail(){
    if(!sel) return;
    await sendEmail(sel, 'Seu plano Team Araújo está pronto', 'Acesse o app e confira seu novo plano. Vamos pra cima! 💪');
    alert('E-mail disparado (ou aberto no cliente de e-mail).');
  }

  return (
    <div className="container">
      <TopBar/>
      <div className="card">
        <div className="row" style={{justifyContent:'space-between'}}>
          <div className="row">
            <select className="select" value={sel} onChange={e=>setSel(e.target.value)}>
              <option value="">Selecione o aluno</option>
              {alunos.map(a=><option key={a.email} value={a.email}>{a.name} — {a.email}</option>)}
            </select>
            <button className="btn-ghost" onClick={cadastrarAluno}>+ Cadastrar aluno</button>
            <button className="btn-ghost" onClick={()=>loadTemplate('PPL 6x')}>Template PPL</button>
            <button className="btn-ghost" onClick={()=>loadTemplate('FullBody 3x')}>Template Full</button>
            <button className="btn-ghost" onClick={()=>loadTemplate('Força→Hiper (12s)')}>Template Força→Hiper</button>
            <button className="btn" onClick={save}>Salvar</button>
            <button className="btn-ghost" onClick={avisarEmail}>Avisar por e-mail</button>
            <button className="btn-ghost" onClick={cloneFrom}>Clonar de aluno</button>
          </div>
          <div className="kv">{msg}</div>
        </div>
      </div>

      {plan ? (
        <div className="grid">
          <div className="card">
            <div className="row" style={{justifyContent:'space-between'}}>
              <strong>Plano semanal</strong>
              <button className="btn-ghost" onClick={addDay}>+ Dia</button>
            </div>
            {plan.days.map((d,di)=>(
              <div className="card" key={di}>
                <div className="row" style={{justifyContent:'space-between'}}>
                  <input className="input" style={{minWidth:200}} value={d.name} onChange={e=>{ const p=structuredClone(plan); p.days[di].name=e.target.value; setPlan(p); }}/>
                  <button className="btn-ghost" onClick={()=>addItem(di)}>+ Exercício</button>
                </div>
                <table className="table">
                  <thead><tr><th>Exercício</th><th>Séries (tipo peso×reps @rpe — descanso)</th></tr></thead>
                  <tbody>
                    {d.items.map((it,ii)=>(
                      <tr key={ii}>
                        <td>
                          <input className="input" value={it.name} onChange={e=>{ const p=structuredClone(plan); p.days[di].items[ii].name=e.target.value; setPlan(p); }}/>
                        </td>
                        <td>
                          <div className="row" style={{flexWrap:'wrap'}}>
                            {it.sets.map((s,si)=>(
                              <div className="row" key={si}>
                                <select className="select" value={s.type} onChange={e=>{ const p=structuredClone(plan); p.days[di].items[ii].sets[si].type=e.target.value as any; setPlan(p); }}>
                                  <option value="AQ">AQ</option>
                                  <option value="ID">ID</option>
                                  <option value="TR">TR</option>
                                </select>
                                <input className="input" placeholder="peso" style={{width:70}} value={s.weight??''} onChange={e=>{ const p=structuredClone(plan); p.days[di].items[ii].sets[si].weight=Number(e.target.value)||undefined; setPlan(p); }}/>
                                <input className="input" placeholder="reps" style={{width:70}} value={s.reps??''} onChange={e=>{ const p=structuredClone(plan); p.days[di].items[ii].sets[si].reps=Number(e.target.value)||undefined; setPlan(p); }}/>
                                <input className="input" placeholder="rpe" style={{width:70}} value={s.rpe??''} onChange={e=>{ const p=structuredClone(plan); p.days[di].items[ii].sets[si].rpe=Number(e.target.value)||undefined; setPlan(p); }}/>
                                <input className="input" placeholder="desc(s)" style={{width:90}} value={s.rest??''} onChange={e=>{ const p=structuredClone(plan); p.days[di].items[ii].sets[si].rest=Number(e.target.value)||undefined; setPlan(p); }}/>
                              </div>
                            ))}
                            <button className="btn-ghost" onClick={()=>{ const p=structuredClone(plan); p.days[di].items[ii].sets.push({type:'TR'} as any); setPlan(p); }}>+ Série</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">Selecione um aluno para editar o plano.</div>
      )}
    </div>
  );
}
