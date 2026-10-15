/* eslint-disable @next/next/no-img-element */
import { useState, useMemo } from 'react';
import { certificates, profile } from '../data/siteData';
import styles from './Certificates.module.css';

const CATEGORIES = ['All', 'Data Analytics', 'Business Intelligence', 'Machine Learning', 'Databases', 'Programming'];

export default function CertificatesContent() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedId, setSelectedId] = useState(certificates[0]?.id);

  const filtered = useMemo(() => {
    if (selectedCat === 'All') return certificates;
    return certificates.filter((c) => c.category === selectedCat);
  }, [selectedCat]);

  const cert = useMemo(() => {
    return filtered.find((c) => c.id === selectedId) || filtered[0];
  }, [filtered, selectedId]);

  return (
    <div className={styles.certificates}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <button className={styles.toolBtn} disabled>
          ⬅ Back
        </button>
        <button className={styles.toolBtn} disabled>
          ➡ Forward
        </button>
        <div className={styles.toolSep} />
        <button
          className={styles.toolBtn}
          onClick={() => window.print ? window.print() : null}
          title="Print certificate"
        >
          🖨️ Print
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
            src="/Portfolio/xp_icons/List File.ico"
            alt=""
            width={16}
            height={16}
            style={{ verticalAlign: 'middle', marginRight: 5 }}
          />
          <span>My Documents &gt; Credentials &gt; {selectedCat} &gt; {cert?.title || ''}</span>
        </div>
        <button className={styles.goBtn}>Go</button>
      </div>

      {/* ── Main Area ── */}
      <div className={styles.mainArea}>
        {/* Left explorer list */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <img
              src="/xp_icons/Folder Closed.ico"
              alt=""
              width={14}
              height={14}
            />
            <span>Certificates ({filtered.length})</span>
          </div>
          <div className={styles.list} role="listbox" aria-label="Certificates list">
            {filtered.map((item) => {
              const isSelected = item.id === cert?.id;
              return (
                <button
                  key={item.id}
                  className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
                  onClick={() => setSelectedId(item.id)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <img
                    src="/xp_icons/File.ico"
                    alt=""
                    className={styles.docIcon}
                  />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemMeta}>
                      {item.issuer} · {item.issueDate}
                    </span>
                    <span className={styles.itemTag}>{item.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right certificate preview */}
        <div className={styles.previewPane}>
          {cert && (
            <>
              <div className={styles.certDocument}>
                <div className={styles.certWatermark} aria-hidden="true">
                  ★
                </div>

                <div className={styles.certHeader}>
                  <span className={styles.certPreTitle}>Official Certificate of Completion</span>
                  <h3 className={styles.certMainTitle}>Certificate of Achievement</h3>
                  <span className={styles.certIssuer}>Issued by {cert.issuer}</span>
                </div>

                <div className={styles.certDivider} />

                <div className={styles.certRecipientSection}>
                  <span className={styles.certAwardedTo}>This is proudly presented to</span>
                  <div>
                    <span className={styles.certRecipientName}>{profile.name}</span>
                  </div>
                  <div className={styles.certCourseTitle}>
                    For successfully demonstrating proficiency in &ldquo;{cert.title}&rdquo;
                  </div>
                </div>

                <p className={styles.certSummary}>{cert.summary}</p>

                {/* Skills badges */}
                <div className={styles.certSkills}>
                  {cert.skills.map((s) => (
                    <span key={s} className={styles.skillBadge}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Footer seal and details */}
                <div className={styles.certFooter}>
                  <div className={styles.certMetaLeft}>
                    <span className={styles.certMetaLabel}>Credential ID</span>
                    <span className={styles.certMetaVal}>{cert.credentialId}</span>
                    <span className={styles.certMetaLabel} style={{ marginTop: 4 }}>Date of Issue</span>
                    <span className={styles.certMetaVal}>{cert.issueDate}</span>
                  </div>

                  <div className={styles.certSeal} aria-hidden="true" title="Verified Credential">
                    🏅
                  </div>

                  <div className={styles.certMetaRight}>
                    <span className={styles.certMetaLabel}>Verification Status</span>
                    <span className={styles.certMetaVal} style={{ color: '#2e7d32' }}>
                      ✔ Authenticated
                    </span>
                    <span className={styles.certMetaLabel} style={{ marginTop: 4 }}>Issuing Authority</span>
                    <span className={styles.certMetaVal}>{cert.issuer}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className={styles.actionsBar}>
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.verifyBtn}
                >
                  <img
                    src="/Portfolio/xp_icons/Internet Properties.ico"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <span>Verify Credential Online</span>
                </a>

                {cert.image && (
                  <a
                    href={cert.image}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.secondaryBtn}
                  >
                    <span>🖼️ View Document Asset</span>
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSec}>
          <img
            src="/Portfolio/xp_icons/List File.ico"
            alt=""
            width={12}
            height={12}
          />
          {filtered.length} certificates
        </span>
        <span className={styles.statusSec}>Category: {selectedCat}</span>
        <span className={styles.statusSec}>
          Credential ID: {cert?.credentialId}
        </span>
      </div>
    </div>
  );
}
