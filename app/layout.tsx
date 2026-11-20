import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Privacy in Practice — Your Data. Your Rights. Your State.',description:'Explore privacy and cybersecurity research across all 50 U.S. states.',icons:{icon:'/favicon.svg?v=3'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
