import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryDropdown from './CategoryDropdown';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/discover', label: '发现' },
  { to: '/hot', label: '热门' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isCategoryActive = location.pathname.startsWith('/category');

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-purple-500/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/discover" className="flex items-center gap-2 group flex-shrink-0">
          <motion.div
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <span className="text-white font-black text-xs md:text-sm">W</span>
          </motion.div>
          <span className="text-lg md:text-xl font-bold text-gray-900">
            We<span className="text-purple-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="relative px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100/50"
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-purple-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100/50 ${
                isCategoryActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              分类
              <motion.span className="inline-block ml-1" animate={{ rotate: categoryOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>▾</motion.span>
              {isCategoryActive && (
                <motion.div layoutId="nav-underline" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-purple-600 rounded-full" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              )}
            </button>
            <CategoryDropdown isOpen={categoryOpen} onClose={() => setCategoryOpen(false)} />
          </div>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <motion.a
            href="https://github.com/yyking12/wehub"
            target="_blank"
            rel="noopener noreferrer"
            className="glass px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            GitHub
          </motion.a>
        </div>

        {/* Mobile Right: Theme + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(true)}
            className="glass w-9 h-9 rounded-xl flex items-center justify-center text-gray-600"
            aria-label="打开菜单"
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="19" y2="1" />
              <line x1="1" y1="7" x2="19" y2="7" />
              <line x1="1" y1="13" x2="19" y2="13" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 glass z-70 p-6 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-gray-900">菜单</span>
                <button onClick={() => setMobileOpen(false)} className="glass w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900">
                  ✕
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200/50 my-2" />
                <Link
                  to="/category/gfw"
                  className="px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-100/50"
                >
                  📂 全部分类
                </Link>
              </nav>
              <a
                href="https://github.com/yyking12/wehub"
                target="_blank"
                rel="noopener noreferrer"
                className="glass px-4 py-3 rounded-xl text-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}