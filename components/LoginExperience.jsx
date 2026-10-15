/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { profile } from '../data/siteData';
import styles from './LoginExperience.module.css';

const WELCOME_DURATION = 1750;

export default function LoginExperience({ onComplete, onRestart }) {
  const [stage, setStage] = useState('user-selection');

  useEffect(() => {
    if (stage !== 'welcome') return undefined;
    const timer = window.setTimeout(onComplete, WELCOME_DURATION);
    return () => window.clearTimeout(timer);
  }, [onComplete, stage]);

  return (
    <main className={styles.screen} aria-label="Portfolio welcome">
      <div className={styles.topBar} aria-hidden="true" />
      {stage === 'welcome' ? (
        <section className={styles.welcome} aria-live="polite">
          <h1 className={styles.welcomeWord}>welcome</h1>
        </section>
      ) : (
        <section className={styles.selection} aria-label="Choose a profile">
          <div className={styles.brand}>
            <img className={styles.windowsLogo} src="/Portfolio/windows_logo.png" alt="" />
            <div className={styles.brandCopy}>
              <span className={styles.brandName}>{profile.name}</span>
              <span className={styles.brandSubtitle}>Personal Portfolio</span>
            </div>
          </div>

          <div className={styles.loginContent}>
            <p className={styles.instruction}>To begin, click on your profile to enter.</p>
            <button className={styles.profileCard} type="button" onClick={() => setStage('welcome')}>
              <span className={styles.avatarFrame}>
                <img src="/Portfolio/profile_portrait.png" alt="" className={styles.avatar} />
              </span>
              <span className={styles.profileCopy}>
                <span className={styles.profileName}>{profile.name}</span>
                <span className={styles.profileRole}>Backend Developer · Data Science</span>
              </span>
              <span className={styles.enterArrow} aria-hidden="true">›</span>
            </button>
          </div>
        </section>
      )}
      <footer className={styles.footer}>
        <button className={styles.restart} type="button" onClick={onRestart}>
          <span className={styles.restartIcon} aria-hidden="true">↻</span>
          <span>Restart Portfolio</span>
        </button>
        <p className={styles.footerMessage}>Welcome to my digital workspace.</p>
      </footer>
    </main>
  );
}
