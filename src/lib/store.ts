export function getStudents(){ try{ return JSON.parse(localStorage.getItem('ta_students_v1')||'[]') }catch{ return [] } }
export function setStudents(list){ localStorage.setItem('ta_students_v1', JSON.stringify(list)); }
export function addStudent(email){ const s=new Set(getStudents()); s.add(email); setStudents(Array.from(s)); }
export function getPlanFor(email){ try{ const db = JSON.parse(localStorage.getItem('ta_plans_v1')||'{}'); return db[email]||null }catch{ return null } }
export function setPlanFor(email,plan){ const db = (()=>{ try{ return JSON.parse(localStorage.getItem('ta_plans_v1')||'{}') }catch{ return {} } })(); db[email]=plan; localStorage.setItem('ta_plans_v1', JSON.stringify(db)); }
export function hasPlan(email){ return !!getPlanFor(email); }
export function getCheckins(email){ try{ const db=JSON.parse(localStorage.getItem('ta_checkins_v1')||'{}'); return db[email]||[] }catch{ return [] } }
export function addCheckin(email, entry){ const db = (()=>{ try{ return JSON.parse(localStorage.getItem('ta_checkins_v1')||'{}') }catch{ return {} } })(); if(!db[email]) db[email]=[]; db[email].push(entry); localStorage.setItem('ta_checkins_v1', JSON.stringify(db)); }
export function getChat(email){ try{ const db=JSON.parse(localStorage.getItem('ta_chat_v1')||'{}'); return db[email]||[] }catch{ return [] } }
export function addChat(email, msg){ const db = (()=>{ try{ return JSON.parse(localStorage.getItem('ta_chat_v1')||'{}') }catch{ return {} } })(); if(!db[email]) db[email]=[]; db[email].push(msg); localStorage.setItem('ta_chat_v1', JSON.stringify(db)); }
export const LIB={ 'Peito':['Supino reto barra','Supino inclinado halter','Crucifixo máquina','Peck-deck'], 'Ombros':['Desenvolvimento Smith','Elevação lateral','Elevação frontal'], 'Costas':['Remada curvada','Puxada na barra','Serrote unilateral'], 'Bíceps':['Rosca direta','Rosca alternada','Rosca martelo'], 'Tríceps':['Tríceps testa','Mergulho','Tríceps corda'], 'Pernas':['Agachamento livre','Hack machine','Leg press unilateral'], 'Posterior':['Stiff','Mesa flexora','Levantamento terra RDL'] };
