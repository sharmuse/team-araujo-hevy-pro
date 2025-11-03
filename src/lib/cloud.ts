import { createClient } from '@supabase/supabase-js';
export function getCloudCfg(){ try{ return JSON.parse(localStorage.getItem('ta_cloud_cfg_v1')||'{"enabled":false}') }catch{ return {enabled:false} } }
export function setCloudCfg(cfg){ localStorage.setItem('ta_cloud_cfg_v1', JSON.stringify(cfg)); }
function client(){ const cfg=getCloudCfg(); if(!cfg.enabled||!cfg.url||!cfg.anonKey) return null; return createClient(cfg.url, cfg.anonKey); }
export async function syncPlan(email,plan){ const c=client(); if(!c) return; await c.from('plans').upsert({ email, json: plan }, { onConflict:'email' }); }
export async function syncCheckin(email,entry){ const c=client(); if(!c) return; await c.from('checkins').insert({ email, json: entry }); }
export async function syncChat(email,msg){ const c=client(); if(!c) return; await c.from('chats').insert({ email, json: msg }); }
