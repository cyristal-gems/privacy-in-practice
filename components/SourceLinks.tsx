import {sourceProvenance} from '@/lib/source-provenance';
function Source({url}:{url:string}){
 const source=sourceProvenance(url);const isIndiana=url.includes('1995-EO3.pdf');const pdf=/\.pdf(?:[?#]|$)|\/bitstreams\/.+\/content/i.test(url);const caption=source.kind==='government'?'Official publication':source.kind==='legal_reproduction'?'Published copy of legal text':source.label;
 return <li>{isIndiana?<><a href="/sources/indiana-student-survey-1995.pdf" target="_blank" rel="noreferrer">Read the relevant two pages <span>PDF · 2 pages · 55 KB</span></a><a className="full-source" href={url} target="_blank" rel="noreferrer">Original complete volume <span>PDF · 31 MB</span></a></>:<a href={url} target="_blank" rel="noreferrer">{caption}<span>{source.host}{pdf?' · PDF':''}</span></a>}</li>
}
export default function SourceLinks({urls,label='Read sources'}:{urls:(string|undefined)[];label?:string}){
 const sources=[...new Set(urls.filter((u):u is string=>!!u&&u.startsWith('https://')))];if(!sources.length)return null;
 return <details className="compact-sources"><summary>{label} <span>({sources.length})</span></summary><ul>{sources.map(url=><Source key={url} url={url}/>)}</ul><small>Links open separately. PDF files are labeled; file size is shown only when known.</small></details>
}
