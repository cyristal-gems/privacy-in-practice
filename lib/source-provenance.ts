/** Describes the publisher, not a legal-accuracy or currency certification. */
export function sourceProvenance(url:string){
 let host='';try{host=new URL(url).hostname.toLowerCase()}catch{return {label:'Reference source',host:'',kind:'reference'}}
 const publisher=host.replace(/^www\./,'');
 if(host==='dockets.justia.com')return {label:'Court docket reproduction',host:publisher,kind:'docket_reproduction'};
 if(host==='books.google.com'||(host.endsWith('courthousenews.com')&&url.includes('kathleen-vita-brief.pdf')))return {label:'Historical scan',host:publisher,kind:'historical_scan'};
 if(['law.justia.com','cases.justia.com','codes.findlaw.com','caselaw.findlaw.com','www.law.cornell.edu','openjurist.org','law.resource.org','legiscan.com','govt.westlaw.com','unicourt.github.io'].includes(host))return {label:'Legal text reproduction',host:publisher,kind:'legal_reproduction'};
 if(['www.ici.org','www.mma.org','noi.org','www.casemine.com'].includes(host))return {label:'Archived copy · see notes',host:publisher,kind:'archived_copy'};
 if(host.endsWith('.gov')||/\.(?:state\.[a-z]{2}|legis\.wisconsin|legis\.state\.[a-z]{2})\.us$/.test(host)||['malegislature.gov','www.ncleg.net','www.ksrevisor.org','ksrevisor.gov','www.ksrevisor.gov','www.oscn.net'].includes(host))return {label:'Government-hosted source',host:publisher,kind:'government'};
 if(host.endsWith('.edu'))return {label:'Institutional source',host:publisher,kind:'institutional'};
 return {label:'Reference source · see notes',host:publisher,kind:'reference'};
}
