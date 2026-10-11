/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from 'react';
import { profile } from '../data/siteData';
import styles from './Taskbar.module.css';

// ── Start Menu overlay ─────────────────────────────────────────────────
function StartMenu({ onOpenWindow, onClose }) {
  const primaryApps = [
    { id: 'welcome', label: 'Welcome Document', desc: 'Overview & introduction', icon: '/xp_icons/List File.ico' },
    { id: 'resume', label: 'Resume / CV (PDF)', desc: 'View, print & save resume', icon: '/xp_icons/List File.ico' },
    { id: 'about', label: 'About Me', desc: 'Skills & bio properties', icon: '/xp_icons/My Profile Folder.ico' },
    { id: 'projects', label: 'My Projects Explorer', desc: 'Portfolio work directory', icon: '/xp_icons/Folder Closed.ico' },
    { id: 'achievements', label: 'Achievements & Honors', desc: 'Hall of fame & awards', icon: '/xp_icons/Activate Windows.ico' },
    { id: 'certificates', label: 'Certificates & Credentials', desc: 'Verified course documents', icon: '/xp_icons/Disk Image File.ico' },
    { id: 'contributions', label: 'Contributions & Activities', desc: 'Clubs, events & volunteering', icon: '/xp_icons/Network Computers.ico' },
    { id: 'gallery', label: 'Photo Gallery', desc: 'Academic & event pictures', icon: '/xp_icons/Camera.ico' },
    { id: 'faq', label: 'Help and Support Center', desc: 'FAQ & guidance', icon: '/xp_icons/User Support.ico' },
    { id: 'contact', label: 'Network & Contact', desc: 'Email & social connections', icon: '/xp_icons/Internet Properties.ico' },
  ];

  const systemPlaces = [
    { id: 'resume', label: 'My Resume (PDF)', icon: '/xp_icons/List File.ico' },
    { id: 'projects', label: 'My Computer', icon: '/xp_icons/My Computer.ico' },
    { id: 'gallery', label: 'My Pictures', icon: '/xp_icons/Camera.ico' },
    { id: 'certificates', label: 'My Documents', icon: '/xp_icons/Disk Image File.ico' },
    { id: 'contributions', label: 'My Network Places', icon: '/xp_icons/My Network Places.ico' },
    { id: 'achievements', label: 'System Honors', icon: '/xp_icons/System Properties.ico' },
    { id: 'about', label: 'User Accounts', icon: '/xp_icons/User Accounts.ico' },
  ];

  return (
    <>
      <div className={styles.startMenuBackdrop} onClick={onClose} />
      <div className={styles.startMenu} role="menu" aria-label="Start menu">
        {/* Top banner */}
        <div className={styles.startMenuTop}>
          <div className={styles.startMenuAvatarWrap}>
            <img
              src="/profile_portrait.png"
              alt={profile.name}
              className={styles.startMenuAvatarImg}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className={styles.startMenuAvatarFallback} aria-hidden="true">
              {profile.initials}
            </div>
          </div>
          <div>
            <div className={styles.startMenuName}>{profile.name}</div>
            <div className={styles.startMenuRole}>{profile.role}</div>
          </div>
        </div>

        {/* Programme list with authentic dual-column XP layout */}
        <div className={styles.startMenuBody}>
          {/* Left column: main apps */}
          <div className={styles.startMenuLeft}>
            <div className={styles.startMenuSectionLabel}>Frequent Programs</div>
            {primaryApps.map((item) => (
              <button
                key={item.id}
                className={styles.startMenuItem}
                role="menuitem"
                onClick={() => {
                  onOpenWindow(item.id);
                  onClose();
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  width={32}
                  height={32}
                  className={styles.startMenuItemIco}
                />
                <div className={styles.startMenuItemTextWrap}>
                  <span className={styles.startMenuItemBold}>{item.label}</span>
                  <span className={styles.startMenuItemDesc}>{item.desc}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right column: places */}
          <div className={styles.startMenuRight}>
            <div className={styles.startMenuSectionLabelRight}>Places & Settings</div>
            {systemPlaces.map((item, idx) => (
              <button
                key={idx}
                className={styles.startMenuRightItem}
                role="menuitem"
                onClick={() => {
                  onOpenWindow(item.id);
                  onClose();
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  width={24}
                  height={24}
                  className={styles.startMenuRightIco}
                />
                <span className={styles.startMenuRightLabel}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer row */}
        <div className={styles.startMenuFooter}>
          <a
            href={`mailto:${profile.email}`}
            className={styles.startMenuFooterBtn}
          >
            <img src="/xp_icons/Internet Properties.ico" alt="" width={16} height={16} />
            <span>{profile.email}</span>
          </a>
          <button className={styles.startMenuFooterBtn} onClick={onClose}>
            <span style={{ color: '#ff4444', fontWeight: 'bold' }}>⏻</span>
            <span>Close Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ── Taskbar app button ─────────────────────────────────────────────────
function TaskbarAppButton({ id, title, icon, isMinimized, onClick }) {
  const isImg = typeof icon === 'string' && (icon.startsWith('/') || icon.includes('.'));

  return (
    <button
      className={`${styles.appBtn} ${!isMinimized ? styles.appBtnActive : ''}`}
      onClick={onClick}
      title={title}
      aria-label={`${title} — ${isMinimized ? 'Click to restore' : 'Click to minimise'}`}
    >
      <span className={styles.appBtnIcon}>
        {isImg ? (
          <img
            src={icon}
            alt=""
            width={16}
            height={16}
            className={styles.appBtnIcoImg}
            draggable={false}
          />
        ) : (
          icon
        )}
      </span>
      <span className={styles.appBtnLabel}>{title}</span>
    </button>
  );
}

// ── Main Taskbar ───────────────────────────────────────────────────────
export default function Taskbar({ windows, onOpenWindow, onMinimizeWindow }) {
  const [startOpen, setStartOpen] = useState(false);
  const [clockTime, setClockTime] = useState('');
  const [clockDate, setClockDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClockTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setClockDate(
        now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleStart = useCallback(() => setStartOpen((s) => !s), []);
  const closeStart = useCallback(() => setStartOpen(false), []);

  // Only show open windows in taskbar
  const openWindows = Object.entries(windows).filter(([, w]) => w.isOpen);

  return (
    <>
      {startOpen && (
        <StartMenu onOpenWindow={onOpenWindow} onClose={closeStart} />
      )}

      <div className={styles.taskbar} role="toolbar" aria-label="Taskbar">
        {/* ── Start button ── */}
        <button
          className={`${styles.startBtn} ${startOpen ? styles.startBtnActive : ''}`}
          onClick={toggleStart}
          aria-expanded={startOpen}
          aria-haspopup="menu"
        >
          <span className={styles.startLogo} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
              <path d="M2 3.5L10.5 2.2V11H2V3.5Z" fill="#F25022" />
              <path d="M12 2L22 0.5V11H12V2Z" fill="#7FBA00" />
              <path d="M2 13H10.5V21.8L2 20.5V13Z" fill="#00A4EF" />
              <path d="M12 13H22V23.5L12 22V13Z" fill="#FFB900" />
            </svg>
          </span>
          <span className={styles.startText}>start</span>
        </button>

        {/* ── Separator ── */}
        <div className={styles.sep} aria-hidden="true" />

        {/* ── Quick Launch Icons ── */}
        <div className={styles.quickLaunch} aria-label="Quick launch">
          <button
            className={styles.quickBtn}
            title="My Projects"
            onClick={() => onOpenWindow('projects')}
          >
            <img src="/xp_icons/Folder Closed.ico" alt="Projects" width={16} height={16} />
          </button>
          <button
            className={styles.quickBtn}
            title="Achievements"
            onClick={() => onOpenWindow('achievements')}
          >
            <img src="/xp_icons/Activate Windows.ico" alt="Achievements" width={16} height={16} />
          </button>
          <button
            className={styles.quickBtn}
            title="Certificates"
            onClick={() => onOpenWindow('certificates')}
          >
            <img src="/xp_icons/Disk Image File.ico" alt="Certificates" width={16} height={16} />
          </button>
          <button
            className={styles.quickBtn}
            title="Photo Gallery"
            onClick={() => onOpenWindow('gallery')}
          >
            <img src="/xp_icons/Camera.ico" alt="Gallery" width={16} height={16} />
          </button>
          <button
            className={styles.quickBtn}
            title="Help & FAQ"
            onClick={() => onOpenWindow('faq')}
          >
            <img src="/xp_icons/User Support.ico" alt="Help" width={16} height={16} />
          </button>
          <button
            className={styles.quickBtn}
            title="Contact"
            onClick={() => onOpenWindow('contact')}
          >
            <img src="/xp_icons/Internet Properties.ico" alt="Contact" width={16} height={16} />
          </button>
        </div>

        <div className={styles.sep} aria-hidden="true" />

        {/* ── Open window buttons ── */}
        <div className={styles.appList}>
          {openWindows.map(([id, win]) => (
            <TaskbarAppButton
              key={id}
              id={id}
              title={win.title}
              icon={win.icon}
              isMinimized={win.isMinimized}
              onClick={() => {
                if (win.isMinimized) {
                  onOpenWindow(id); // restore
                } else {
                  onMinimizeWindow(id); // minimise
                }
              }}
            />
          ))}
        </div>

        {/* ── System Tray ── */}
        <div className={styles.systray} aria-label="System tray">
          <div className={styles.trayIcons}>
            <img
              src="/xp_icons/Earth (fixed).ico"
              alt="Network"
              width={16}
              height={16}
              title="Connected: Internet & Portfolio"
              className={styles.trayIco}
            />
            <img
              src="/xp_icons/Sounds, Speech, and Audio Devices.ico"
              alt="Audio"
              width={16}
              height={16}
              title="Click to play Windows XP Startup Sound"
              className={styles.trayIco}
              onClick={() => {
                const snd = new Audio('/windows-xp-startup.mp3');
                snd.volume = 0.75;
                snd.play().catch(() => {});
              }}
            />
            <span
              className={styles.trayDot}
              title={`Available: ${profile.availability}`}
              aria-label="Available for work"
            />
          </div>
          <div className={styles.trayClock} title={clockDate}>
            {clockTime}
          </div>
        </div>
      </div>
    </>
  );
}
