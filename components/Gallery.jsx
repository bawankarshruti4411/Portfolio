/* eslint-disable @next/next/no-img-element */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { gallery } from '../data/siteData';
import styles from './Gallery.module.css';

const CATEGORIES = ['All', 'Academic', 'Hackathons', 'Events', 'Campus Life', 'Volunteering'];

export default function GalleryContent() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const filtered = useMemo(() => {
    if (selectedCat === 'All') return gallery;
    return gallery.filter((item) => item.category === selectedCat);
  }, [selectedCat]);

  // Adjust index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setZoom(1);
    setRotation(0);
  }, [selectedCat]);

  const currentPhoto = filtered[currentIndex] || filtered[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((idx) => (idx + 1) % filtered.length);
    setZoom(1);
    setRotation(0);
  }, [filtered.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((idx) => (idx - 1 + filtered.length) % filtered.length);
    setZoom(1);
    setRotation(0);
  }, [filtered.length]);

  // Slideshow auto-play interval
  useEffect(() => {
    if (!isPlaying || filtered.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [isPlaying, filtered.length, handleNext]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.75));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  return (
    <div className={styles.galleryApp}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <button
          className={styles.toolBtn}
          onClick={handlePrev}
          disabled={filtered.length <= 1}
          title="Previous Photo"
        >
          ◀ Prev
        </button>
        <button
          className={styles.toolBtn}
          onClick={handleNext}
          disabled={filtered.length <= 1}
          title="Next Photo"
        >
          Next ▶
        </button>
        <div className={styles.toolSep} />
        <button
          className={`${styles.toolBtn} ${isPlaying ? styles.viewerBtnActive : ''}`}
          onClick={() => setIsPlaying((p) => !p)}
          title={isPlaying ? 'Pause Slideshow' : 'Start Slideshow'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play Slideshow'}
        </button>
        <div className={styles.toolSep} />
        <div className={styles.categoryFilter}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterPill} ${selectedCat === cat ? styles.filterPillActive : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Picture Stage ── */}
      <div className={styles.viewport}>
        <div className={styles.imageStage}>
          {currentPhoto && (
            <div
              className={styles.imageWrapper}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
              onClick={() => setLightboxOpen(true)}
              title="Click to expand fullscreen"
            >
              <img
                src={currentPhoto.image}
                alt={currentPhoto.title}
                className={styles.mainImage}
                onError={(e) => {
                  e.currentTarget.src = '/project_viz.png';
                }}
              />
              <div className={styles.imageCaptionBox}>
                <h4 className={styles.imageTitle}>{currentPhoto.title}</h4>
                <div className={styles.imageMeta}>
                  {currentPhoto.date} · 📍 {currentPhoto.location}
                </div>
                <p className={styles.imageDesc}>{currentPhoto.caption}</p>
              </div>
            </div>
          )}
        </div>

        {/* Control bar */}
        <div className={styles.controlBar} role="toolbar" aria-label="Viewer controls">
          <button
            className={styles.viewerBtn}
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom in"
          >
            🔍+
          </button>
          <button
            className={styles.viewerBtn}
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom out"
          >
            🔍-
          </button>
          <button
            className={styles.viewerBtn}
            onClick={() => { setZoom(1); setRotation(0); }}
            title="Actual Size / Reset"
            aria-label="Reset zoom and rotation"
          >
            ↺
          </button>
          <button
            className={styles.viewerBtn}
            onClick={handleRotate}
            title="Rotate Clockwise 90°"
            aria-label="Rotate clockwise"
          >
            ↻
          </button>
          <button
            className={styles.viewerBtn}
            onClick={handlePrev}
            disabled={filtered.length <= 1}
            title="Previous Image"
            aria-label="Previous image"
          >
            ⏮
          </button>
          <button
            className={`${styles.viewerBtn} ${isPlaying ? styles.viewerBtnActive : ''}`}
            onClick={() => setIsPlaying((p) => !p)}
            title={isPlaying ? 'Pause Slideshow' : 'Start Slideshow'}
            aria-label="Toggle slideshow"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            className={styles.viewerBtn}
            onClick={handleNext}
            disabled={filtered.length <= 1}
            title="Next Image"
            aria-label="Next image"
          >
            ⏭
          </button>
          <button
            className={styles.viewerBtn}
            onClick={() => setLightboxOpen(true)}
            title="Full Screen Lightbox"
            aria-label="Open fullscreen lightbox"
          >
            ⛶
          </button>
        </div>

        {/* Filmstrip */}
        <div className={styles.filmstrip} role="listbox" aria-label="Photo filmstrip">
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              className={`${styles.thumbItem} ${idx === currentIndex ? styles.thumbSelected : ''}`}
              onClick={() => {
                setCurrentIndex(idx);
                setZoom(1);
                setRotation(0);
              }}
              role="option"
              aria-selected={idx === currentIndex}
            >
              <img
                src={item.image}
                alt={item.title}
                className={styles.thumbImg}
                onError={(e) => {
                  e.currentTarget.src = '/project_viz.png';
                }}
              />
              <span className={styles.thumbLabel}>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      {lightboxOpen && currentPhoto && (
        <div className={styles.lightboxModal} onClick={() => setLightboxOpen(false)}>
          <button
            className={styles.lightboxClose}
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen view"
          >
            ✕
          </button>
          <img
            src={currentPhoto.image}
            alt={currentPhoto.title}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.src = '/project_viz.png';
            }}
          />
          <div className={styles.lightboxCaption} onClick={(e) => e.stopPropagation()}>
            <strong>{currentPhoto.title}</strong> — {currentPhoto.caption} ({currentPhoto.location}, {currentPhoto.date})
          </div>
        </div>
      )}

      {/* ── Status bar ── */}
      <div className={styles.statusBar}>
        <span className={styles.statusSec}>
          <img
            src="/xp_icons/Camera.ico"
            alt=""
            width={12}
            height={12}
          />
          {currentIndex + 1} of {filtered.length} photos
        </span>
        <span className={styles.statusSec}>Category: {selectedCat}</span>
        <span className={styles.statusSec}>Zoom: {Math.round(zoom * 100)}%</span>
        <span className={styles.statusSec}>
          {isPlaying ? '▶ Slideshow Running' : 'Ready'}
        </span>
      </div>
    </div>
  );
}
