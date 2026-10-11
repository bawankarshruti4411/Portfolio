import { useRef, useCallback } from 'react';
import styles from './Window.module.css';

// ─── Icons for the three title-bar buttons ───────────────────────────────
function MinimizeIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <rect x="0" y="6" width="8" height="2" fill="currentColor" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="7.5" height="7.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <rect x="2" y="0" width="7" height="7" stroke="currentColor" strokeWidth="1.2" />
      <rect x="0" y="2" width="7" height="7" fill="#d4d0c8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <line x1="0.5" y1="0.5" x2="7.5" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7.5" y1="0.5" x2="0.5" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Main Window component ─────────────────────────────────────────────
export default function Window({
  id,
  title,
  icon,
  isMinimized,
  isMaximized,
  position,
  size,
  zIndex,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  menuItems = [],
  children,
}) {
  const dragging = useRef(false);
  const TASKBAR_H = 42;

  const w = size?.w ?? 620;
  const h = size?.h ?? 480;

  // ── Drag handler attached to the title bar ─────────────────────────
  const handleTitleBarMouseDown = useCallback(
    (e) => {
      // Ignore clicks on the control buttons
      if (e.target.closest('button')) return;
      if (isMaximized) return;
      e.preventDefault();
      onFocus();

      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;
      dragging.current = true;

      const onMove = (ev) => {
        if (!dragging.current) return;
        const nx = Math.max(0, Math.min(ev.clientX - startX, window.innerWidth - w));
        const ny = Math.max(0, Math.min(ev.clientY - startY, window.innerHeight - TASKBAR_H - 30));
        onPositionChange({ x: nx, y: ny });
      };

      const onUp = () => {
        dragging.current = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMaximized, position?.x, position?.y, w, onFocus, onPositionChange]
  );

  // ── Collapsed to taskbar → render nothing ──────────────────────────
  if (isMinimized) return null;

  const windowStyle = isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: `calc(100vh - ${TASKBAR_H}px)`,
        zIndex,
      }
    : {
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: w,
        height: h,
        zIndex,
      };

  const activeCls = isActive ? styles.active : styles.inactive;

  return (
    <div
      className={`${styles.window} ${activeCls}`}
      style={windowStyle}
      onMouseDown={onFocus}
    >
      {/* ── Title Bar ── */}
      <div
        className={`${styles.titleBar} ${isActive ? styles.titleBarActive : styles.titleBarInactive}`}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className={styles.titleLeft}>
          <span className={styles.titleIcon} aria-hidden="true">
            {typeof icon === 'string' && (icon.startsWith('/') || icon.includes('.')) ? (
              <img
                src={icon}
                alt=""
                width={16}
                height={16}
                className={styles.titleIcoImg}
                draggable={false}
              />
            ) : (
              icon
            )}
          </span>
          <span className={styles.titleText}>{title}</span>
        </div>

        <div className={styles.titleButtons} onMouseDown={(e) => e.stopPropagation()}>
          <button
            className={`${styles.winBtn} ${styles.minimizeBtn}`}
            onClick={onMinimize}
            title="Minimize"
            aria-label="Minimize window"
          >
            <MinimizeIcon />
          </button>
          <button
            className={`${styles.winBtn} ${styles.maximizeBtn}`}
            onClick={onMaximize}
            title={isMaximized ? 'Restore' : 'Maximize'}
            aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
          >
            {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          </button>
          <button
            className={`${styles.winBtn} ${styles.closeBtn}`}
            onClick={onClose}
            title="Close"
            aria-label="Close window"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* ── Optional Menu Bar ── */}
      {menuItems.length > 0 && (
        <div className={styles.menuBar} role="menubar">
          {menuItems.map((item) => (
            <button key={item} className={styles.menuItem} role="menuitem">
              {item}
            </button>
          ))}
        </div>
      )}

      {/* ── Content Area ── */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
