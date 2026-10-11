/* eslint-disable @next/next/no-img-element */
import { useDesktop } from './DesktopContext';
import { heroContent, profile } from '../data/siteData';
import styles from './Hero.module.css';

export default function HeroContent() {
  const { openWindow } = useDesktop();

  return (
    <div className={styles.welcome}>
      {/* ── Top profile strip ── */}
      <div className={styles.profileStrip}>
        <div className={styles.avatarWrap}>
          <img
            src="/profile_portrait.png"
            alt={profile.name}
            className={styles.avatarImg}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className={styles.avatarFallback} aria-hidden="true">
            {profile.initials}
          </div>
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{profile.name}</h1>
          <p className={styles.profileRole}>{profile.role}</p>
          <div className={styles.profileMeta}>
            <span>📍 {profile.location}</span>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} aria-hidden="true" />
              {profile.availability}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tagline ── */}
      <div className={styles.taglineBox}>
        <span className={styles.taglineQuote} aria-hidden="true">&ldquo;</span>
        <p className={styles.tagline}>
          {profile.tagline}
        </p>
        <span className={styles.taglineQuote} aria-hidden="true">&rdquo;</span>
      </div>

      {/* ── Summary ── */}
      <div className={styles.summarySection}>
        <p className={styles.summaryText}>{heroContent.subtext}</p>
      </div>

      {/* ── Stats as XP properties ── */}
      <div className={styles.statsGroup} role="list">
        {heroContent.stats.map((s, i) => (
          <div key={i} className={styles.statRow} role="listitem">
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statValue}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* ── XP-style CTA buttons ── */}
      <div className={styles.ctaRow}>
        <button
          className={`${styles.xpBtn} ${styles.xpBtnPrimary}`}
          onClick={() => openWindow('resume')}
        >
          <img src="/xp_icons/List File.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Resume (CV)
        </button>
        <button
          className={`${styles.xpBtn} ${styles.xpBtnPrimary}`}
          onClick={() => openWindow('projects')}
        >
          <img src="/xp_icons/Folder Closed.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Projects
        </button>
        <button
          className={styles.xpBtn}
          onClick={() => openWindow('achievements')}
        >
          <img src="/xp_icons/Activate Windows.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Achievements
        </button>
        <button
          className={styles.xpBtn}
          onClick={() => openWindow('certificates')}
        >
          <img src="/xp_icons/Disk Image File.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Certificates
        </button>
        <button
          className={styles.xpBtn}
          onClick={() => openWindow('gallery')}
        >
          <img src="/xp_icons/Camera.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Gallery
        </button>
        <button
          className={styles.xpBtn}
          onClick={() => openWindow('contact')}
        >
          <img src="/xp_icons/Internet Properties.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Contact
        </button>
      </div>

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSection}>
          <img src="/xp_icons/List File.ico" alt="" width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Welcome to {profile.name}&apos;s Portfolio
        </span>
        <span className={styles.statusSection}>{profile.role}</span>
        <span className={styles.statusSection}>{profile.location}</span>
      </div>
    </div>
  );
}
