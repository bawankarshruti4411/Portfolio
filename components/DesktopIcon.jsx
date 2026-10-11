/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useCallback } from 'react';
import styles from './DesktopIcon.module.css';

export default function DesktopIcon({ id, label, icon, onOpen }) {
  const [selected, setSelected] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      setSelected(true);
      clickCount.current += 1;

      if (clickCount.current === 1) {
        // Single click selects, wait for second click for double-click open
        clickTimer.current = setTimeout(() => {
          clickCount.current = 0;
        }, 400);
      } else {
        clearTimeout(clickTimer.current);
        clickCount.current = 0;
        onOpen(id);
      }
    },
    [id, onOpen]
  );

  const handleBlur = useCallback(() => setSelected(false), []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') onOpen(id);
    },
    [id, onOpen]
  );

  const isImageIcon = typeof icon === 'string' && (icon.startsWith('/') || icon.includes('.'));

  return (
    <div
      className={`${styles.icon} ${selected ? styles.selected : ''}`}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open ${label} (double-click)`}
    >
      <div className={styles.iconImg} aria-hidden="true">
        {isImageIcon ? (
          <img
            src={icon}
            alt=""
            width={48}
            height={48}
            className={styles.icoImg}
            draggable={false}
          />
        ) : (
          icon
        )}
      </div>
      <span className={styles.iconLabel}>{label}</span>
    </div>
  );
}
