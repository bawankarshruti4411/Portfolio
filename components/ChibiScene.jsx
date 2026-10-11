import { useEffect, useRef, useState } from 'react';
import styles from './ChibiScene.module.css';

/* ═══════════════════════════════════════════════════════════════════════════
   ChibiScene.jsx
   Interactive 3D anime Chibi character (Shruti's avatar) walking on the XP hill.
   Designed with toon materials, lively animations, hair physics,
   sparkle bursts, mouse head-tracking, and finger-gun poses.
   ═══════════════════════════════════════════════════════════════════════════ */

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpAngle(from, to, t) {
  let d = to - from;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return from + d * t;
}

// Gentle rolling hill surface function
function getGroundY(x, z) {
  return (
    Math.sin(x * 0.22) * 0.55 +
    Math.cos(z * 0.18) * 0.42 +
    Math.sin(x * 0.11 + z * 0.14) * 0.32 +
    Math.cos(x * 0.08 - z * 0.09) * 0.18
  );
}

/* ─── Procedural Textures for Eyes, Blush & Stars ───────────────────────── */
function createEyeTexture(THREE) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const ctx = cv.getContext('2d');

  // Eye white background
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(128, 128, 110, 110, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iris gradient
  const irisGrad = ctx.createLinearGradient(128, 40, 128, 220);
  irisGrad.addColorStop(0, '#120d18');
  irisGrad.addColorStop(0.4, '#2d1f3d');
  irisGrad.addColorStop(0.7, '#6b4423');
  irisGrad.addColorStop(1, '#d4883b');

  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.ellipse(135, 130, 85, 95, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  ctx.fillStyle = '#08050a';
  ctx.beginPath();
  ctx.ellipse(135, 135, 45, 52, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bottom iris rim glow
  ctx.strokeStyle = '#f5af5d';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(135, 150, 60, 65, 0, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Big primary sparkle catchlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(105, 95, 28, 34, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Small secondary star catchlight
  ctx.beginPath();
  ctx.ellipse(165, 160, 14, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBlushTexture(THREE) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const ctx = cv.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 5, 64, 64, 60);
  grad.addColorStop(0, 'rgba(255, 110, 130, 0.75)');
  grad.addColorStop(0.5, 'rgba(255, 130, 150, 0.4)');
  grad.addColorStop(1, 'rgba(255, 140, 160, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStarTexture(THREE) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);

  ctx.shadowBlur = 16;
  ctx.shadowColor = '#FFA500';
  ctx.fillStyle = '#FFE033';

  // 4-pointed golden diamond star (matches wallpaper)
  ctx.beginPath();
  ctx.moveTo(64, 8);
  ctx.bezierCurveTo(64, 45, 45, 64, 8, 64);
  ctx.bezierCurveTo(45, 64, 64, 83, 64, 120);
  ctx.bezierCurveTo(64, 83, 83, 64, 120, 64);
  ctx.bezierCurveTo(83, 64, 64, 45, 64, 8);
  ctx.closePath();
  ctx.fill();

  // White inner core
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(64, 64, 12, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ─── Build Rich 3D Chibi Model ─────────────────────────────────────────── */
function buildChibiModel(THREE) {
  const root = new THREE.Group();

  const eyeTex = createEyeTexture(THREE);
  const blushTex = createBlushTexture(THREE);
  const starTex = createStarTexture(THREE);

  // ── Materials ──
  const mSkin = new THREE.MeshToonMaterial({ color: 0xF7D0BA });
  const mHair = new THREE.MeshToonMaterial({ color: 0x16151D });
  const mHairHighlight = new THREE.MeshToonMaterial({ color: 0x2E2A3C });
  const mTop = new THREE.MeshToonMaterial({ color: 0x1A1926 });
  const mPants = new THREE.MeshToonMaterial({ color: 0x222638 });
  const mShoe = new THREE.MeshToonMaterial({ color: 0x2E54B8 });
  const mShoeSole = new THREE.MeshToonMaterial({ color: 0xFFFFFF });
  const mEyeMesh = new THREE.MeshBasicMaterial({ map: eyeTex, transparent: true });
  const mDarkLine = new THREE.MeshBasicMaterial({ color: 0x1A1016 });
  const mMouthIn = new THREE.MeshToonMaterial({ color: 0xB83A4A });
  const mTongue = new THREE.MeshToonMaterial({ color: 0xFF7A8A });
  const mGlassFrame = new THREE.MeshToonMaterial({ color: 0xD8DFEE });
  const mGlassLens = new THREE.MeshPhysicalMaterial({
    color: 0xE8F4FF,
    transparent: true,
    opacity: 0.28,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 0.2,
  });
  const mBlush = new THREE.MeshBasicMaterial({ map: blushTex, transparent: true, depthWrite: false });
  const mGold = new THREE.MeshToonMaterial({ color: 0xFFD23F });

  /* ── HEAD GROUP ───────────────────────────────────────────────────────── */
  const headGrp = new THREE.Group();
  headGrp.position.y = 1.02;
  root.add(headGrp);

  // Cute chibi head sphere (slightly wider cheeks)
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 20), mSkin);
  headMesh.scale.set(1.08, 1.0, 0.98);
  headGrp.add(headMesh);

  // Chubby cheeks
  [-0.24, 0.24].forEach((cx) => {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), mSkin);
    cheek.position.set(cx, -0.08, 0.24);
    cheek.scale.set(1, 0.8, 0.7);
    headGrp.add(cheek);
  });

  // ── HAIR ──────────────────────────────────────────────────────────────
  const hairGrp = new THREE.Group();
  headGrp.add(hairGrp);

  // Main hair cap
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.445, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.58),
    mHair
  );
  hairCap.position.set(0, 0.02, -0.02);
  hairGrp.add(hairCap);

  // Cute hair buns / top volume
  const topHair = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), mHair);
  topHair.position.set(0, 0.36, -0.1);
  topHair.scale.set(1.4, 0.6, 1.2);
  hairGrp.add(topHair);

  // Glossy hair highlight ring across top
  const hairHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.028, 8, 24, Math.PI * 0.9),
    mHairHighlight
  );
  hairHalo.position.set(0, 0.26, 0.18);
  hairHalo.rotation.x = 0.55;
  hairHalo.rotation.z = Math.PI;
  hairGrp.add(hairHalo);

  // Front Bangs (layered wavy fringe)
  const bangsConfig = [
    { x: -0.22, y: 0.16, z: 0.36, sx: 0.16, sy: 0.28, sz: 0.12, rz: 0.2 },
    { x: -0.08, y: 0.19, z: 0.40, sx: 0.18, sy: 0.32, sz: 0.14, rz: 0.05 },
    { x: 0.08, y: 0.18, z: 0.40, sx: 0.18, sy: 0.30, sz: 0.14, rz: -0.08 },
    { x: 0.22, y: 0.15, z: 0.36, sx: 0.16, sy: 0.26, sz: 0.12, rz: -0.22 },
  ];
  bangsConfig.forEach((b) => {
    const bang = new THREE.Mesh(new THREE.ConeGeometry(b.sx, b.sy, 8), mHair);
    bang.position.set(b.x, b.y, b.z);
    bang.rotation.set(0.35, 0, b.rz + Math.PI);
    hairGrp.add(bang);
  });

  // Long flowing side locks (twin tendrils framing the face)
  const sideHairGrpL = new THREE.Group();
  sideHairGrpL.position.set(-0.38, 0.05, 0.1);
  hairGrp.add(sideHairGrpL);

  const sideHairGrpR = new THREE.Group();
  sideHairGrpR.position.set(0.38, 0.05, 0.1);
  hairGrp.add(sideHairGrpR);

  [sideHairGrpL, sideHairGrpR].forEach((grp, idx) => {
    const dir = idx === 0 ? -1 : 1;
    for (let i = 0; i < 5; i++) {
      const strand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075 - i * 0.01, 0.065 - i * 0.01, 0.24, 8),
        mHair
      );
      strand.position.set(dir * (0.02 + i * 0.03), -i * 0.2, 0.02 + i * 0.01);
      strand.rotation.set(0.15, 0, dir * (0.12 + i * 0.06));
      grp.add(strand);
    }
  });

  // Voluminous long wavy back hair
  const backHairGrp = new THREE.Group();
  backHairGrp.position.set(0, -0.05, -0.32);
  hairGrp.add(backHairGrp);

  for (let row = 0; row < 5; row++) {
    for (let col = -2; col <= 2; col++) {
      const wave = new THREE.Mesh(
        new THREE.SphereGeometry(0.14 - row * 0.012, 10, 8),
        mHair
      );
      wave.position.set(col * 0.14 + (row % 2 === 0 ? 0.04 : -0.04), -row * 0.22, row * 0.04);
      wave.scale.set(1.1, 1.6, 0.8);
      backHairGrp.add(wave);
    }
  }

  // ── LEFT EYE (Open Anime Eye) ──────────────────────────────────────────
  const leftEyeGrp = new THREE.Group();
  leftEyeGrp.position.set(-0.16, 0.02, 0.39);
  headGrp.add(leftEyeGrp);

  const leftEye = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.22), mEyeMesh);
  leftEyeGrp.add(leftEye);

  // Eyelash line & wing
  const lashL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.008, 0.22, 8), mDarkLine);
  lashL.position.set(-0.01, 0.11, 0.01);
  lashL.rotation.z = Math.PI * 0.45;
  leftEyeGrp.add(lashL);

  // Eyebrow
  const browL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.006, 0.18, 6), mDarkLine);
  browL.position.set(-0.16, 0.18, 0.38);
  browL.rotation.z = Math.PI * 0.55;
  headGrp.add(browL);

  // ── RIGHT EYE (Permanently Winking Curved Eye) ──────────────────────────
  const rightEyeGrp = new THREE.Group();
  rightEyeGrp.position.set(0.16, 0.02, 0.39);
  headGrp.add(rightEyeGrp);

  // Expressive wink curve
  const winkCurve = new THREE.Mesh(
    new THREE.TorusGeometry(0.08, 0.018, 8, 16, Math.PI * 0.85),
    mDarkLine
  );
  winkCurve.position.set(0, 0.02, 0);
  winkCurve.rotation.z = Math.PI * 1.08;
  rightEyeGrp.add(winkCurve);

  // Eyelash flick for wink
  const winkFlick = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.08, 6), mDarkLine);
  winkFlick.position.set(0.08, 0.03, 0);
  winkFlick.rotation.z = -Math.PI * 0.65;
  rightEyeGrp.add(winkFlick);

  // Eyebrow for winking side
  const browR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.006, 0.18, 6), mDarkLine);
  browR.position.set(0.16, 0.19, 0.38);
  browR.rotation.z = Math.PI * 0.45;
  headGrp.add(browR);

  // ── GLASSES ───────────────────────────────────────────────────────────
  const glassesGrp = new THREE.Group();
  glassesGrp.position.set(0, 0.03, 0.42);
  headGrp.add(glassesGrp);

  const frameGeo = new THREE.TorusGeometry(0.13, 0.014, 8, 24);
  const lensGeo = new THREE.CircleGeometry(0.125, 20);

  [-0.16, 0.16].forEach((gx) => {
    const frame = new THREE.Mesh(frameGeo, mGlassFrame);
    frame.position.x = gx;
    glassesGrp.add(frame);

    const lens = new THREE.Mesh(lensGeo, mGlassLens);
    lens.position.set(gx, 0, 0.005);
    glassesGrp.add(lens);
  });

  // Nose bridge
  const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.1, 6), mGlassFrame);
  bridge.position.set(0, 0.03, 0.01);
  bridge.rotation.z = Math.PI / 2;
  glassesGrp.add(bridge);

  // ── BLUSH CHEEKS ──────────────────────────────────────────────────────
  [-0.23, 0.23].forEach((bx) => {
    const blush = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.14), mBlush);
    blush.position.set(bx, -0.07, 0.41);
    headGrp.add(blush);
  });

  // ── CUTE OPEN SMILE ───────────────────────────────────────────────────
  const mouthGrp = new THREE.Group();
  mouthGrp.position.set(0, -0.14, 0.41);
  headGrp.add(mouthGrp);

  const mouthShape = new THREE.Shape();
  mouthShape.moveTo(-0.08, 0.02);
  mouthShape.quadraticCurveTo(0, -0.09, 0.08, 0.02);
  mouthShape.quadraticCurveTo(0, 0.01, -0.08, 0.02);

  const mouthMesh = new THREE.Mesh(new THREE.ShapeGeometry(mouthShape), mMouthIn);
  mouthGrp.add(mouthMesh);

  // Tongue
  const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), mTongue);
  tongue.position.set(0.01, -0.03, 0.01);
  tongue.scale.set(1.1, 0.7, 0.8);
  mouthGrp.add(tongue);

  /* ── BODY & OUTFIT ───────────────────────────────────────────────────── */
  const bodyGrp = new THREE.Group();
  bodyGrp.position.y = 0.48;
  root.add(bodyGrp);

  // Neck + choker
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.14, 12), mSkin);
  neck.position.y = 0.22;
  bodyGrp.add(neck);

  const choker = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.01, 6, 16), mTop);
  choker.position.y = 0.21;
  choker.rotation.x = Math.PI / 2;
  bodyGrp.add(choker);

  // Black cropped tank top
  const torsoTop = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 0.28, 14), mTop);
  torsoTop.position.y = 0.06;
  bodyGrp.add(torsoTop);

  // Tank top straps
  [-0.12, 0.12].forEach((sx) => {
    const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 6), mTop);
    strap.position.set(sx, 0.19, 0.01);
    strap.rotation.z = sx > 0 ? -0.2 : 0.2;
    bodyGrp.add(strap);
  });

  // Midriff skin
  const midriff = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.1, 14), mSkin);
  midriff.position.y = -0.09;
  bodyGrp.add(midriff);

  // Shorts / skirt
  const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.16, 14), mPants);
  pants.position.y = -0.19;
  bodyGrp.add(pants);

  /* ── ARMS & HANDS (Finger guns & cute poses) ─────────────────────────── */
  function createArm(isRight) {
    const dir = isRight ? 1 : -1;
    const armGrp = new THREE.Group();
    armGrp.position.set(dir * 0.25, 0.58, 0);
    root.add(armGrp);

    // Shoulder & arm
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.24, 10), mSkin);
    upperArm.position.y = -0.11;
    armGrp.add(upperArm);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.044, 0.22, 10), mSkin);
    forearm.position.set(0, -0.3, 0.02);
    armGrp.add(forearm);

    // Cute hand with finger gun index finger!
    const hand = new THREE.Group();
    hand.position.set(0, -0.42, 0.04);
    armGrp.add(hand);

    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 8), mSkin);
    hand.add(palm);

    // Pointing index finger (finger gun)
    const indexFinger = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.015, 0.14, 6), mSkin);
    indexFinger.position.set(dir * 0.02, 0.08, 0.02);
    indexFinger.rotation.set(0.4, 0, dir * 0.1);
    hand.add(indexFinger);

    // Thumb pointing up
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.09, 6), mSkin);
    thumb.position.set(dir * 0.04, 0.03, -0.01);
    thumb.rotation.set(0, 0, dir * 0.75);
    hand.add(thumb);

    return { armGrp, forearm, hand };
  }

  const armL = createArm(false);
  const armR = createArm(true);

  /* ── LEGS & SNEAKERS ─────────────────────────────────────────────────── */
  function createLeg(isRight) {
    const dir = isRight ? 1 : -1;
    const legGrp = new THREE.Group();
    legGrp.position.set(dir * 0.11, 0.24, 0);
    root.add(legGrp);

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.26, 10), mSkin);
    thigh.position.y = -0.12;
    legGrp.add(thigh);

    // White ankle sock
    const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.062, 0.14, 10), mShoeSole);
    sock.position.y = -0.28;
    legGrp.add(sock);

    // Stylish XP blue sneaker
    const shoeGrp = new THREE.Group();
    shoeGrp.position.set(0, -0.38, 0.04);
    legGrp.add(shoeGrp);

    const shoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.24), mShoe);
    shoeUpper.position.y = 0.03;
    shoeGrp.add(shoeUpper);

    const shoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, 0.26), mShoeSole);
    shoeSole.position.y = -0.04;
    shoeGrp.add(shoeSole);

    return { legGrp, shoeGrp };
  }

  const legL = createLeg(false);
  const legR = createLeg(true);

  root.scale.setScalar(1.85);

  return {
    root,
    headGrp,
    hairGrp,
    sideHairGrpL,
    sideHairGrpR,
    backHairGrp,
    bodyGrp,
    armL,
    armR,
    legL,
    legR,
    leftEyeGrp,
    starTex,
  };
}

