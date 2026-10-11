/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from 'react';
import ResumeDoc from './ResumeDoc';
import { resumeData } from '../data/siteData';
import styles from './Resume.module.css';

export default function ResumeContent() {
  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleSavePdf = useCallback(() => {
    // In all modern browsers (Chrome, Edge, Firefox, Safari), Print dialog defaults or provides "Save as PDF"
    window.print();
  }, []);

  const handleOpenTab = useCallback(() => {
    window.open('/resume', '_blank', 'noopener,noreferrer');
  }, []);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 150));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 70));
  const handleZoomReset = () => setZoom(100);

  const handleCopyText = useCallback(() => {
    const textContent = `
${resumeData.name}
${resumeData.location} | ${resumeData.phone} | ${resumeData.email}
${resumeData.links.map((l) => `${l.label}: ${l.display}`).join(' | ')}

PROFESSIONAL SUMMARY
${resumeData.summary}

EXPERIENCE
${resumeData.experience
  .map(
    (e) => `${e.role} — ${e.company} (${e.period})\n` + e.bullets.map((b) => `• ${b}`).join('\n')
  )
  .join('\n\n')}

PROJECTS
${resumeData.projects
  .map(
    (p) =>
      `${p.title}\nTechnologies: ${p.technologies}${p.liveUrl ? ` | Live: ${p.liveUrl}` : ''}\n` +
      p.bullets.map((b) => `• ${b}`).join('\n')
  )
  .join('\n\n')}

EDUCATION
${resumeData.education
  .map(
    (edu) =>
      `${edu.degree} (${edu.period})\n${edu.institution}${edu.specialization ? ` | ${edu.specialization}` : ''}`
  )
  .join('\n\n')}

SKILLS
${resumeData.skills.map((s) => `${s.label}: ${s.items}`).join('\n')}

CERTIFICATIONS
${resumeData.certifications.map((c) => `• ${c}`).join('\n')}

LEADERSHIP AND ACHIEVEMENTS
${resumeData.leadershipAndAchievements.map((a) => `• ${a}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }, []);

  return (
    <div className={styles.resumeViewer}>
      {/* ── Top XP Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <button
            className={`${styles.xpToolBtn} ${styles.xpToolBtnPrimary}`}
            onClick={handlePrint}
            title="Print Resume (Ctrl+P)"
          >
            <span className={styles.btnIcon}>🖨️</span>
            <span>Print Resume</span>
          </button>

          <button
            className={`${styles.xpToolBtn} ${styles.xpToolBtnPrimary}`}
            onClick={handleSavePdf}
            title="Save as PDF using Print dialog"
          >
            <span className={styles.btnIcon}>💾</span>
            <span>Save as PDF</span>
          </button>

          <button
            className={styles.xpToolBtn}
            onClick={handleOpenTab}
            title="Open resume in a clean standalone tab"
          >
            <span className={styles.btnIcon}>↗️</span>
            <span>Open in New Tab</span>
          </button>

          <div className={styles.toolDivider} />

          <button
            className={styles.xpToolBtn}
            onClick={handleCopyText}
            title="Copy formatted resume text to clipboard"
          >
            <span className={styles.btnIcon}>📋</span>
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          {copied && <span className={styles.copyToast}>✓ Copied to clipboard!</span>}
        </div>

        {/* Zoom controls */}
        <div className={styles.toolGroup}>
          <button
            className={styles.xpToolBtn}
            onClick={handleZoomOut}
            title="Zoom Out"
            disabled={zoom <= 70}
          >
            <span className={styles.btnIcon}>−</span>
          </button>
          <span className={styles.zoomLabel}>{zoom}%</span>
          <button
            className={styles.xpToolBtn}
            onClick={handleZoomIn}
            title="Zoom In"
            disabled={zoom >= 150}
          >
            <span className={styles.btnIcon}>+</span>
          </button>
          <button
            className={styles.xpToolBtn}
            onClick={handleZoomReset}
            title="Reset Zoom to 100%"
          >
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ── Document Canvas ── */}
      <div className={styles.docWorkspace}>
        <div
          className={styles.docScaleWrapper}
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <ResumeDoc />
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSection}>
          <img
            src="/xp_icons/List File.ico"
            alt=""
            width={14}
            height={14}
            style={{ verticalAlign: 'middle', marginRight: 4 }}
          />
          Shruti_Bawankar_Resume.pdf
        </span>
        <span className={`${styles.statusSection} ${styles.statusRight}`}>
          Page 1 of 1
        </span>
        <span className={`${styles.statusSection} ${styles.statusRight}`}>
          {zoom}%
        </span>
      </div>
    </div>
  );
}
