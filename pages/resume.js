/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ResumeDoc from '../components/ResumeDoc';
import { profile } from '../data/siteData';
import styles from '../styles/ResumePage.module.css';

export default function ResumePage() {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <>
      <Head>
        <title>{`${profile.name} — Resume / CV`}</title>
        <meta
          name="description"
          content={`Official resume of ${profile.name} — ${profile.role}. View, print, or save as PDF.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/xp_icons/List File.ico" />
      </Head>

      <div className={styles.container}>
        {/* Floating top bar */}
        <div className={styles.topBar}>
          <Link href="/" className={styles.backLink}>
            <span>🖥️</span>
            <span>Back to Windows XP Desktop</span>
          </Link>

          <div className={styles.titleArea}>
            <span>{profile.name} — Resume</span>
            <span className={styles.badge}>PDF View</span>
          </div>

          <div className={styles.actions}>
            <button
              onClick={handlePrint}
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              title="Print resume or Save as PDF"
            >
              <span>🖨️</span>
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className={`${styles.actionBtn} ${styles.secondaryBtn}`}
              title="Copy link to this resume"
            >
              <span>🔗</span>
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Printable Resume Paper */}
        <div className={styles.docWrapper}>
          <ResumeDoc />
        </div>
      </div>
    </>
  );
}
