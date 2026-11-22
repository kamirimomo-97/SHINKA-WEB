import {isProgressionTraining} from './training-validity.js?v=0.60.5';
import {localDate} from './rank-system.js?v=0.60.5';
import {metrics} from './core.js?v=0.60.5';
export const starterKeys=['fire','water','nature'];
export function dayKey(time){const d=new Date(time);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
export function weekKey(time){const d=new Date(time);d.setDate(d.getDate()-((d.getDay()+6)%7));return dayKey(d);}
export function validDays(db){return [...new Set(db.sessions.filter(s=>Number.isFinite(s.finished)&&isProgressionTraining(s)).map(s=>db.rankProgress?.timeZone?localDate(s.finished,db.rankProgress.timeZone):dayKey(s.finished)))];}
export function playerLevel(db){return db.demoMax?.playerLevel??validDays(db).length;}
export function weekRewards(db,now=Date.now()){const current=weekKey(now),weeks=[...new Set(db.sessions.filter(s=>Number.isFinite(s.finished)&&isProgressionTraining(s)).map(s=>weekKey(s.finished)))];return weeks.filter(w=>w<current&&!db.journeyV2.claims[w]).sort();}
export function migrateProgression(db){if(db.journeyV2)return db;const base={},days=new Map();for(const s of [...db.sessions].sort((a,b)=>a.finished-b.finished))if(isProgressionTraining(s)&&!days.has(dayKey(s.finished)))days.set(dayKey(s.finished),s.shinkaryu||db.legacyStarter||db.starter);for(const key of ['fire','water','wind','nature'])base[key]=[...days.values()].filter(k=>k===key).length*100;const claims={};for(const s of db.sessions)if(isProgressionTraining(s))claims[weekKey(s.finished)]={migration:true};db.journeyV2={onboarded:false,obtained:db.sessions.length||Object.values(db.creatures).some(c=>c.unlocked>0)?[...new Set([db.starter,...Object.keys(db.creatures).filter(k=>db.creatures[k].unlocked>0)])]:[],xp:base,claims,created:Date.now()};return db;}
export function assignedProgress(db,key){return {xp:db.journeyV2.xp[key]||0,affinity:db.demoMax?100:Math.min(100,db.sessions.filter(s=>(s.shinkaryu||db.legacyStarter||db.starter)===key&&isProgressionTraining(s)).map(s=>dayKey(s.finished)).filter((v,i,a)=>a.indexOf(v)===i).length*5)};}
export function claimWeek(db,week,key,now=Date.now()){if(!db.journeyV2.obtained.includes(key)||!weekRewards(db,now).includes(week))return false;db.journeyV2.claims[week]={key,xp:500,at:now};db.journeyV2.xp[key]=(db.journeyV2.xp[key]||0)+500;return true;}
export function canObtain(db,key){
  const level=playerLevel(db);
  const limit=level>=7?3:level>=3?2:1;
  const obtained=db.journeyV2.obtained;
  return starterKeys.includes(key)&&!obtained.includes(key)&&obtained.filter(k=>starterKeys.includes(k)).length<limit;
}
