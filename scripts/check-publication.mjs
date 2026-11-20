import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const [published,exclusions,summary]=await Promise.all(['lib/published-laws.json','research/PUBLICATION_EXCLUSIONS.json','lib/publication-summary.json'].map(read));
const blocked=new Set(exclusions.removedIds);
const ids=new Set();const fields=['summary','scope','rights','obligations','exemptions','deadlines','authority','penalties','enacted','effective','amendments'];
const unresolved=/\b(?:TBD|TODO|placeholder|unverified|unconfirmed|not established|not confirmed|pending verification|remain(?:s)? (?:outstanding|unresolved))\b/i;
for(const record of published){
 assert(!ids.has(record.id),`Duplicate published record: ${record.id}`);ids.add(record.id);
 assert(!blocked.has(record.id),`Removed record entered publication: ${record.id}`);
 assert(!('researchNotes' in record),`Internal working notes entered publication: ${record.id}`);
 for(const field of fields){assert(typeof record[field]==='string'&&record[field].trim(),`Missing ${field}: ${record.id}`);assert(!unresolved.test(record[field]),`Unresolved ${field}: ${record.id}`);}
 if(record.legalStatus)assert(!unresolved.test(record.legalStatus),`Unresolved legal status: ${record.id}`);
 assert(new URL(record.statute).protocol==='https:',`Invalid source: ${record.id}`);
}
assert.equal(new Set(published.map(r=>r.state)).size,50,'Published state coverage changed');
assert.equal(summary.publishedRecords,published.length,'Publication summary is stale');
assert.equal(summary.removedRecords,exclusions.removedIds.length,'Removal summary is stale');
const publicAudit=await read('public/research-audit.json');assert(!('recordGaps' in publicAudit),'Internal findings exposed in public download');
console.log(`Publication checks passed: ${published.length} records, 50 states; removed records, unresolved markers and internal notes excluded.`);
