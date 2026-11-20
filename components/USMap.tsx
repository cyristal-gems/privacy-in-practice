'use client';
import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, Move} from 'lucide-react';
import geometry from '@/lib/us-map.json';
import {Law, states} from '@/lib/research';

type Props = {go: (view: string, state?: string, category?: number) => void; laws: Law[]};
type Camera = {zoom: number; x: number; y: number};
type Point = {x: number; y: number};
const WIDTH = 1050, HEIGHT = 630;
const INITIAL: Camera = {zoom: 1, x: 460, y: 315};
const LEVELS = [.5, .75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 6, 8];
function bounded(camera: Camera): Camera {
  const zoom = Math.max(.5, Math.min(8, camera.zoom));
  const halfWidth = WIDTH / zoom / 2, halfHeight = HEIGHT / zoom / 2;
  return {zoom, x: zoom <= 1 ? INITIAL.x : Math.max(-65 + halfWidth, Math.min(985 - halfWidth, camera.x)), y: zoom <= 1 ? INITIAL.y : Math.max(halfHeight, Math.min(630 - halfHeight, camera.y))};
}
export default function USMap({go, laws}: Props) {
  const [camera, setCamera] = useState<Camera>(INITIAL);
  const [hovered, setHovered] = useState('CA');
  const svg = useRef<SVGSVGElement>(null);
  const current = useRef(INITIAL);
  const pointers = useRef(new Map<number, Point>());
  const moved = useRef(false);
  const pinch = useRef<{distance: number; camera: Camera; anchor: Point} | null>(null);
  const apply = (next: Camera) => {current.current = bounded(next); setCamera(current.current)};
  const position = (clientX: number, clientY: number) => {
    const bounds = svg.current!.getBoundingClientRect();
    return {x: (clientX - bounds.left) / bounds.width - .5, y: (clientY - bounds.top) / bounds.height - .5};
  };
  const zoomAt = (zoom: number, point: Point = {x: 0, y: 0}) => {
    const before = current.current, next = Math.max(.5, Math.min(8, zoom));
    apply({zoom: next, x: before.x + point.x * WIDTH * (1 / before.zoom - 1 / next), y: before.y + point.y * HEIGHT * (1 / before.zoom - 1 / next)});
  };
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const bounds = element.getBoundingClientRect();
      const point = {x: (event.clientX - bounds.left) / bounds.width - .5, y: (event.clientY - bounds.top) / bounds.height - .5};
      const before = current.current;
      const next = Math.max(.5, Math.min(8, before.zoom * Math.exp(-Math.max(-150, Math.min(150, event.deltaY)) * .003)));
      const camera = bounded({zoom: next, x: before.x + point.x * WIDTH * (1 / before.zoom - 1 / next), y: before.y + point.y * HEIGHT * (1 / before.zoom - 1 / next)});
      current.current = camera; setCamera(camera);
    };
    element.addEventListener('wheel', wheel, {passive: false});
    return () => element.removeEventListener('wheel', wheel);
  }, []);
  const selected = states.find(state => state.code === hovered)!;
  const records = laws.filter(law => law.state === hovered);
  const lead = records.find(law => law.categories.includes(0)) || records[0];
  const percentage = Math.round(camera.zoom * 100);
  return <section className="news-panel geographic-map">
    <div className="panel-heading"><div><span className="pink-label">THE STATE OF PRIVACY</span><h2>Where do you stand?</h2></div><span className="live-label"><i/> 50 STATE PROFILES</span></div>
    <p>Explore the map. Select a state to open its legal profile.</p>
    <div className="map-stage">
      <div className="map-controls"><select aria-label="Map zoom percentage" value={percentage} onChange={event => zoomAt(Number(event.target.value) / 100)}>
        {!LEVELS.some(level => Math.round(level * 100) === percentage) && <option value={percentage}>{percentage}%</option>}
        {LEVELS.map(level => <option key={level} value={Math.round(level * 100)}>{Math.round(level * 100)}%</option>)}
      </select></div>
      <svg ref={svg} viewBox={`${camera.x - WIDTH / camera.zoom / 2} ${camera.y - HEIGHT / camera.zoom / 2} ${WIDTH / camera.zoom} ${HEIGHT / camera.zoom}`} role="group" tabIndex={0}
        aria-label="Interactive United States map. Scroll or pinch to zoom; drag or use arrow keys to move. Select a state to open its profile."
        onKeyDown={event => {
          const directions: Record<string, Point> = {ArrowLeft: {x: -60, y: 0}, ArrowRight: {x: 60, y: 0}, ArrowUp: {x: 0, y: -60}, ArrowDown: {x: 0, y: 60}};
          const direction = directions[event.key];
          if (direction) {event.preventDefault(); apply({...current.current, x: current.current.x + direction.x / camera.zoom, y: current.current.y + direction.y / camera.zoom})}
          if (event.key === '+' || event.key === '=') {event.preventDefault(); zoomAt(current.current.zoom * 1.25)}
          if (event.key === '-') {event.preventDefault(); zoomAt(current.current.zoom / 1.25)}
          if (event.key === '0') {event.preventDefault(); apply(INITIAL)}
        }}
        onPointerDown={event => {
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          pointers.current.set(event.pointerId, {x: event.clientX, y: event.clientY});
          if (pointers.current.size === 1) moved.current = false;
          if (pointers.current.size === 2) {
            const [a, b] = [...pointers.current.values()]; const middle = position((a.x + b.x) / 2, (a.y + b.y) / 2);
            pinch.current = {distance: Math.hypot(a.x - b.x, a.y - b.y), camera: current.current, anchor: {x: current.current.x + middle.x * WIDTH / current.current.zoom, y: current.current.y + middle.y * HEIGHT / current.current.zoom}};
            moved.current = true; event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerMove={event => {
          const previous = pointers.current.get(event.pointerId); if (!previous) return;
          if (pointers.current.size >= 2 && pinch.current) {
            pointers.current.set(event.pointerId, {x: event.clientX, y: event.clientY});
            const [a, b] = [...pointers.current.values()], gesture = pinch.current;
            const zoom = Math.max(.5, Math.min(8, gesture.camera.zoom * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, gesture.distance)));
            const middle = position((a.x + b.x) / 2, (a.y + b.y) / 2);
            apply({zoom, x: gesture.anchor.x - middle.x * WIDTH / zoom, y: gesture.anchor.y - middle.y * HEIGHT / zoom});
          } else {
            const dx = event.clientX - previous.x, dy = event.clientY - previous.y;
            if (!moved.current && Math.abs(dx) + Math.abs(dy) < 3) return;
            pointers.current.set(event.pointerId, {x: event.clientX, y: event.clientY});
            moved.current = true; event.currentTarget.setPointerCapture(event.pointerId);
            const bounds = event.currentTarget.getBoundingClientRect();
            apply({...current.current, x: current.current.x - dx * WIDTH / bounds.width / current.current.zoom, y: current.current.y - dy * HEIGHT / bounds.height / current.current.zoom});
          }
        }}
        onPointerUp={event => {pointers.current.delete(event.pointerId); pinch.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)}}
        onPointerCancel={event => {pointers.current.delete(event.pointerId); pinch.current = null; moved.current = true}}
      >
        <defs>{geometry.map(state => <clipPath key={state.code} id={`state-label-${state.code}`}><path d={state.path}/></clipPath>)}</defs>
        {geometry.map(state => {
          const count = laws.filter(law => law.state === state.code).length;
          return <a key={state.code} href={`#view=state&state=${state.code}`} aria-label={`${state.name}: ${count} indexed law records. Open state profile.`}
            onFocus={() => setHovered(state.code)} onMouseEnter={() => setHovered(state.code)}
            onClick={event => {event.preventDefault(); if (event.detail === 0 || !moved.current) go('state', state.code)}}>
            <title>{`${state.name} · ${count} indexed legal records · published source-backed records`}</title>
            <path className={`geo-state coverage-${count >= 5 ? 'high' : count >= 3 ? 'medium' : 'base'} ${hovered === state.code ? 'hovered' : ''}`} d={state.path}/>
            <text className="geo-label" x={state.labelX} y={state.labelY} style={{fontSize: state.labelSize}} textAnchor="middle" dominantBaseline="central" clipPath={`url(#state-label-${state.code})`}>{state.code}</text>
          </a>;
        })}
      </svg>
      <div className="pan-hint"><Move size={10}/> Scroll or pinch to zoom · drag to move · choose 100% to reset</div>
    </div>
    <div className="map-key"><strong>Indexed record coverage</strong><span><i className="base"/>2 records</span><span><i className="medium"/>3–4 records</span><span><i className="high"/>5+ records</span></div>
    <div className="map-selection"><div><strong>{selected.name}</strong><span>{lead?.title || 'State privacy & cybersecurity research'}</span></div><button onClick={() => go('state', hovered)}>Open profile <ArrowUpRight size={16}/></button></div>
    <div className="map-foot"><span>Coverage colors describe this library, not the legal strength of a state.</span><a href="https://github.com/topojson/us-atlas" target="_blank" rel="noreferrer">Geography: U.S. Census / us-atlas ↗</a></div>
  </section>;
}
