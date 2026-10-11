import { useEffect, useState } from 'react';
import { profile } from '../data/siteData';
import styles from './ClockWidget.module.css';

function getFormattedTime(timeZone) {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return new Date().toLocaleTimeString('en-US', { hour12: true });
  }
}

export default function ClockWidget() {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(getFormattedTime(profile.timezone));
    const interval = setInterval(() => {
      setTime(getFormattedTime(profile.timezone));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.clockCard}>
      <div className={styles.statusRow}>
        <span className={styles.onlineDot} aria-hidden="true" />
        <span className={styles.statusText}>Online now</span>
      </div>

      <div className={styles.timeDisplay} aria-live="off">
        {time}
      </div>

      <div className={styles.locationText}>{profile.location}</div>
    </div>
  );
}
