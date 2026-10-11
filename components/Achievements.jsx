/* eslint-disable @next/next/no-img-element */
import { useState, useMemo } from 'react';
import { achievements } from '../data/siteData';
import styles from './Achievements.module.css';

const CATEGORIES = ['All', 'Hackathons', 'Academics', 'Analytics', 'Research'];

export default function AchievementsContent() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedId, setSelectedId] = useState(achievements[0]?.id);

  const filtered = useMemo(() => {
    if (selectedCat === 'All') return achievements;
    return achievements.filter((a) => a.category === selectedCat);
  }, [selectedCat]);

  // Ensure an item is always selected when filtering
  const currentItem = useMemo(() => {
    return filtered.find((a) => a.id === selectedId) || filtered[0];
  }, [filtered, selectedId]);

  return (
    <div className={styles.achievements}>
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
            src="/xp_icons/Activate Windows.ico"
            alt=""
            width={16}
            height={16}
            style={{ verticalAlign: 'middle', marginRight: 5 }}
          />
          <span>My Computer &gt; Shruti Bawankar &gt; Hall of Fame &gt; {selectedCat}</span>
        </div>
        <button className={styles.goBtn}>Go</button>
      </div>

      {/* ── Main Area ── */}
      <div className={styles.mainArea}>
        {/* Left list */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span>🏆</span>
            <span>Honors &amp; Awards ({filtered.length})</span>
          </div>
          <div className={styles.list} role="listbox" aria-label="Achievements list">
            {filtered.map((item) => {
              const isSelected = item.id === currentItem?.id;
              return (
                <button
                  key={item.id}
                  className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
                  onClick={() => setSelectedId(item.id)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className={styles.itemBadge} aria-hidden="true">
                    {item.badge}
                  </span>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemMeta}>
                      {item.organization} · {item.date}
                    </span>
                    <span className={styles.itemRank}>{item.rank}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right detail */}
        <div className={styles.detailPane}>
          {currentItem && (
            <>
              {/* Banner */}
              <div className={styles.banner}>
                <div className={styles.bannerIcon} aria-hidden="true">
                  {currentItem.badge}
                </div>
                <div className={styles.bannerDetails}>
                  <h2 className={styles.bannerTitle}>{currentItem.title}</h2>
                  <div className={styles.bannerMeta}>
                    {currentItem.organization} · {currentItem.date}
                  </div>
                  <div className={styles.rankBadge}>
                    <span>⭐</span>
                    <span>{currentItem.rank}</span>
                  </div>
                </div>
              </div>

              {/* Key metric */}
              {currentItem.metric && (
                <div className={styles.metricRow}>
                  <div className={styles.metricValue}>{currentItem.metric.value}</div>
                  <div className={styles.metricLabel}>{currentItem.metric.label}</div>
                </div>
              )}

              {/* Summary */}
              <div className={styles.section}>
                <div className={styles.sectionHeading}>Citation &amp; Overview</div>
                <p className={styles.summaryText}>{currentItem.summary}</p>
              </div>

              {/* Highlights */}
              <div className={styles.section}>
                <div className={styles.sectionHeading}>Key Highlights &amp; Evaluation</div>
                <ul className={styles.highlightList}>
                  {currentItem.highlights.map((h, idx) => (
                    <li key={idx} className={styles.highlightItem}>
                      <span className={styles.highlightDot} aria-hidden="true">
                        ✔
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified badge */}
              {currentItem.verified && (
                <div className={styles.verifiedBadge}>
                  <span>🔒</span>
                  <span>Officially recognized &amp; verified distinction</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSec}>
          <img
            src="/xp_icons/Activate Windows.ico"
            alt=""
            width={12}
            height={12}
          />
          {filtered.length} honors
        </span>
        <span className={styles.statusSec}>Category: {selectedCat}</span>
        <span className={styles.statusSec}>
          Selection: {currentItem?.rank}
        </span>
      </div>
    </div>
  );
}
