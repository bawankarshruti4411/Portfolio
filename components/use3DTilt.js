import { useState, useRef } from 'react';

/**
 * use3DTilt
 * Reusable React hook for calculating interactive 3D card tilt based on mouse position.
 * @param {number} maxRotation - Maximum tilt rotation in degrees.
 * @returns {object} - { ref, style, handleMouseMove, handleMouseLeave }
 */
export default function use3DTilt(maxRotation = 8) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Mouse coordinates relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Center point of the card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation angles
    const rotateX = ((centerY - y) / centerY) * maxRotation;
    const rotateY = ((x - centerX) / centerX) * maxRotation;
    
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.08s ease-out',
      zIndex: 10,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
    });
  };

  return { ref, style, handleMouseMove, handleMouseLeave };
}