/* ─── 3D Floating Diamond Star Particles ────────────────────────────────── */
function createDiamondStars(THREE, scene, starTex) {
  const COUNT = 5;
  const stars = [];

  for (let i = 0; i < COUNT; i++) {
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: starTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    sp.scale.setScalar(0.45 + Math.random() * 0.25);
    scene.add(sp);

    stars.push({
      sprite: sp,
      baseRadius: 0.65 + i * 0.15,
      speed: 0.6 + i * 0.25,
      angle: (i / COUNT) * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      yOffset: 1.1 + (i % 3) * 0.35,
    });
  }

  return stars;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main React Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ChibiScene() {
  const canvasRef = useRef(null);
  const [speechText, setSpeechText] = useState('Hi! Welcome to my portfolio! ✨');
  const [showSpeech, setShowSpeech] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId;
    let mounted = true;

    import('three').then((THREE) => {
      if (!mounted) return;

      const W = window.innerWidth;
      const H = window.innerHeight;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 200);
      camera.position.set(0, 3.8, 15.5);
      camera.lookAt(0, 0.7, 0);

      // ── Sunny Lighting ──
      const sun = new THREE.DirectionalLight(0xFFF6D6, 2.2);
      sun.position.set(10, 16, 10);
      scene.add(sun);

      const skyHemisphere = new THREE.HemisphereLight(0x70C4FF, 0x48A028, 0.85);
      scene.add(skyHemisphere);

      const softFill = new THREE.DirectionalLight(0xE0F0FF, 0.6);
      softFill.position.set(-8, 6, 12);
      scene.add(softFill);

      // ── Ground Plane for Raycast Hit-Testing ──
      const groundGeo = new THREE.PlaneGeometry(120, 120, 40, 40);
      groundGeo.rotateX(-Math.PI / 2);
      const posAttr = groundGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        posAttr.setY(i, getGroundY(x, z));
      }
      groundGeo.computeVertexNormals();

      const ground = new THREE.Mesh(
        groundGeo,
        new THREE.MeshBasicMaterial({ visible: false })
      );
      scene.add(ground);

      // ── Soft Contact Shadow ──
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x052805,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      });
      const shadowGeo = new THREE.CircleGeometry(0.85, 24);
      shadowGeo.rotateX(-Math.PI / 2);
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      scene.add(shadowMesh);

      // ── Build Chibi ──
      const chibi = buildChibiModel(THREE);
      chibi.root.position.set(0, getGroundY(0, 0), 0);
      scene.add(chibi.root);

      // ── Golden Diamond Stars ──
      const stars = createDiamondStars(THREE, scene, chibi.starTex);

      // ── Input & State ──
      const keys = new Set();
      const onKeyDown = (e) => {
        keys.add(e.code);
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault();
        }
      };
      const onKeyUp = (e) => keys.delete(e.code);

      window.addEventListener('keydown', onKeyDown, { passive: false });
      window.addEventListener('keyup', onKeyUp);

      // Mouse tracking for head look-at & click-to-move
      const mouseNDC = new THREE.Vector2();
      const mouseWorld = new THREE.Vector3();
      const raycaster = new THREE.Raycaster();
      let targetPos = null;
      let isCelebrating = false;
      let celebrateTimer = 0;

      const onMouseMove = (e) => {
        mouseNDC.set(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        );
      };
      window.addEventListener('mousemove', onMouseMove);

      const onClick = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseNDC.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouseNDC, camera);
        const hits = raycaster.intersectObject(ground);
        if (hits.length > 0) {
          const pt = hits[0].point;
          targetPos = new THREE.Vector3(
            Math.max(-8, Math.min(8, pt.x)),
            pt.y,
            Math.max(-4.5, Math.min(4.5, pt.z))
          );

          // Trigger speech reaction
          const quotes = [
            'On my way! 🏃‍♀️',
            'Exploring the hill! 🌿',
            'Check out My Projects! 📁',
            'Data & Insights ahead! 📊',
            'Nice click! ✨',
          ];
          setSpeechText(quotes[Math.floor(Math.random() * quotes.length)]);
          setShowSpeech(true);
        }
      };
      canvas.addEventListener('click', onClick);

      // ── Animation Loop ──
      const CLK = new THREE.Clock();
      let walkPhase = 0;
      let blinkTimer = 2.5;
      let isBlinking = false;
      let blinkT = 0;

      function animate() {
        animId = requestAnimationFrame(animate);
        const dt = Math.min(CLK.getDelta(), 0.05);
        const elapsed = CLK.elapsedTime;

        // Movement Vector
        const moveDir = new THREE.Vector3();
        if (keys.has('KeyW') || keys.has('ArrowUp')) moveDir.z -= 1;
        if (keys.has('KeyS') || keys.has('ArrowDown')) moveDir.z += 1;
        if (keys.has('KeyA') || keys.has('ArrowLeft')) moveDir.x -= 1;
        if (keys.has('KeyD') || keys.has('ArrowRight')) moveDir.x += 1;

        const hasKey = moveDir.lengthSq() > 0.001;

        if (!hasKey && targetPos) {
          const diff = targetPos.clone().sub(chibi.root.position);
          diff.y = 0;
          if (diff.length() > 0.2) {
            moveDir.copy(diff.normalize());
          } else {
            targetPos = null;
          }
        }

        const isMoving = moveDir.lengthSq() > 0.001;

        if (isMoving) {
          moveDir.normalize();
          const speed = 4.6;
          const nx = Math.max(-8, Math.min(8, chibi.root.position.x + moveDir.x * speed * dt));
          const nz = Math.max(-4.5, Math.min(4.5, chibi.root.position.z + moveDir.z * speed * dt));
          chibi.root.position.x = nx;
          chibi.root.position.z = nz;

          // Face movement direction smoothly
          const targetYaw = Math.atan2(moveDir.x, moveDir.z);
          chibi.root.rotation.y = lerpAngle(chibi.root.rotation.y, targetYaw, 0.22);

          walkPhase += dt * 8.5;

          // Bouncy walk animation
          chibi.armL.armGrp.rotation.x = Math.sin(walkPhase) * 0.65;
          chibi.armR.armGrp.rotation.x = -Math.sin(walkPhase) * 0.65;
          chibi.armL.armGrp.rotation.z = 0.12;
          chibi.armR.armGrp.rotation.z = -0.12;

          chibi.legL.legGrp.rotation.x = -Math.sin(walkPhase) * 0.72;
          chibi.legR.legGrp.rotation.x = Math.sin(walkPhase) * 0.72;

          // Dynamic hair trailing back during movement
          chibi.backHairGrp.rotation.x = -0.25 + Math.sin(walkPhase * 2) * 0.08;
          chibi.sideHairGrpL.rotation.z = -0.15 + Math.cos(walkPhase) * 0.1;
          chibi.sideHairGrpR.rotation.z = 0.15 - Math.cos(walkPhase) * 0.1;

          const bob = Math.abs(Math.sin(walkPhase)) * 0.06;
          chibi.bodyGrp.position.y = 0.48 + bob;
          chibi.headGrp.position.y = 1.02 + bob;
        } else {
          // ── Idle: Cute Finger-Guns & Breathing ──
          const breath = Math.sin(elapsed * 2.2) * 0.02;
          chibi.bodyGrp.position.y = 0.48 + breath;
          chibi.headGrp.position.y = 1.02 + breath * 1.2;

          // Settle limbs into cute finger-gun pose (matching wallpaper!)
          const gunPoseL_x = -0.65 + Math.sin(elapsed * 1.8) * 0.04;
          const gunPoseR_x = -0.72 + Math.cos(elapsed * 1.8) * 0.04;

          chibi.armL.armGrp.rotation.x = lerp(chibi.armL.armGrp.rotation.x, gunPoseL_x, 0.1);
          chibi.armR.armGrp.rotation.x = lerp(chibi.armR.armGrp.rotation.x, gunPoseR_x, 0.1);
          chibi.armL.armGrp.rotation.z = lerp(chibi.armL.armGrp.rotation.z, 0.45, 0.1);
          chibi.armR.armGrp.rotation.z = lerp(chibi.armR.armGrp.rotation.z, -0.45, 0.1);

          chibi.legL.legGrp.rotation.x *= 0.85;
          chibi.legR.legGrp.rotation.x *= 0.85;

          // Gentle hair sway
          chibi.backHairGrp.rotation.x = Math.sin(elapsed * 1.6) * 0.06;
          chibi.sideHairGrpL.rotation.z = Math.sin(elapsed * 1.8) * 0.05;
          chibi.sideHairGrpR.rotation.z = -Math.sin(elapsed * 1.8) * 0.05;

          // Mouse head-tracking (subtle look at cursor)
          const lookX = mouseNDC.x * 0.28;
          const lookY = -mouseNDC.y * 0.15;
          chibi.headGrp.rotation.y = lerp(chibi.headGrp.rotation.y, lookX, 0.08);
          chibi.headGrp.rotation.x = lerp(chibi.headGrp.rotation.x, lookY, 0.08);
        }

        // Ground Height Alignment
        chibi.root.position.y = getGroundY(chibi.root.position.x, chibi.root.position.z);

        // Shadow Position
        shadowMesh.position.set(
          chibi.root.position.x,
          chibi.root.position.y + 0.03,
          chibi.root.position.z
        );

        // ── Eye Blink on Open Eye ──
        blinkTimer -= dt;
        if (blinkTimer <= 0 && !isBlinking) {
          isBlinking = true;
          blinkT = 0;
          blinkTimer = 2.8 + Math.random() * 3.5;
        }
        if (isBlinking) {
          blinkT += dt / 0.22;
          const scale = blinkT < 0.5 ? 1 - blinkT * 2 : (blinkT - 0.5) * 2;
          chibi.leftEyeGrp.scale.y = Math.max(0.05, scale);
          if (blinkT >= 1) {
            isBlinking = false;
            chibi.leftEyeGrp.scale.y = 1;
          }
        }

        // ── Orbiting Golden Stars ──
        const cp = chibi.root.position;
        stars.forEach((s) => {
          s.angle += s.speed * dt;
          const rad = s.baseRadius + Math.sin(elapsed * 2 + s.phase) * 0.15;
          s.sprite.position.set(
            cp.x + Math.cos(s.angle) * rad,
            cp.y + s.yOffset + Math.sin(s.angle * 2 + s.phase) * 0.25,
            cp.z + Math.sin(s.angle) * rad * 0.6
          );
          const sc = 0.38 + Math.sin(elapsed * 4 + s.phase) * 0.12;
          s.sprite.scale.setScalar(sc);
          s.sprite.material.rotation += dt * 1.5;
        });

        // ── Camera Tracking ──
        const targetCamX = chibi.root.position.x * 0.22;
        camera.position.x = lerp(camera.position.x, targetCamX, 0.05);
        camera.lookAt(targetCamX, 0.85, 0);

        renderer.render(scene, camera);
      }

      animate();

      const onResize = () => {
        const nW = window.innerWidth;
        const nH = window.innerHeight;
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
        renderer.setSize(nW, nH);
      };
      window.addEventListener('resize', onResize);

      canvas._chibiCleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        canvas.removeEventListener('click', onClick);
        renderer.dispose();
      };
    });

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      if (canvas._chibiCleanup) canvas._chibiCleanup();
    };
  }, []);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Interactive Speech Balloon */}
      {showSpeech && (
        <div className={styles.speechBalloon}>
          <span className={styles.speechText}>{speechText}</span>
          <button
            className={styles.speechClose}
            onClick={() => setShowSpeech(false)}
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* On-screen control hint */}
      <div className={styles.hint} aria-label="Controls: WASD or arrow keys to walk, click to go">
        <span className={styles.hintKey}>WASD</span>
        <span className={styles.hintSep}>/</span>
        <span className={styles.hintKey}>↑↓←→</span>
        <span className={styles.hintText}>walk</span>
        <span className={styles.hintDivider}>·</span>
        <span className={styles.hintKey}>click</span>
        <span className={styles.hintText}>explore</span>
      </div>
    </div>
  );
}
