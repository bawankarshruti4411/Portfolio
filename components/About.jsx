/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { useDesktop } from './DesktopContext';
import { aboutContent } from '../data/siteData';
import styles from './About.module.css';

const TABS = [
  { name: 'Profile', icon: '/xp_icons/User 1.ico' },
  { name: 'Skills', icon: '/xp_icons/System Properties.ico' },
  { name: 'Philosophy', icon: '/xp_icons/Display.ico' },
];

export default function AboutContent() {
  const { openWindow } = useDesktop();
  const [tab, setTab] = useState('Profile');
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.about}>
      {/* ── Tab strip ── */}
      <div className={styles.tabStrip} role="tablist" aria-label="About sections">
        {TABS.map((t) => (
          <button
            key={t.name}
            role="tab"
            aria-selected={tab === t.name}
            className={`${styles.tab} ${tab === t.name ? styles.tabActive : ''}`}
            onClick={() => setTab(t.name)}
          >
            <img src={t.icon} alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {t.name}
          </button>
        ))}
        <div className={styles.tabFiller} />
      </div>

      {/* ── Tab content ── */}
      <div className={styles.tabContent}>
        {/* ── Profile tab ── */}
        {tab === 'Profile' && (
          <div className={styles.profileTab}>
            <div className={styles.bioSection}>
              <div className={styles.sectionHeader}>
                <img src="/xp_icons/My Profile Folder.ico" alt="" width={18} height={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                About Me
              </div>
              {aboutContent.bio.map((para, i) => (
                <p key={i} className={styles.bioPara}>{para}</p>
              ))}
              <div style={{ marginTop: 14 }}>
                <button
                  className={styles.resumeBtn}
                  onClick={() => openWindow('resume')}
                >
                  <img src="/xp_icons/List File.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  View &amp; Print Full Resume (PDF)
                </button>
              </div>
            </div>
            <div className={styles.clockWidget}>
              <div className={styles.clockLabel}>Current time</div>
              <div className={styles.clockDisplay}>{time || '…'}</div>
              <div className={styles.clockSub}>Asia/Kolkata · India</div>
            </div>
          </div>
        )}

        {/* ── Skills tab ── */}
        {tab === 'Skills' && (
          <div className={styles.skillsTab}>
            <div className={styles.sectionHeader}>
              <img src="/xp_icons/System Properties.ico" alt="" width={18} height={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Tools &amp; Techniques
            </div>
            <div className={styles.skillGrid}>
              {aboutContent.skillCategories.map((group) => (
                <div key={group.category} className={styles.skillCard}>
                  <div className={styles.skillGroup}>{group.category}</div>
                  <div className={styles.skillList}>
                    {group.skills.map((s) => (
                      <div key={s} className={styles.skillItem}>
                        <span className={styles.skillDot} aria-hidden="true" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Philosophy tab ── */}
        {tab === 'Philosophy' && (
          <div className={styles.philoTab}>
            <div className={styles.sectionHeader}>
              <img src="/xp_icons/Display.ico" alt="" width={18} height={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              My Philosophy
            </div>
            {aboutContent.philosophy.map((item, i) => (
              <div key={i} className={styles.philoCard}>
                <div className={styles.philoTitle}>
                  <span className={styles.philoNumber}>{i + 1}.</span>
                  {item.title}
                </div>
                <p className={styles.philoDetail}>{item.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSection}>
          <img src="/xp_icons/User Accounts.ico" alt="" width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Shruti Bawankar
        </span>
        <span className={styles.statusSection}>Nagpur, India</span>
        <span className={styles.statusSection}>{time}</span>
      </div>
    </div>
  );
}
