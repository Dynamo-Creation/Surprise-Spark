"use client";

import React, { useEffect, useRef } from "react";

const BLOSSOM = [
  { c0: "#ffe1ec", c1: "#ff80aa" },
  { c0: "#ffd0e0", c1: "#f4577f" },
  { c0: "#ffc4d2", c1: "#e23b67" },
  { c0: "#ffd9c4", c1: "#ff8a5b" },
  { c0: "#ffeec2", c1: "#f6b13e" },
  { c0: "#ffd2e6", c1: "#e84d9a" },
];

const SS = 120;

function heartShape(c: CanvasRenderingContext2D, x: number, top: number, w: number, h: number) {
  c.beginPath();
  c.moveTo(x, top + h * 0.28);
  c.bezierCurveTo(x, top, x - w * 0.5, top, x - w * 0.5, top + h * 0.28);
  c.bezierCurveTo(x - w * 0.5, top + h * 0.6, x - w * 0.16, top + h * 0.8, x, top + h);
  c.bezierCurveTo(x + w * 0.16, top + h * 0.8, x + w * 0.5, top + h * 0.6, x + w * 0.5, top + h * 0.28);
  c.bezierCurveTo(x + w * 0.5, top, x, top, x, top + h * 0.28);
  c.closePath();
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt));
  const b = Math.min(255, Math.max(0, (n & 255) + amt));
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

function makeBlossom(color: { c0: string; c1: string }, soft: boolean) {
  if (typeof document === "undefined") return null;
  const cv = document.createElement("canvas");
  cv.width = cv.height = SS;
  const c = cv.getContext("2d");
  if (!c) return null;
  const w = SS * 0.62,
    h = SS * 0.58,
    x = SS / 2,
    top = SS * 0.17;

  c.save();
  c.shadowColor = "rgba(150,38,72,0.32)";
  c.shadowBlur = SS * 0.085;
  c.shadowOffsetY = SS * 0.05;
  c.fillStyle = color.c1;
  heartShape(c, x, top, w, h);
  c.fill();
  c.restore();

  const g = c.createRadialGradient(x - w * 0.2, top + h * 0.2, h * 0.04, x, top + h * 0.42, h * 0.92);
  g.addColorStop(0, color.c0);
  g.addColorStop(0.55, color.c1);
  g.addColorStop(1, shade(color.c1, -26));
  heartShape(c, x, top, w, h);
  c.fillStyle = g;
  c.fill();

  c.save();
  heartShape(c, x, top, w, h);
  c.clip();
  const g2 = c.createLinearGradient(0, top, 0, top + h);
  g2.addColorStop(0, "rgba(255,255,255,0)");
  g2.addColorStop(0.65, "rgba(110,16,46,0)");
  g2.addColorStop(1, "rgba(110,16,46,0.26)");
  c.fillStyle = g2;
  c.fillRect(0, 0, SS, SS);
  c.globalAlpha = 0.55;
  c.fillStyle = "#ffffff";
  c.beginPath();
  c.ellipse(x - w * 0.15, top + h * 0.24, w * 0.17, h * 0.11, -0.5, 0, Math.PI * 2);
  c.fill();
  c.restore();

  if (!soft) return cv;

  const cv2 = document.createElement("canvas");
  cv2.width = cv2.height = SS;
  const c2 = cv2.getContext("2d");
  if (!c2) return cv;
  c2.filter = "blur(2.6px)";
  c2.drawImage(cv, 0, 0);
  c2.filter = "none";
  c2.globalCompositeOperation = "source-atop";
  c2.globalAlpha = 0.42;
  c2.fillStyle = "#fff3ea";
  c2.fillRect(0, 0, SS, SS);
  return cv2;
}

