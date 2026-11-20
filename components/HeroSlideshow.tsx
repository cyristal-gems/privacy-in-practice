'use client';
import {useEffect,useState} from 'react';
import Image from 'next/image';
const slides=[['Consumer rights','A shield protecting personal rights'],['Biometric privacy','A fingerprint representing biometric information'],['Health privacy','A heart representing sensitive health information'],['Data security','A lock representing protected personal data'],['Law and accountability','Scales representing legal rights and accountability']];
export default function HeroSlideshow(){
 const [active,setActive]=useState(0),[reduced,setReduced]=useState(true);
 useEffect(()=>{const preference=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(preference.matches);update();preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update)},[]);
 useEffect(()=>{if(reduced)return;const timer=window.setInterval(()=>setActive(value=>(value+1)%slides.length),120000);return()=>window.clearInterval(timer)},[reduced]);
 return <section className="lead-art desk-lead-art hero-slideshow" aria-label="Privacy in Practice illustrations" aria-roledescription="carousel">
  {slides.map(([title,alt],index)=><Image unoptimized width={1600} height={800} priority={index===0} className={`hero-slide${index===active?' is-active':''}`} key={title} src={`/images/privacy-slide-${index+1}.svg`} alt={alt} aria-hidden={index!==active} decoding="async"/>)}
  <span className="art-kicker">THE NATIONAL PICTURE</span><div className="art-word">KNOW<br/>YOUR<br/><em>RIGHTS.</em></div>
  <span className="art-caption">{slides[active][0]}</span>
  <div className="hero-slide-controls"><div className="hero-slide-dots" role="group" aria-label="Choose illustration">{slides.map(([title],index)=><button key={title} aria-label={`Show ${title.toLowerCase()} image`} aria-pressed={index===active} onClick={()=>setActive(index)}><span/></button>)}</div></div>
 </section>;
}
