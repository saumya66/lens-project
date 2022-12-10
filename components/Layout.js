import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../context'
import Navbar from './ui/Navbar';

export default function Layout({ children, pageMeta }) {
  const router = useRouter();
  const {userAddress,connected, setConnected, profile,setUserAddress,setUserProfile} =useContext(AppContext)
  const meta = {
    title: 'Next.js Subscription Starter',
    description: 'Brought to you by Vercel, Stripe, and Supabase.',
    cardImage: '/og.png',
    ...pageMeta
  };
//   console.log(profile)
  console.log('Connected2 : ', connected)
  
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta property="og:url" content={``} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      <Navbar 
        profile={profile}
        connected={connected} 
        setUserAddress={setUserAddress}
        setConnected={setConnected} 
        userAddress={userAddress}
        setUserProfile={setUserProfile}/>
      <main id="skip" className={"main"}>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
