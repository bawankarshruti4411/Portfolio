import { useState, useCallback, useMemo } from 'react';
import { DesktopContext } from './DesktopContext';
import Window from './Window';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import HeroContent from './Hero';
import AboutContent from './About';
import ProjectsContent from './Projects';
import AchievementsContent from './Achievements';
import CertificatesContent from './Certificates';
import ContributionsContent from './Contributions';
import GalleryContent from './Gallery';
import FAQContent from './FAQAccordion';
import ContactContent from './Footer';
import ResumeContent from './Resume';
import styles from './Desktop.module.css';

// ── Window definitions ──────────────────────────────────────────────────
const WINDOW_DEFS = {
  welcome: {
    title: 'Welcome — Shruti Bawankar',
    icon: '/xp_icons/List File.ico',
    size: { w: 580, h: 480 },
    defaultPos: { x: 120, y: 55 },
  },
  resume: {
    title: 'Resume — Shruti Bawankar.pdf',
    icon: '/xp_icons/List File.ico',
    size: { w: 860, h: 580 },
    defaultPos: { x: 160, y: 35 },
  },
  about: {
    title: 'About Me — Properties',
    icon: '/xp_icons/My Profile Folder.ico',
    size: { w: 700, h: 520 },
    defaultPos: { x: 200, y: 70 },
  },
  projects: {
    title: 'My Projects — Windows Explorer',
    icon: '/xp_icons/Folder Closed.ico',
    size: { w: 840, h: 540 },
    defaultPos: { x: 150, y: 45 },
  },
  achievements: {
    title: 'Achievements & Honors — Hall of Fame',
    icon: '/xp_icons/Activate Windows.ico',
    size: { w: 780, h: 520 },
    defaultPos: { x: 180, y: 55 },
  },
  certificates: {
    title: 'Certificates & Credentials — Document Explorer',
    icon: '/xp_icons/Disk Image File.ico',
    size: { w: 820, h: 540 },
    defaultPos: { x: 210, y: 65 },
  },
  contributions: {
    title: 'Contributions & Activities — Community Hub',
    icon: '/xp_icons/Network Computers.ico',
    size: { w: 760, h: 510 },
    defaultPos: { x: 240, y: 75 },
  },
  gallery: {
    title: 'Photo Gallery — Windows Picture and Fax Viewer',
    icon: '/xp_icons/Camera.ico',
    size: { w: 850, h: 550 },
    defaultPos: { x: 160, y: 50 },
  },
  faq: {
    title: 'Help and Support Center',
    icon: '/xp_icons/User Support.ico',
    size: { w: 680, h: 510 },
    defaultPos: { x: 240, y: 80 },
  },
  contact: {
    title: 'Network & Contact',
    icon: '/xp_icons/Internet Properties.ico',
    size: { w: 520, h: 420 },
    defaultPos: { x: 280, y: 100 },
  },
};

const DESKTOP_ICONS = [
  { id: 'welcome',       label: 'Welcome.txt',   icon: '/xp_icons/List File.ico' },
  { id: 'resume',        label: 'Resume.pdf',    icon: '/xp_icons/List File.ico' },
  { id: 'about',         label: 'About Me',      icon: '/xp_icons/My Profile Folder.ico' },
  { id: 'projects',      label: 'My Projects',   icon: '/xp_icons/Folder Closed.ico' },
  { id: 'achievements',  label: 'Achievements',  icon: '/xp_icons/Activate Windows.ico' },
  { id: 'certificates',  label: 'Certificates',  icon: '/xp_icons/Disk Image File.ico' },
  { id: 'contributions', label: 'Contributions', icon: '/xp_icons/Network Computers.ico' },
  { id: 'gallery',       label: 'Photo Gallery', icon: '/xp_icons/Camera.ico' },
  { id: 'faq',           label: 'Help & FAQ',    icon: '/xp_icons/User Support.ico' },
  { id: 'contact',       label: 'Contact',       icon: '/xp_icons/Internet Properties.ico' },
];

const CONTENT_MAP = {
  welcome:       HeroContent,
  resume:        ResumeContent,
  about:         AboutContent,
  projects:      ProjectsContent,
  achievements:  AchievementsContent,
  certificates:  CertificatesContent,
  contributions: ContributionsContent,
  gallery:       GalleryContent,
  faq:           FAQContent,
  contact:       ContactContent,
};

