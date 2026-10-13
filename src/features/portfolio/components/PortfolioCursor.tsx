import { useEffect, useRef } from "react";

type Spring = { x: number; y: number; vx: number; vy: number };

// Same spring values as the framer-motion version
const MAIN = { stiffness: 300, damping: 25 };
const TRAIL_1 = { stiffness: 200, damping: 30 };
const TRAIL_2 = { stiffness: 140, damping: 28 };

const SUBSTEP = 1 / 120; // fixed physics step in seconds, keeps springs stable
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]';

const createSpring = (): Spring => ({ x: 0, y: 0, vx: 0, vy: 0 });

// Damped spring with mass = 1, the model framer-motion's useSpring simulates
const stepSpring = (
  s: Spring,
  targetX: number,
  targetY: number,
  { stiffness, damping }: { stiffness: number; damping: number },
  dt: number
) => {
  s.vx += (-stiffness * (s.x - targetX) - damping * s.vx) * dt;
  s.vy += (-stiffness * (s.y - targetY) - damping * s.vy) * dt;
  s.x += s.vx * dt;
  s.y += s.vy * dt;
};

const isResting = (s: Spring, tx: number, ty: number) =>
  Math.abs(s.vx) < 0.5 &&
  Math.abs(s.vy) < 0.5 &&
  Math.abs(s.x - tx) < 0.1 &&
  Math.abs(s.y - ty) < 0.1;

export default function PortfolioCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const dot = dotRef.current;
    const trail1 = trail1Ref.current;
    const trail2 = trail2Ref.current;
    if (!dot || !trail1 || !trail2) return;

    const mouse = { x: 0, y: 0 };
    const main = createSpring();
    const t1 = createSpring();
    const t2 = createSpring();

    let frame = 0;
    let lastTime = 0;
    let running = false;
    let hidden = true;

    const place = (el: HTMLDivElement, s: Spring) => {
      // translate(-50%, -50%) keeps the circle centered on the pointer,
      // even while width/height animate on hover
      el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`;
    };

    const render = () => {
      place(dot, main);
      place(trail1, t1);
      place(trail2, t2);
    };

    const tick = (now: number) => {
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0), 1 / 30);
      lastTime = now;

      const steps = Math.max(1, Math.ceil(dt / SUBSTEP));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        stepSpring(main, mouse.x, mouse.y, MAIN, h);
        stepSpring(t1, mouse.x, mouse.y, TRAIL_1, h);
        stepSpring(t2, mouse.x, mouse.y, TRAIL_2, h);
      }
      render();

      // Stop the loop once everything has settled; mousemove restarts it
      if (
        isResting(main, mouse.x, mouse.y) &&
        isResting(t1, mouse.x, mouse.y) &&
        isResting(t2, mouse.x, mouse.y)
      ) {
        running = false;
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      frame = window.requestAnimationFrame(tick);
    };

    const setHidden = (value: boolean) => {
      hidden = value;
      [dot, trail1, trail2].forEach((el) => el.classList.toggle("is-hidden", value));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (hidden) {
        // Snap springs to the pointer so nothing flies in from the corner
        [main, t1, t2].forEach((s) => {
          s.x = mouse.x;
          s.y = mouse.y;
          s.vx = 0;
          s.vy = 0;
        });
        render();
        setHidden(false);
      }
      start();
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      dot.classList.toggle("is-hovering", Boolean(e.target.closest(INTERACTIVE)));
    };

    const handleMouseLeave = () => setHidden(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        .pc-cursor{position:fixed;top:0;left:0;border-radius:9999px;pointer-events:none;will-change:transform;opacity:1;transition:opacity 180ms ease}
        .pc-cursor.is-hidden{opacity:0}
        .pc-trail-2{z-index:99997;width:24px;height:24px;background:radial-gradient(circle,rgba(0,184,219,.15) 0%,transparent 70%)}
        .pc-trail-1{z-index:99998;width:24px;height:24px;background:radial-gradient(circle,rgba(0,184,219,.25) 0%,transparent 70%)}
        .pc-dot{z-index:99999;width:30px;height:30px;background:radial-gradient(circle at 30% 30%,#00f0ff,#00b8db);
          box-shadow:0 0 10px rgba(0,255,255,.3),0 0 20px rgba(0,184,219,.4),0 0 40px rgba(0,184,219,.3);
          border:1px solid rgba(255,255,255,.2);mix-blend-mode:screen;
          transition:width .15s ease,height .15s ease,opacity 180ms ease}
        .pc-dot.is-hovering{width:50px;height:50px;background:#000}
        @media (hover:none),(pointer:coarse),(prefers-reduced-motion:reduce){.pc-cursor{display:none}}
      `}</style>
      <div ref={trail2Ref} aria-hidden="true" className="pc-cursor pc-trail-2 is-hidden" />
      <div ref={trail1Ref} aria-hidden="true" className="pc-cursor pc-trail-1 is-hidden" />
      <div ref={dotRef} aria-hidden="true" className="pc-cursor pc-dot is-hidden" />
    </>
  );
}