/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { profile, footerContent } from '../data/siteData';
import styles from './Footer.module.css';

function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={styles.socialBtn}
      aria-label={label}
    >
      <span className={styles.socialIcon} aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </a>
  );
}

export default function ContactContent() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.contact}>
      {/* ── Header panel ── */}
      <div className={styles.header}>
        <img
          src="/xp_icons/Internet Properties.ico"
          alt=""
          width={36}
          height={36}
          className={styles.headerIcon}
        />
        <div>
          <h2 className={styles.headerTitle}>{footerContent.ctaTitle}</h2>
          <p className={styles.headerSub}>{footerContent.ctaSubtitle}</p>
        </div>
      </div>

      {/* ── Contact card body ── */}
      <div className={styles.body}>
        {/* Email group box */}
        <fieldset className={styles.groupBox}>
          <legend className={styles.groupBoxLabel}>Email Contact</legend>
          <div className={styles.emailRow}>
            <div className={styles.emailDisplay}>
              <img src="/xp_icons/File.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              <a href={`mailto:${profile.email}`} className={styles.emailLink}>
                {profile.email}
              </a>
            </div>
            <button className={styles.xpBtn} onClick={copyEmail}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
            <a href={`mailto:${profile.email}`} className={styles.xpBtn}>
              <img src="/xp_icons/Internet Properties.ico" alt="" width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Send Email
            </a>
          </div>
        </fieldset>

        {/* Social group box */}
        <fieldset className={styles.groupBox}>
          <legend className={styles.groupBoxLabel}>Social Connections</legend>
          <div className={styles.socialList}>
            <SocialLink href={profile.social.github} label="GitHub" icon="🐙" />
            <SocialLink href={profile.social.linkedin} label="LinkedIn" icon="💼" />
          </div>
        </fieldset>

        {/* Location group box */}
        <fieldset className={styles.groupBox}>
          <legend className={styles.groupBoxLabel}>Network &amp; Location Properties</legend>
          <div className={styles.locationRows}>
            <div className={styles.locationRow}>
              <span className={styles.locationLabel}>Location</span>
              <span className={styles.locationValue}>
                <img src="/xp_icons/Earth (fixed).ico" alt="" width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {profile.location}
              </span>
            </div>
            <div className={styles.locationRow}>
              <span className={styles.locationLabel}>Timezone</span>
              <span className={styles.locationValue}>
                <img src="/xp_icons/Display.ico" alt="" width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {profile.timezone}
              </span>
            </div>
            <div className={styles.locationRow}>
              <span className={styles.locationLabel}>Status</span>
              <span className={styles.locationValue} style={{ color: '#2a7a2a', fontWeight: 'bold' }}>
                <span className={styles.statusDot} aria-hidden="true" />
                {profile.availability}
              </span>
            </div>
          </div>
        </fieldset>
      </div>

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSection}>
          <img src="/xp_icons/Network Computers.ico" alt="" width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Connected to {profile.name}
        </span>
        <span className={styles.statusSection}>Open for opportunities</span>
      </div>
    </div>
  );
}