// ── Initial window state ────────────────────────────────────────────────
function buildInitialWindows() {
  return Object.fromEntries(
    Object.entries(WINDOW_DEFS).map(([id, def], idx) => [
      id,
      {
        isOpen:      id === 'welcome',  // Welcome opens on boot
        isMinimized: false,
        isMaximized: false,
        position:    { ...def.defaultPos },
        zIndex:      id === 'welcome' ? 2 : 1,
        icon:        DESKTOP_ICONS.find((i) => i.id === id)?.icon ?? '🪟',
        title:       def.title,
      },
    ])
  );
}

// ── Desktop shell ───────────────────────────────────────────────────────
export default function Desktop() {
  const [windows, setWindows] = useState(buildInitialWindows);
  const [topZ, setTopZ] = useState(10);

  // Bring a window to the front
  const bringToFront = useCallback((id) => {
    setTopZ((z) => {
      const newZ = z + 1;
      setWindows((w) => ({ ...w, [id]: { ...w[id], zIndex: newZ } }));
      return newZ;
    });
  }, []);

  // Open (or restore) a window
  const openWindow = useCallback((id) => {
    setTopZ((z) => {
      const newZ = z + 1;
      setWindows((w) => ({
        ...w,
        [id]: { ...w[id], isOpen: true, isMinimized: false, zIndex: newZ },
      }));
      return newZ;
    });
  }, []);

  const closeWindow    = useCallback((id) => setWindows((w) => ({ ...w, [id]: { ...w[id], isOpen: false } })), []);
  const minimizeWindow = useCallback((id) => setWindows((w) => ({ ...w, [id]: { ...w[id], isMinimized: true } })), []);
  const maximizeWindow = useCallback((id) => setWindows((w) => ({ ...w, [id]: { ...w[id], isMaximized: !w[id].isMaximized } })), []);
  const updatePos      = useCallback((id, pos) => setWindows((w) => ({ ...w, [id]: { ...w[id], position: pos } })), []);

  // Which window is currently on top?
  const activeWindowId = useMemo(
    () =>
      Object.entries(windows)
        .filter(([, w]) => w.isOpen && !w.isMinimized)
        .sort((a, b) => b[1].zIndex - a[1].zIndex)[0]?.[0] ?? null,
    [windows]
  );

  // Context value for child windows to call openWindow etc.
  const ctxValue = useMemo(
    () => ({ openWindow, closeWindow, minimizeWindow }),
    [openWindow, closeWindow, minimizeWindow]
  );

  return (
    <DesktopContext.Provider value={ctxValue}>
      <div
        className={styles.desktop}
        onClick={() => { /* deselect icons */ }}
        aria-label="Desktop"
      >
        {/* ── Icon grid ── */}
        <div className={styles.iconCol} role="list" aria-label="Desktop icons">
          {DESKTOP_ICONS.map((icon) => (
            <div key={icon.id} role="listitem">
              <DesktopIcon {...icon} onOpen={openWindow} />
            </div>
          ))}
        </div>

        {/* ── Windows ── */}
        {Object.entries(windows).map(([id, win]) => {
          if (!win.isOpen) return null;
          const def = WINDOW_DEFS[id];
          const ContentComponent = CONTENT_MAP[id];

          return (
            <Window
              key={id}
              id={id}
              title={win.title}
              icon={win.icon}
              isMinimized={win.isMinimized}
              isMaximized={win.isMaximized}
              position={win.position}
              size={def.size}
              zIndex={win.zIndex}
              isActive={id === activeWindowId}
              onClose={() => closeWindow(id)}
              onMinimize={() => minimizeWindow(id)}
              onMaximize={() => maximizeWindow(id)}
              onFocus={() => bringToFront(id)}
              onPositionChange={(pos) => updatePos(id, pos)}
            >
              <ContentComponent />
            </Window>
          );
        })}

        {/* ── Taskbar ── */}
        <Taskbar
          windows={windows}
          onOpenWindow={openWindow}
          onMinimizeWindow={minimizeWindow}
        />
      </div>
    </DesktopContext.Provider>
  );
}
