import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function Guardian() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blinking, setBlinking] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [tailSwish, setTailSwish] = useState(false);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 150);
        schedule();
      }, 2000 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTailSwish((prev) => !prev);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    };
  }, []);

  const handleDoubleClick = useCallback(() => {
    setBouncing(true);
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    bounceTimerRef.current = setTimeout(() => setBouncing(false), 600);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 select-none"
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ opacity: 1, scale: bouncing ? [1, 1.25, 0.85, 1.05, 1] : 1, y: 0 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 18 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      <motion.div
        className="relative w-32 h-32 cursor-pointer"
        animate={{ scale: hovered ? 1.15 : 1, y: hovered ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black/25 blur-sm" />

        <svg
          width="128"
          height="128"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <motion.g
            animate={{ rotate: tailSwish ? [0, 15, 0] : [0, -10, 0] }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ originX: '130px', originY: '280px' }}
          >
            <path d="M 120 250 C 90 250, 90 300, 60 310 C 80 320, 110 300, 140 280 Z" fill="#FFA31A" />
            <path d="M 100 270 C 80 270, 80 300, 60 310" fill="none" stroke="#E68A00" strokeWidth="4" strokeLinecap="round" />
            <path d="M 115 260 C 105 260, 105 280, 95 290" fill="none" stroke="#E68A00" strokeWidth="3" strokeLinecap="round" />
          </motion.g>

          <rect x="135" y="220" width="130" height="120" rx="40" fill="#FFA31A" />
          <rect x="160" y="240" width="80" height="100" rx="30" fill="#FDDCB5" />
          <rect x="165" y="245" width="15" height="25" rx="5" fill="#E68A00" opacity="0.6" />
          <rect x="220" y="245" width="15" height="25" rx="5" fill="#E68A00" opacity="0.6" />

          <rect x="120" y="120" width="160" height="120" rx="40" fill="#FFA31A" />
          <rect x="160" y="180" width="80" height="50" rx="20" fill="#FDDCB5" />
          <path d="M 190 125 L 190 145" stroke="#E68A00" strokeWidth="6" strokeLinecap="round" />
          <path d="M 210 125 L 210 145" stroke="#E68A00" strokeWidth="6" strokeLinecap="round" />
          <path d="M 200 122 L 200 140" stroke="#E68A00" strokeWidth="5" strokeLinecap="round" />

          <polygon points="140,140 130,70 180,120" fill="#FFA31A" />
          <polygon points="145,125 140,85 175,115" fill="#FFB6C1" />
          <polygon points="260,140 270,70 220,120" fill="#FFA31A" />
          <polygon points="255,125 260,85 225,115" fill="#FFB6C1" />
          <polygon points="140,140 130,70 180,120" fill="none" stroke="#D68000" strokeWidth="2" />
          <polygon points="260,140 270,70 220,120" fill="none" stroke="#D68000" strokeWidth="2" />

          <g>
            <motion.rect
              x="160" y="160" width="20" height="22" rx="5" fill="#2D2D2D"
              animate={{ scaleY: blinking ? 0.1 : 1 }}
              transition={{ duration: 0.1 }}
            />
            <motion.rect
              x="165" y="162" width="8" height="8" rx="4" fill="#FFFFFF"
              animate={{ opacity: blinking ? 0 : 1 }}
              transition={{ duration: 0.05 }}
            />
            <motion.circle
              cx="172" cy="178" r="3" fill="#FFFFFF"
              animate={{ opacity: blinking ? 0 : 1 }}
              transition={{ duration: 0.05 }}
            />
            <motion.rect
              x="220" y="160" width="20" height="22" rx="5" fill="#2D2D2D"
              animate={{ scaleY: blinking ? 0.1 : 1 }}
              transition={{ duration: 0.1 }}
            />
            <motion.rect
              x="225" y="162" width="8" height="8" rx="4" fill="#FFFFFF"
              animate={{ opacity: blinking ? 0 : 1 }}
              transition={{ duration: 0.05 }}
            />
            <motion.circle
              cx="232" cy="178" r="3" fill="#FFFFFF"
              animate={{ opacity: blinking ? 0 : 1 }}
              transition={{ duration: 0.05 }}
            />
          </g>

          <polygon points="195,200 205,200 200,208" fill="#FFB6C1" />

          <path d="M 190 212 Q 200 220 200 208 Q 200 220 210 212" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />

          <line x1="130" y1="190" x2="160" y2="195" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
          <line x1="130" y1="210" x2="160" y2="205" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
          <line x1="135" y1="202" x2="160" y2="200" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
          <line x1="270" y1="190" x2="240" y2="195" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
          <line x1="270" y1="210" x2="240" y2="205" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
          <line x1="265" y1="202" x2="240" y2="200" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />

          <rect x="145" y="300" width="30" height="30" rx="10" fill="#FDDCB5" />
          <circle cx="155" cy="320" r="6" fill="#FFB6C1" />
          <circle cx="165" cy="320" r="6" fill="#FFB6C1" />
          <circle cx="160" cy="328" r="7" fill="#FFB6C1" />
          <rect x="225" y="300" width="30" height="30" rx="10" fill="#FDDCB5" />
          <circle cx="235" cy="320" r="6" fill="#FFB6C1" />
          <circle cx="245" cy="320" r="6" fill="#FFB6C1" />
          <circle cx="240" cy="328" r="7" fill="#FFB6C1" />
          <rect x="145" y="300" width="30" height="30" rx="10" fill="none" stroke="#D68000" strokeWidth="2" />
          <rect x="225" y="300" width="30" height="30" rx="10" fill="none" stroke="#D68000" strokeWidth="2" />

          <rect x="135" y="220" width="130" height="120" rx="40" fill="none" stroke="#D68000" strokeWidth="2" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
