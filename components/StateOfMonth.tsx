'use client';
import {useSyncExternalStore} from 'react';
import {states,laws} from '@/lib/research';
import {monthlyState} from '@/lib/monthly-state.mjs';
import overviews from '@/lib/state-overviews.json';
function subscribeMonth(onChange:()=>void){const timer=window.setInterval(onChange,60000);return()=>window.clearInterval(timer)}
function getMonth(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit'}).formatToParts(new Date());return `${parts.find(part=>part.type==='year')!.value}-${parts.find(part=>part.type==='month')!.value}`}
function serverMonth(){return ''}
export default function StateOfMonth({go}:{go:(view:string,state?:string)=>void}){
 const month=useSyncExternalStore(subscribeMonth,getMonth,serverMonth);
 const date=month?new Date(`${month}-15T12:00:00Z`):null;
 if(!date)return null;
 const code=monthlyState(date,states.map(state=>state.code));const state=states.find(state=>state.code===code)!;const overview=overviews.find(entry=>entry.state===code)!;const records=laws.filter(law=>law.state===code);
 const edition=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',month:'long',year:'numeric'}).format(date);
 return <section className="state-of-month" aria-label="State of the Month"><div className="monthly-monogram" aria-hidden="true">{code}</div><div className="monthly-copy"><div className="monthly-kicker">STATE OF THE MONTH <span>{edition}</span></div><h2>Get to know {state.name}.</h2><p>{overview.location.replace(/ The U\.S\. Census.*$/,'')}</p><p className="monthly-record">{records.length} published legal records to explore.</p><button onClick={()=>go('state',code)}>Explore {state.name}</button><small>A new state every month. Source-review dates are listed in the state profile.</small></div></section>
}
