'use client';
import USMap from '@/components/USMap';
import HeroSlideshow from '@/components/HeroSlideshow';
import StateOfMonth from '@/components/StateOfMonth';
import {ArrowRight, ArrowUpRight, ShieldCheck, ChevronRight, Fingerprint, HeartPulse, LockKeyhole} from 'lucide-react';
import {states, researchSnapshotLabel, laws as researchLaws} from '@/lib/research';
type Props = {go: (view: string, state?: string, category?: number) => void; laws: typeof researchLaws};
const headlines = [
  {state:'CA', title:'The rights at the center of California’s privacy framework', tag:'CONSUMER PRIVACY'},
  {state:'IL', title:'When a fingerprint becomes protected information', tag:'BIOMETRICS'},
  {state:'WA', title:'Health data protections beyond the doctor’s office', tag:'SENSITIVE DATA'},
  {state:'NY', title:'What happens after personal information is exposed?', tag:'BREACH NOTIFICATION'},
];
export default function Home({go, laws}: Props) {
  return <div className="news-home espn-desk">
    <div className="state-scoreboard" aria-label="Featured state research">
      <button className="scoreboard-index" onClick={() => go('directory')}><strong>STATE<br/>CENTER</strong><ChevronRight size={14}/></button>
      <div className="state-scoreboard-scroll">
        <div className="state-ticker-track">{[0, 1].map(copy => <div className="state-ticker-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{states.map(state => <button key={state.code} tabIndex={copy === 1 ? -1 : 0} onClick={() => go('state', state.code)}>
          <span className="scoreboard-state">{state.code}</span><span><strong>{state.name}</strong><small>{laws.filter(law => law.state === state.code).length} legal records</small></span><ArrowUpRight size={12}/>
        </button>)}</div>)}</div>
      </div>
    </div>
    <div className="desk-edition"><span><i/> THE PRIVACY DESK</span><span>50 STATES. ONE NATIONAL PICTURE.</span><span>{researchSnapshotLabel.toUpperCase()} · RESEARCH EDITION</span></div>
    <div className="news-columns">
      <aside className="left-rail">
        <StateOfMonth go={go}/>
        <div className="rail-card"><div className="rail-title">QUICK LINKS</div>
          <button onClick={() => go('breach')}><ShieldCheck size={17}/> Breach notification</button>
          <button onClick={() => go('category', undefined, 2)}><Fingerprint size={17}/> Biometric privacy</button>
          <button onClick={() => go('category', undefined, 4)}><HeartPulse size={17}/> Health & sensitive data</button>
          <button onClick={() => go('category', undefined, 8)}><LockKeyhole size={17}/> Data security</button>
        </div>

      </aside>
      <main className="news-feed" id="main-content" tabIndex={-1}>
        <article className="lead-story">
          <HeroSlideshow/>
          <div className="lead-copy"><div className="story-label"><span>THE BIG PICTURE</span><span>PRIVACY & CYBERSECURITY</span></div><h1>One country.<br/>Fifty privacy playbooks.</h1><p>Where you live matters. Explore the laws governing your personal information, the rights you can exercise, and the responsibilities businesses carry.</p><button className="lead-story-link" onClick={() => go('directory')}>Explore your state <ArrowRight size={17}/></button><div className="byline"><span className="pip-dot">P</span> Privacy in Practice Research Desk</div></div>
          <div className="story-bottom"><span>CONSUMER RIGHTS</span><span>DATA SECURITY</span><span>OFFICIAL SOURCES</span></div>
        </article>
      </main>
      <aside className="right-rail">
        <section className="news-panel headlines"><h2><span/>IN FOCUS</h2>{headlines.map(story => <button key={story.state} onClick={() => go('state', story.state)}><div><small>{story.tag}</small><h3>{story.title}</h3></div><ChevronRight size={13}/></button>)}<div className="rail-disclaimer">Selected legal explainers</div></section>
        <section className="desk-library"><span className="pink-label">INSIDE THE LIBRARY</span><strong>{laws.length}</strong><h2>Source-linked<br/>legal records.</h2><p>Across 50 states and 10 areas of privacy and cybersecurity law.</p><button onClick={() => go('analytics')}>See research coverage <ArrowRight size={14}/></button></section>

      </aside>
    </div>
    <div className="homepage-map"><USMap go={go} laws={laws}/></div>
  </div>;
}
