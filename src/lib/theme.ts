const KEY='ta_theme_v1'; export type Theme='dark'|'light';
export function getTheme():Theme{ try{ return (localStorage.getItem(KEY) as Theme)||'dark'; }catch{ return 'dark' } }
export function setTheme(t:Theme){ try{ localStorage.setItem(KEY, t); document.documentElement.dataset.theme=t; }catch{} }
export function initTheme(){ setTheme(getTheme()); }
