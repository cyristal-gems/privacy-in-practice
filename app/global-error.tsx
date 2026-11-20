'use client';
import {useEffect} from 'react';
export default function GlobalError({error,reset}:{error:Error & {digest?:string};reset:()=>void}) {
 useEffect(()=>{console.error('Privacy in Practice page error:',error);},[error]);
 return <html lang="en"><body style={{margin:0,background:'#171319',color:'#f8eef4',fontFamily:'Arial,sans-serif',padding:'48px 24px'}}><main style={{maxWidth:640,margin:'auto'}}><h1>We couldn’t load this page.</h1><p>Please try again.</p>{process.env.NODE_ENV==='development'&&<pre style={{whiteSpace:'pre-wrap'}}>{error.message}</pre>}<button onClick={reset} style={{background:'#efa7cb',color:'#211520',border:0,borderRadius:4,padding:'12px 20px',cursor:'pointer'}}>Try again</button></main></body></html>;
}
