// A fixed shuffled rotation keeps the selection consistent for all visitors,
// with a different state each month and no repeats within a 50-month cycle.
export function monthlyState(date, codes) {
 const calendar = new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',year:'numeric',month:'numeric'}).formatToParts(date);
 const year=Number(calendar.find(part=>part.type==='year').value);
 const month=Number(calendar.find(part=>part.type==='month').value);
 const order=[...codes].sort();
 let seed=172903;
 for(let i=order.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[order[i],order[j]]=[order[j],order[i]];}
 return order[((year*12+month-1)%order.length+order.length)%order.length];
}
