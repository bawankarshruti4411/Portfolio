/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { resumeData } from '../data/siteData';
import styles from './ResumeDoc.module.css';

export default function ResumeDoc() {
  const {
    name,
    location,
    phone,
    email,
    links,
    summary,
    experience,
    projects,
    education,
    skills,
    certifications,
    leadershipAndAchievements,
  } = resumeData;

  return (
    <div className={styles.paper} id="printable-resume">
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.name}>{name}</h1>
        <div className={styles.contactLine}>
          <span className={styles.contactItem}>{location}</span>
          <span className={styles.separator}>|</span>
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className={styles.contactItem}>
            {phone}
          </a>
          <span className={styles.separator}>|</span>
          <a href={`mailto:${email}`} className={`${styles.contactItem} ${styles.contactLink}`}>
            {email}
          </a>
        </div>
        <div className={styles.contactLine}>
          {links.map((link, idx) => (
            <React.Fragment key={link.label}>
              {idx > 0 && <span className={styles.separator}>|</span>}
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className={`${styles.contactItem} ${styles.contactLink}`}
              >
                {link.display}
              </a>
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Professional Summary */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>PROFESSIONAL SUMMARY</div>
        <p className={styles.summaryText}>{summary}</p>
      </section>

      {/* Experience */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>EXPERIENCE</div>
        {experience.map((exp, idx) => (
          <div key={idx} className={styles.itemBlock}>
            <div className={styles.itemHeader}>
              <span className={styles.itemTitle}>{exp.role}</span>
              <span className={styles.itemDate}>{exp.period}</span>
            </div>
            <div className={styles.itemSubtitle}>{exp.company}</div>
            <ul className={styles.bulletList}>
              {exp.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className={styles.bulletItem}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>PROJECTS</div>
        {projects.map((proj, idx) => (
          <div key={idx} className={styles.itemBlock}>
            <div className={styles.itemHeader}>
              <span className={styles.itemTitle}>{proj.title}</span>
            </div>
            <div className={styles.itemMeta}>
              <span className={styles.metaTech}>Technologies: {proj.technologies}</span>
              {proj.liveUrl && (
                <>
                  {' '}| Live:{' '}
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.metaLink}
                  >
                    {proj.liveDisplay || proj.liveUrl}
                  </a>
                </>
              )}
            </div>
            <ul className={styles.bulletList}>
              {proj.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className={styles.bulletItem}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>EDUCATION</div>
        {education.map((edu, idx) => (
          <div key={idx} className={styles.itemBlock}>
            <div className={styles.itemHeader}>
              <span className={styles.itemTitle}>{edu.degree}</span>
              <span className={styles.itemDate}>{edu.period}</span>
            </div>
            <div className={styles.itemSubtitle}>
              {edu.institution}
              {edu.specialization ? ` | ${edu.specialization}` : ''}
            </div>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>SKILLS</div>
        {skills.map((skillGroup, idx) => (
          <div key={idx} className={styles.skillRow}>
            <span className={styles.skillLabel}>{skillGroup.label}: </span>
            <span>{skillGroup.items}</span>
          </div>
        ))}
      </section>

      {/* Certifications */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>CERTIFICATIONS</div>
        <ul className={styles.bulletList}>
          {certifications.map((cert, idx) => (
            <li key={idx} className={styles.bulletItem}>
              {cert}
            </li>
          ))}
        </ul>
      </section>

      {/* Leadership & Achievements */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>LEADERSHIP AND ACHIEVEMENTS</div>
        <ul className={styles.bulletList}>
          {leadershipAndAchievements.map((item, idx) => (
            <li key={idx} className={styles.bulletItem}>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
