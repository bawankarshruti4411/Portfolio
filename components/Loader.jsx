/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { preloadStartupAudio, playStartupAudio } from '../utils/audio';
import styles from './Loader.module.css';

/* ═══════════════════════════════════════════════════════════════════════════
   Loader.jsx
   Authentic Windows XP x64 Boot Screen using exact provided Windows logo.
   Direct WebAudio & HTML5 audio autoplay with instant gesture unlock.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Loader({ onComplete }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // 1. Preload and attempt immediate audio autoplay at t=0
    preloadStartupAudio();
    playStartupAudio();

    // 2. Loading duration timed with the Windows XP startup sound (~3.8s)
    const timerFade = setTimeout(() => {
      setIsFading(true);
    }, 3800);

    const timerComplete = setTimeout(() => {
      document.body.style.overflow = '';
      onComplete();
    }, 4300);

    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  // Click or press key anywhere to immediately trigger/unlock sound and advance
  const handleInteraction = () => {
    playStartupAudio();
  };

  const handleSkip = () => {
    playStartupAudio();
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      document.body.style.overflow = '';
      onComplete();
    }, 400);
  };

  return (
    <div
      className={`${styles.bootScreen} ${isFading ? styles.fadeOut : ''}`}
      onClick={handleInteraction}
      onDoubleClick={handleSkip}
      role="status"
      aria-label="Windows XP Boot Screen (Click to enable audio)"
      tabIndex={0}
      onKeyDown={(e) => {
        handleInteraction();
        if (e.key === 'Enter' || e.key === ' ') handleSkip();
      }}
    >
      {/* ── Main Center Content ── */}
      <div className={styles.centerContainer}>
        {/* ── Exact Unmodified Windows Logo & Wordmark ── */}
        <div className={styles.logoWrap}>
          {/* User provided Windows XP 4-pane logo */}
          <div className={styles.flagContainer}>
            <img
              src="/windows_logo.png"
              alt="Windows Logo"
              width={140}
              height={140}
              className={styles.flagImg}
              draggable={false}
            />
          </div>

          {/* Typography matching reference photo */}
          <div className={styles.textContainer}>
            <div className={styles.brandMicrosoft}>
              Microsoft<span className={styles.regSmall}>®</span>
            </div>
            <div className={styles.mainTitleRow}>
              <span className={styles.wordWindows}>Windows</span>
              <span className={styles.wordXp}>
                xp<span className={styles.regSmall}>®</span>
              </span>
            </div>
            <div className={styles.editionText}>x64 Edition</div>
          </div>
        </div>

        {/* ── Authentic XP 3-Block Sliding Progress Bar ── */}
        <div className={styles.progressContainer}>
          <div
            className={styles.barTrack}
            role="progressbar"
            aria-label="Loading Windows XP"
          >
            <div className={styles.slidingBlocks} aria-hidden="true">
              <div className={styles.block} />
              <div className={styles.block} />
              <div className={styles.block} />
            </div>
          </div>
        </div>

        {/* Subtle click prompt for browsers with strict autoplay policies */}
        <div className={styles.soundHint}>
          Click anywhere or press any key to start with audio 🔊
        </div>
      </div>

      {/* ── Bottom Footer Copyright Bar ── */}
      <div className={styles.bootFooter}>
        <div className={styles.copyrightText}>
          Copyright © Shruti Bawankar
        </div>
        <div className={styles.microsoftLogo}>
          Portfolio<span className={styles.regSmall}>®</span>
        </div>
      </div>
    </div>
  );
}
