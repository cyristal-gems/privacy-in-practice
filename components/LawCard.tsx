'use client';
import {useId,useState} from 'react';
import type {Law} from '@/lib/research';
import SourceLinks from './SourceLinks';
const sections = [
 ['enacted','Enactment'],['effective','Effective period'],['legalStatus','Legal status'],
 ['scope','Covered entities & thresholds'],['rights','Consumer rights'],
 ['obligations','Business obligations'],['exemptions','Exemptions & exceptions'],
 ['authority','Enforcement'],['penalties','Remedies & penalties'],
 ['deadlines','Reporting & request deadlines'],['amendments','Amendments & history'],
] as const;
export default function LawCard({law,defaultExpanded=false}:{law:Law;defaultExpanded?:boolean}) {
 const [expanded,setExpanded]=useState(defaultExpanded);
 const [openSections,setOpenSections]=useState<string[]>(defaultExpanded?sections.map(([key])=>key):[]);
 const id=useId();
 const toggleAll=()=>{setExpanded(!expanded);setOpenSections(expanded?[]:sections.map(([key])=>key));};
 const permalink=`#${new URLSearchParams({view:"law",law:law.id})}`;
 return <article className="law law-preview">
  <div className="eyebrow">{law.citation} <span className="pending">Source-backed record</span></div>
  {!defaultExpanded&&<h3>{law.title}</h3>}<p>{law.summary}</p>
  <button className="outline law-expand" aria-expanded={expanded} aria-controls={id} onClick={toggleAll}>{expanded?'Collapse law details':'Read full law details'}</button>
  <div id={id} hidden={!expanded}>
   {expanded&&sections.map(([key,label])=>{const text=law[key];if(!text)return null;const open=openSections.includes(key);const source=law.fieldSources?.[key];return <section className="law-detail-section" key={key}>
    <button className="law-section-toggle" aria-expanded={open} aria-controls={`${id}-${key}`} onClick={()=>setOpenSections(previous=>open?previous.filter(k=>k!==key):[...previous,key])}><span>{label}</span><span aria-hidden="true">{open?'−':'+'}</span></button>
    <div id={`${id}-${key}`} hidden={!open}><p>{text}</p><SourceLinks urls={Array.isArray(source)?source:source?[source]:[]} label="Sources"/></div>
   </section>})}
   <p className="law-reviewed">Source checked: {law.lastReviewed}</p>
  </div>
  <a className="law-permalink" href={permalink} aria-label={`Link to ${law.title}`}>Link to this law</a>
  <SourceLinks urls={[law.statute,law.url]} label="Legal text sources"/>
 </article>;
}
