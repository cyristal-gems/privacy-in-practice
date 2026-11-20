export const categories=['Comprehensive Consumer Privacy','Data Breach Notification','Biometric Data and Facial Recognition',"Children’s and Student Privacy",'Health and Sensitive Data Privacy','Data Brokers and Information Sales','AI, Profiling, and Automated Decision-Making','Workplace and Employee Privacy','Cybersecurity and Data Security Requirements','Digital Surveillance and Communications Privacy'];
export const states='AL:Alabama,AK:Alaska,AZ:Arizona,AR:Arkansas,CA:California,CO:Colorado,CT:Connecticut,DE:Delaware,FL:Florida,GA:Georgia,HI:Hawaii,ID:Idaho,IL:Illinois,IN:Indiana,IA:Iowa,KS:Kansas,KY:Kentucky,LA:Louisiana,ME:Maine,MD:Maryland,MA:Massachusetts,MI:Michigan,MN:Minnesota,MS:Mississippi,MO:Missouri,MT:Montana,NE:Nebraska,NV:Nevada,NH:New Hampshire,NJ:New Jersey,NM:New Mexico,NY:New York,NC:North Carolina,ND:North Dakota,OH:Ohio,OK:Oklahoma,OR:Oregon,PA:Pennsylvania,RI:Rhode Island,SC:South Carolina,SD:South Dakota,TN:Tennessee,TX:Texas,UT:Utah,VT:Vermont,VA:Virginia,WA:Washington,WV:West Virginia,WI:Wisconsin,WY:Wyoming'.split(',').map(s=>{const [code,name]=s.split(':');return {code,name}});
export const featured=['CA','CO','IL','NY','WA','TX','VA','CT'];
export const highlights:Record<string,string>={CA:'Consumer rights & data brokers',CO:'Consumer choice & profiling',IL:'Biometrics & facial recognition',NY:'Data security & breach notification',WA:'Consumer health data',TX:'Consumer privacy & data security',VA:'Consumer rights & assessments',CT:'Consumer privacy & sensitive data'};
export interface Law {id:string;state:string;title:string;citation:string;categories:number[];url:string;statute:string;summary:string;scope:string;rights:string;obligations:string;deadlines:string;authority:string;enacted:string;effective:string;exemptions:string;penalties:string;amendments:string;status:string;lastReviewed:string;verificationStatus?:string;legalStatus?:string;fieldSources?:Partial<Record<string,string|string[]>>;researchNotes?:string|string[];categoryEvidence?:Partial<Record<string,{citation?:string;source?:string;notes?:string}>>;}
import researchRecords from './published-laws.json';
export const laws:Law[]=researchRecords;
export const researchSnapshotDate=researchRecords.map(record=>record.lastReviewed).sort().at(-1)||'';
export const researchSnapshotLabel=new Date(`${researchSnapshotDate}T12:00:00Z`).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'});
export const categoryDescriptions=[
'Cross-sector personal-data rights, controller duties, coverage thresholds, and statutory exemptions. A comprehensive act can contain protections relevant to other research categories.',
'Triggers for resident and regulator notices after qualifying compromises, timing rules, reporting thresholds, substitute notice, and authorized delays.',
'Collection, enrollment, consent, retention, disclosure, and use of biometric identifiers and facial-recognition systems. Breach coverage alone is not a biometric-consent law.',
'Protections for children and student records, educational technology, school-service providers, parental rights, and limits on commercial uses.',
'Health information, genetic and other sensitive data, confidentiality duties, consumer-health frameworks, and sector-specific exceptions.',
'Data-broker registration, information sale, deletion mechanisms, and consumer controls. General sale opt-outs are distinguished from broker-specific duties.',
'Automated decision-making, profiling, AI notices and consent, assessment duties, and context-specific algorithmic rules.',
'Employee monitoring, personal-account access, applicant information, workplace biometric practices, and employment-record protections.',
'Reasonable safeguards, written security programs, sector-specific cybersecurity, vendor controls, risk assessments, and incident response.',
'Interception, recording, electronic communications, surveillance consent, location tracking, and authorized-investigation exceptions.'
];
