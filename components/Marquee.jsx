import styles from './Marquee.module.css';

/**
 * Marquee
 * Infinitely scrolling row of tags. Pass direction="reverse" to drift
 * the opposite way — used to create the dual counter-rotating ticker
 * effect in the About section.
 */
export default function Marquee({ items, direction = 'forward', speed = 28 }) {
  // Duplicate items so the looping animation has no visible seam
  const loopItems = [...items, ...items];

  return (
    <div className={styles.marqueeWrap}>
      <div
        className={`${styles.track} ${direction === 'reverse' ? styles.trackReverse : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {loopItems.map((item, index) => (
          <span className={styles.tag} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
