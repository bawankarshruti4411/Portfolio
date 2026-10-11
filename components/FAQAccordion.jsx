/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { faqItems } from '../data/siteData';
import styles from './FAQAccordion.module.css';

export default function FAQContent() {
  const [selectedId, setSelectedId] = useState(faqItems[0]?.id ?? null);
  const selectedItem = faqItems.find((f) => f.id === selectedId);

  return (
    <div className={styles.helpCenter}>
      {/* ── Help toolbar ── */}
      <div className={styles.toolbar}>
        <button className={styles.toolBtn} disabled>⬅ Back</button>
        <button className={styles.toolBtn} disabled>➡ Forward</button>
        <div className={styles.toolSep} />
        <button className={styles.toolBtn}>
          <img src="/xp_icons/User Support.ico" alt="" width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Home
        </button>
      </div>

      {/* ── Main layout: contents + reading pane ── */}
      <div className={styles.helpMain}>
        {/* Left: table of contents */}
        <div className={styles.tocPanel}>
          <div className={styles.tocHeader}>
            <img src="/xp_icons/User Support.ico" alt="" width={18} height={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Help &amp; FAQ
          </div>
          <div className={styles.tocList} role="listbox" aria-label="FAQ questions">
            {faqItems.map((item, i) => (
              <div
                key={item.id}
                role="option"
                aria-selected={item.id === selectedId}
                className={`${styles.tocItem} ${item.id === selectedId ? styles.tocSelected : ''}`}
                onClick={() => setSelectedId(item.id)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedId(item.id); }}
              >
                <span className={styles.tocNum}>{i + 1}.</span>
                <span className={styles.tocText}>{item.question}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Right: answer pane */}
        <div className={styles.readingPane}>
          {selectedItem ? (
            <>
              <div className={styles.questionHeader}>
                <img src="/xp_icons/List File.ico" alt="" width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                <h2 className={styles.questionText}>{selectedItem.question}</h2>
              </div>
              <div className={styles.answerBody}>
                <p className={styles.answerText}>{selectedItem.answer}</p>
              </div>
              <div className={styles.helpFooterNote}>
                <img src="/xp_icons/Display.ico" alt="" width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                &nbsp;Was this helpful? &nbsp;
                <button className={styles.inlineBtn}>Yes</button>
                &nbsp;
                <button className={styles.inlineBtn}>No</button>
              </div>
            </>
          ) : (
            <p className={styles.emptyMsg}>Select a question from the left panel.</p>
          )}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSection}>
          <img src="/xp_icons/User Support.ico" alt="" width={14} height={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {faqItems.length} frequently asked questions
        </span>
        <span className={styles.statusSection}>
          {selectedItem ? `Viewing: ${selectedItem.question.slice(0, 40)}…` : ''}
        </span>
      </div>
    </div>
  );
}
