/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { projects } from '../data/siteData';
import styles from './Projects.module.css';

const CATEGORY_ICONS = {
  Python: '🐍', SQL: '🗄️', 'Power BI': '📊', BigQuery: '☁️', Looker: '🔍',
  dbt: '🔧', R: '📈', Tableau: '🎨', 'Scikit-learn': '🤖', Statistics: '📐',
  'Time Series': '📅', 'A/B Testing': '🧪',
};

function tagIcon(tag) {
  return CATEGORY_ICONS[tag] || '🏷️';
}

export default function ProjectsContent() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const proj = projects[selectedIdx];

  return (
    <div className={styles.explorer}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <button className={styles.toolBtn} disabled>⬅ Back</button>
        <button className={styles.toolBtn} disabled>➡ Forward</button>
        <div className={styles.toolSep} />
        <button className={styles.toolBtn}>
          <img src="/xp_icons/Folder Open.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Folders
        </button>
      </div>

      {/* ── Address bar ── */}
      <div className={styles.addressBar}>
        <span className={styles.addressLabel}>Address</span>
        <div className={styles.addressBox}>
          <img src="/xp_icons/My Computer.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 5 }} />
          <span>My Computer &gt; Shruti Bawankar &gt; My Projects</span>
        </div>
        <button className={styles.goBtn}>Go</button>
      </div>

      {/* ── Main explorer area ── */}
      <div className={styles.explorerMain}>
        {/* Left sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <img src="/xp_icons/Folder Closed.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Projects
          </div>
          <div className={styles.fileList}>
            {projects.map((p, i) => (
              <div
                key={p.id}
                className={`${styles.fileItem} ${i === selectedIdx ? styles.fileSelected : ''}`}
                onClick={() => setSelectedIdx(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedIdx(i); }}
                aria-label={`Select project: ${p.title}`}
                aria-pressed={i === selectedIdx}
              >
                <img
                  src="/xp_icons/File.ico"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.fileIcon}
                />
                <span className={styles.fileName}>{p.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Detail pane */}
        <div className={styles.detailPane}>
          {proj && (
            <>
              <div className={styles.detailHeader}>
                <img
                  src="/xp_icons/Disk Image File.ico"
                  alt=""
                  width={32}
                  height={32}
                  className={styles.detailIcon}
                />
                <div>
                  <h2 className={styles.detailTitle}>{proj.title}</h2>
                  <div className={styles.detailMeta}>Project #{selectedIdx + 1} of {projects.length}</div>
                </div>
              </div>

              <div className={styles.detailBody}>
                {/* Key metric */}
                <div className={styles.metricBadge}>
                  <span className={styles.metricVal}>{proj.metric.value}</span>
                  <span className={styles.metricLab}>{proj.metric.label}</span>
                </div>

                {/* Summary */}
                <div className={styles.detailSection}>
                  <div className={styles.detailSectionLabel}>Description</div>
                  <p className={styles.detailDesc}>{proj.summary}</p>
                </div>

                {/* Tags */}
                <div className={styles.detailSection}>
                  <div className={styles.detailSectionLabel}>Technologies</div>
                  <div className={styles.tagList}>
                    {proj.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        <span aria-hidden="true">{tagIcon(tag)}</span> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Open link */}
                <div className={styles.detailSection}>
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.openBtn}
                  >
                    <img src="/xp_icons/Internet Properties.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Open Project
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSection}>
          <img src="/xp_icons/Folder Closed.ico" alt="" width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {projects.length} objects
        </span>
        <span className={styles.statusSection}>{proj?.tags.join(', ')}</span>
        <span className={styles.statusSection}>Key metric: {proj?.metric.value} {proj?.metric.label}</span>
      </div>
    </div>
  );
}
