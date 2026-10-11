/* eslint-disable @next/next/no-img-element */
import { useState, useMemo } from 'react';
import { contributions } from '../data/siteData';
import styles from './Contributions.module.css';

const CATEGORIES = ['All', 'Clubs & Societies', 'Events & Summits', 'Volunteering', 'Community'];

const TYPE_ICONS = {
  'Clubs & Societies': '🏛️',
  'Events & Summits': '🎤',
  Volunteering: '🤝',
  Community: '🌐',
};

export default function ContributionsContent() {
  const [selectedCat, setSelectedCat] = useState('All');

  const filtered = useMemo(() => {
    if (selectedCat === 'All') return contributions;
    return contributions.filter((c) => c.type === selectedCat);
  }, [selectedCat]);

  return (
    <div className={styles.contributions}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <button className={styles.toolBtn} disabled>
          ⬅ Back
        </button>
        <button className={styles.toolBtn} disabled>
          ➡ Forward
        </button>
        <div className={styles.toolSep} />
        <div className={styles.categoryFilter}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterPill} ${selectedCat === cat ? styles.filterPillActive : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Address bar ── */}
      <div className={styles.addressBar}>
        <span className={styles.addressLabel}>Address</span>
        <div className={styles.addressBox}>
          <img
            src="/xp_icons/Network Computers.ico"
            alt=""
            width={16}
            height={16}
            style={{ verticalAlign: 'middle', marginRight: 5 }}
          />
          <span>My Network Places &gt; Community &amp; Activities &gt; {selectedCat}</span>
        </div>
        <button className={styles.goBtn}>Go</button>
      </div>

      {/* ── Main Activity Feed Area ── */}
      <div className={styles.mainArea}>
        {filtered.map((item) => (
          <div key={item.id} className={styles.activityCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerLeft}>
                <span className={styles.cardIcon} aria-hidden="true">
                  {TYPE_ICONS[item.type] || '🤝'}
                </span>
                <div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.cardOrg}>
                    {item.role} · {item.organization}
                  </div>
                </div>
              </div>

              <div className={styles.cardMeta}>
                <span className={styles.periodBadge}>{item.period}</span>
                <span className={styles.locationText}>📍 {item.location}</span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.summaryText}>{item.summary}</p>

              <div className={styles.impactHeading}>Key Contributions &amp; Outcomes</div>
              <ul className={styles.impactList}>
                {item.keyImpacts.map((imp, idx) => (
                  <li key={idx} className={styles.impactItem}>
                    <span className={styles.impactBullet} aria-hidden="true">
                      ✔
                    </span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.tagsRow}>
                {item.tags.map((t) => (
                  <span key={t} className={styles.tagPill}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSec}>
          <img
            src="/xp_icons/Network Computers.ico"
            alt=""
            width={12}
            height={12}
          />
          {filtered.length} initiatives
        </span>
        <span className={styles.statusSec}>Category: {selectedCat}</span>
        <span className={styles.statusSec}>Status: Active Contributor</span>
      </div>
    </div>
  );
}
