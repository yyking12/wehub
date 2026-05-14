import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useRef, useEffect, useState, type ReactNode } from 'react';

const scrollHistory = new Map<string, number>();
let lastPathname = '';
let historyIndex = 0;

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBack, setIsBack] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    const isGoingBack = currentPath === lastPathname || historyIndex < (window.history.state?.idx ?? 0);
    setIsBack(isGoingBack);

    if (!isGoingBack) {
      scrollHistory.set(currentPath, 0);
    }

    lastPathname = currentPath;
    historyIndex = window.history.state?.idx ?? 0;
  }, [location.pathname]);

  useEffect(() => {
    const restoreScroll = () => {
      const saved = scrollHistory.get(location.pathname);
      if (saved !== undefined) {
        window.scrollTo(0, saved);
      }
    };
    const timer = setTimeout(restoreScroll, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      scrollHistory.set(location.pathname, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <motion.div
      key={location.pathname}
      initial={isBack ? { opacity: 0, y: -40, scale: 0.98 } : { opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={isBack ? { opacity: 0, y: 40, scale: 0.98 } : { opacity: 0, y: -40, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      ref={containerRef}
    >
      {children}
    </motion.div>
  );
}
