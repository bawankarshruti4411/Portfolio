import { useState, useEffect } from 'react';
import Head from 'next/head';
import Loader from '../components/Loader';
import Desktop from '../components/Desktop';
import LoginExperience from '../components/LoginExperience';
import { profile } from '../data/siteData';
import { preloadStartupAudio } from '../utils/audio';

export default function Home() {
  const [stage, setStage] = useState('process');

  useEffect(() => {
    preloadStartupAudio();
  }, []);

  return (
    <>
      <Head>
        <title>{`${profile.name} — Portfolio XP`}</title>
        <meta
          name="description"
          content={`${profile.name} — ${profile.role}. An interactive Windows XP–themed data analytics portfolio.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${profile.name} — Portfolio XP`} />
        <meta property="og:description" content={`${profile.role} — interactive portfolio`} />
        <link rel="icon" href="/xp_icons/My Computer.ico" />
      </Head>

      {stage === 'process' && <Loader onComplete={() => setStage('user-selection')} />}
      {(stage === 'user-selection' || stage === 'welcome') && (
        <LoginExperience
          onComplete={() => setStage('portfolio')}
          onRestart={() => setStage('process')}
        />
      )}
      {stage === 'portfolio' && <Desktop />}
    </>
  );
}