function makeBokeh(rgb: string) {
  if (typeof document === "undefined") return null;
  const S = 96,
    cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const c = cv.getContext("2d");
  if (!c) return null;
  const g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, `rgba(${rgb},0.85)`);
  g.addColorStop(0.45, `rgba(${rgb},0.2)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  c.fillStyle = g;
  c.fillRect(0, 0, S, S);
  return cv;
}

interface HeartBlossomCanvasProps {
  className?: string;
  speedMultiplier?: number;
  onBloomed?: () => void;
}

export function HeartBlossomCanvas({ className = "", speedMultiplier = 1, onBloomed }: HeartBlossomCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let startTime = 0;
    let bloomedCalled = false;

    // Build sprites
    const crispSprites = BLOSSOM.map((b) => makeBlossom(b, false)).filter(Boolean) as HTMLCanvasElement[];
    const softSprites = BLOSSOM.map((b) => makeBlossom(b, true)).filter(Boolean) as HTMLCanvasElement[];
    const bokehSprites = [
      makeBokeh("255,224,188"),
      makeBokeh("255,196,214"),
      makeBokeh("255,238,210"),
    ].filter(Boolean) as HTMLCanvasElement[];

    // Heart poly
    const heartPoly: [number, number][] = [];
    let minX = 1e9,
      maxX = -1e9,
      minY = 1e9,
      maxY = -1e9;
    for (let i = 0; i <= 120; i++) {
      const t = (i / 120) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      heartPoly.push([x, y]);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const midX = (minX + maxX) / 2,
      midY = (minY + maxY) / 2,
      hw = (maxX - minX) / 2,
      hh = (maxY - minY) / 2;
    const normPoly = heartPoly.map(([x, y]) => [(x - midX) / hw, (y - midY) / hh] as [number, number]);

    function pointInPoly(x: number, y: number) {
      let inside = false;
      for (let i = 0, j = normPoly.length - 1; i < normPoly.length; j = i++) {
        const xi = normPoly[i][0],
          yi = normPoly[i][1],
          xj = normPoly[j][0],
          yj = normPoly[j][1];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeOutBack = (t: number) => {
      const c1 = 1.70158,
        c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    let W = 0,
      H = 0;
    let cx = 0,
      cy = 0,
      rx = 0,
      ry = 0;
    interface Branch {
      x1: number;
      y1: number;
      cx: number;
      cy: number;
      x2: number;
      y2: number;
      w0: number;
      w1: number;
      t0: number;
      dur: number;
      depth: number;
      grad: CanvasGradient;
    }
    interface HeartPetal {
      x: number;
      y: number;
      idx: number;
      soft: boolean;
      box: number;
      rot: number;
      sway: number;
      t0: number;
    }
    interface Floater {
      x: number;
      y: number;
      depth: number;
      idx: number;
      box: number;
      vy: number;
      sway: number;
      phase: number;
      rot: number;
      vrot: number;
      baseA: number;
      soft: boolean;
    }
    interface Orb {
      x: number;
      y: number;
      r: number;
      vy: number;
      drift: number;
      phase: number;
      alpha: number;
      sprite: HTMLCanvasElement;
    }

    let branches: Branch[] = [];
    let hearts: HeartPetal[] = [];
    let floaters: Floater[] = [];
    let orbs: Orb[] = [];
    let bgGrad: CanvasGradient | null = null;
    let glowGrad: CanvasGradient | null = null;

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      if (W === 0 || H === 0) return;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = W * 0.5;
      cy = H * 0.4;
      ry = Math.min(H * 0.32, W * 0.35);
      rx = ry * 1.15;

      bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#fff5eb");
      bgGrad.addColorStop(0.46, "#ffe9db");
      bgGrad.addColorStop(0.78, "#fcdcc9");
      bgGrad.addColorStop(1, "#f3c5b7");

      glowGrad = ctx.createRadialGradient(cx, cy, ry * 0.1, cx, cy, ry * 1.5);
      glowGrad.addColorStop(0, "rgba(255,219,170,0.6)");
      glowGrad.addColorStop(0.5, "rgba(255,170,150,0.2)");
      glowGrad.addColorStop(1, "rgba(255,170,150,0)");

      // Bokeh
      orbs = [];
      for (let i = 0; i < 8; i++) {
        orbs.push({
          x: rand(0, W),
          y: rand(0, H),
          r: rand(W * 0.06, W * 0.14),
          vy: rand(-8, -18),
          drift: rand(-0.3, 0.3),
          phase: rand(0, 6.28),
          alpha: rand(0.06, 0.14),
          sprite: bokehSprites[i % bokehSprites.length],
        });
      }

      // Floaters
      floaters = [];
      for (let i = 0; i < 16; i++) {
        const depth = Math.random();
        floaters.push({
          x: rand(0, W),
          y: rand(-H * 0.1, H * 1.1),
          depth,
          idx: (Math.random() * BLOSSOM.length) | 0,
          box: lerp(Math.min(W, H) * 0.03, Math.min(W, H) * 0.07, depth),
          vy: lerp(8, 24, depth),
          sway: rand(8, 20),
          phase: rand(0, 6.28),
          rot: rand(-0.4, 0.4),
          vrot: rand(-0.5, 0.5),
          baseA: lerp(0.2, 0.6, depth),
          soft: depth < 0.45,
        });
      }

      // Branches & Heart tree
      branches = [];
      const trunkTopY = cy + ry * 0.62;
      const trunkW = Math.max(7, W * 0.026);
      const limbLen = ry * 0.58;
      const insidePx = (x: number, y: number, m = 0.9) => pointInPoly((x - cx) / (rx * m), (cy - y) / (ry * m));

      function barkGrad(x1: number, y1: number, x2: number, y2: number, depth: number) {
        const g = ctx!.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, `hsl(348, 26%, ${26 + depth * 3}%)`);
        g.addColorStop(1, `hsl(346, 24%, ${40 + depth * 5}%)`);
        return g;
      }

      function addBranch(x: number, y: number, ang: number, len: number, w0: number, depth: number, t0: number) {
        let ex = x + Math.cos(ang) * len,
          ey = y + Math.sin(ang) * len;
        if (!insidePx(ex, ey)) {
          let lo = 0,
            hi = 1;
          for (let k = 0; k < 10; k++) {
            const mid = (lo + hi) / 2;
            insidePx(x + Math.cos(ang) * len * mid, y + Math.sin(ang) * len * mid) ? (lo = mid) : (hi = mid);
          }
          ex = x + Math.cos(ang) * len * lo;
          ey = y + Math.sin(ang) * len * lo;
        }
        const mx = (x + ex) / 2,
          my = (y + ey) / 2,
          perp = ang + Math.PI / 2,
          bend = rand(-1, 1) * len * 0.12,
          w1 = w0 * 0.66;
        branches.push({
          x1: x,
          y1: y,
          cx: mx + Math.cos(perp) * bend,
          cy: my + Math.sin(perp) * bend,
          x2: ex,
          y2: ey,
          w0,
          w1,
          t0,
          dur: Math.max(0.14, 0.3 - depth * 0.03),
          depth,
          grad: barkGrad(x, y, ex, ey, depth),
        });
        return { ex, ey, w1 };
      }

      function grow(x: number, y: number, ang: number, len: number, w: number, depth: number, t0: number) {
        const r = addBranch(x, y, ang, len, w, depth, t0);
        if (depth >= 5 || len < ry * 0.08) return;
        const childT0 = t0 + (0.3 - depth * 0.03) * 0.6;
        const n = Math.random() < 0.6 ? 2 : 3;
        for (let i = 0; i < n; i++) {
          const spread = 0.58 * (i - (n - 1) / 2) + rand(-0.2, 0.2);
          const lift = -0.06 + rand(-0.04, 0.04);
          grow(r.ex, r.ey, ang + spread + lift, len * rand(0.74, 0.84), r.w1, depth + 1, childT0 + i * 0.03);
        }
      }

      addBranch(cx, H, -Math.PI / 2, H - trunkTopY, trunkW, 0, 0.1);
      const L = 3;
      for (let i = 0; i < L; i++) {
        const ang = -Math.PI / 2 + 0.6 * (i - (L - 1) / 2) + rand(-0.1, 0.1);
        grow(cx, trunkTopY, ang, limbLen, trunkW * 0.7, 1, 0.35 + i * 0.05);
      }

      // Blossoms
      hearts = [];
      const COUNT = 220;
      const baseBox = clamp01(Math.min(W, H) / 380) * 44 + 20;
      let guard = 0;
      while (hearts.length < COUNT && guard < 4000) {
        guard++;
        const u = rand(-1.05, 1.05),
          v = rand(-1.05, 1.05);
        if (!pointInPoly(u, v)) continue;
        const x = cx + u * rx,
          y = cy - v * ry;
        const d = clamp01(Math.hypot(u, v + 0.9) / 2.2);
        const t0 = 0.9 + d * 1.5 + rand(0, 0.3);
        const soft = Math.random() < 0.4;
        hearts.push({
          x,
          y,
          idx: (Math.random() * BLOSSOM.length) | 0,
          soft,
          box: baseBox * (soft ? rand(0.65, 0.88) : rand(0.85, 1.15)),
          rot: rand(-0.55, 0.55),
          sway: rand(0, 6.28),
          t0,
        });
      }
      hearts.sort((a, b) => (a.soft === b.soft ? a.y - b.y : a.soft ? -1 : 1));
    }

    resize();
    window.addEventListener("resize", resize);

    function quadPoint(b: Branch, t: number) {
      const m = 1 - t,
        a = m * m,
        k = 2 * m * t,
        d = t * t;
      return { x: a * b.x1 + k * b.cx + d * b.x2, y: a * b.y1 + k * b.cy + d * b.y2 };
    }

    function drawSprite(sprite: HTMLCanvasElement, x: number, y: number, size: number, rot: number, alpha: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      if (rot) ctx.rotate(rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.drawImage(sprite, -size * 0.5, -size * 0.47, size, size);
      ctx.restore();
    }

    let lastTimestamp = 0;

    function render(timestamp: number) {
      if (!startTime) startTime = timestamp;
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const elapsed = ((timestamp - startTime) / 1000) * speedMultiplier;

      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Background
      if (bgGrad) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // Glow behind tree
      if (glowGrad && elapsed > 1.2) {
        const gi = clamp01((elapsed - 1.2) / 1.5);
        ctx.save();
        ctx.globalAlpha = gi * 0.7;
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      // Bokeh orbs
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const o of orbs) {
        o.y += o.vy * dt;
        o.x += Math.sin(elapsed * 0.4 + o.phase) * o.drift;
        if (o.y < -o.r) {
          o.y = H + o.r;
          o.x = rand(0, W);
        }
        ctx.globalAlpha = o.alpha;
        ctx.drawImage(o.sprite, o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
      }
      ctx.restore();

      // Branches
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const b of branches) {
        const f = clamp01((elapsed - b.t0) / b.dur);
        if (f <= 0) continue;
        const e = easeOutCubic(f);
        ctx.strokeStyle = b.grad;
        const steps = 10,
          last = Math.max(1, Math.ceil(steps * e));
        let prev = quadPoint(b, 0);
        for (let i = 1; i <= last; i++) {
          const tt = Math.min(e, i / steps);
          const p = quadPoint(b, tt);
          ctx.lineWidth = lerp(b.w0, b.w1, tt);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          prev = p;
        }
      }

      // Heart tree blossoms
      const breathe = 1 + Math.sin(elapsed * 0.9) * 0.012;
      for (const h of hearts) {
        const p = clamp01((elapsed - h.t0) / 0.55);
        if (p <= 0) continue;
        const scale = Math.max(0, easeOutBack(p));
        let alpha = clamp01(p * 1.6);
        if (h.soft) alpha *= 0.8;
        const sway = Math.sin(elapsed * 1.6 + h.sway) * (h.box * 0.04);
        const hx = cx + (h.x - cx) * breathe + sway;
        const hy = cy + (h.y - cy) * breathe;
        const sprites = h.soft ? softSprites : crispSprites;
        const sprite = sprites[h.idx % sprites.length];
        if (sprite) {
          drawSprite(sprite, hx, hy, h.box * scale, h.rot + sway * 0.015, alpha);
        }
      }

      // Falling drifting petals
      const appear = clamp01((elapsed - 0.4) / 1.2);
      if (appear > 0) {
        for (const f of floaters) {
          f.y += f.vy * dt;
          f.x += Math.sin(elapsed * 0.6 + f.phase) * f.sway * dt;
          f.rot += f.vrot * dt;
          if (f.y > H + f.box) {
            f.y = -f.box;
            f.x = rand(0, W);
          }
          const sprites = f.soft ? softSprites : crispSprites;
          const sprite = sprites[f.idx % sprites.length];
          if (sprite) {
            drawSprite(sprite, f.x, f.y, f.box, f.rot, f.baseA * appear);
          }
        }
      }

      if (elapsed > 3.0 && !bloomedCalled && onBloomed) {
        bloomedCalled = true;
        onBloomed();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [speedMultiplier, onBloomed]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 180, 200, 0.4)";
    ctx.fill();
    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className={`w-full h-full block cursor-pointer ${className}`}
      title="Click anywhere to interact with the blossoms"
    />
  );
}
