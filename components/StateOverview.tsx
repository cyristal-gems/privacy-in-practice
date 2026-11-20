import overviews from '@/lib/state-overviews.json';
import houseRoster from '@/lib/house-representatives.json';
import {ArrowUpRight, MapPin, Landmark, Users, ChevronDown} from 'lucide-react';

type Official = {name: string; url: string};
type Representative = Official & {district: string; districtCode: string; vacant: boolean; note: string};
function Person({person, role}: {person: Official; role: string}) {
  return <a className="state-official" href={person.url} target="_blank" rel="noreferrer">
    <span>{role}</span><strong>{person.name}<ArrowUpRight size={14}/></strong>
  </a>;
}

export default function StateOverview({code}: {code: string}) {
  const info = overviews.find(s => s.state === code);
  if (!info) return null;
  const representatives: Representative[] = houseRoster.states[code as keyof typeof houseRoster.states] ?? [];
  return <section className="state-overview" aria-label={`${info.name} location and elected officials`}>
    <div className="state-overview-location">
      <div>
        <span className="pink-label"><MapPin size={13}/> {info.region.toUpperCase()} · {info.division.toUpperCase()}</span>
        <h2>Meet {info.name}.</h2>
        <p>{info.location}</p>
        <p>{info.description}</p>
        <div className="state-context-sources">
          <a href={info.geographySource} target="_blank" rel="noreferrer">Census region ↗</a>
          {info.contextSources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}
        </div>
      </div>
    </div>
    <div className="state-official-groups">
      <div><h3><Landmark size={16}/> Governor</h3><Person person={info.governor} role="Governor"/></div>
      <div><h3><Users size={16}/> U.S. Senate</h3>
        {info.senators.map(person => <Person key={person.name} person={person} role="U.S. Senator"/>)}
        <a className="official-roster" href="https://www.senate.gov/senators/" target="_blank" rel="noreferrer">Official Senate roster ↗</a>
      </div>
      <div><h3><Landmark size={16}/> U.S. House</h3>
        <p className="house-delegation-count">{representatives.length} {representatives.length === 1 ? 'congressional district' : 'congressional districts'}</p>
        {representatives.slice(0, 2).map(person => <div key={person.districtCode}><Person person={person} role={person.district === 'At Large' ? 'At-large district' : `${person.district} district`}/>{person.vacant && <p className="house-vacancy">{person.note}</p>}</div>)}
        {representatives.length > 2 && <details className="house-delegation">
          <summary>Show {representatives.length - 2} more representatives <ChevronDown size={15}/></summary>
          <div className="house-delegation-list">
            {representatives.slice(2).map(person => <div key={person.districtCode}>
              <Person person={person} role={person.district === 'At Large' ? 'At-large district' : `${person.district} district`}/>
              {person.vacant && <p className="house-vacancy">{person.note}</p>}
            </div>)}
          </div>
        </details>}
        <a className="official-roster" href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noreferrer">Find your district ↗</a>
        <a className="official-roster" href="https://clerk.house.gov/Members/ViewMemberList" target="_blank" rel="noreferrer">Official House roster ↗</a>
      </div>
    </div>
  </section>;
}
