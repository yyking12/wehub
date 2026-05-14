import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryDropdown from './CategoryDropdown';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/discover', label: '发现' },
  { to: '/hot', label: '热门' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isCategoryActive = location.pathname.startsWith('/category');

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-purple-500/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/discover" className="flex items-center gap-2 group">
          <motion.div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <span className="text-white font-black text-sm">W</span>
          </motion.div>
          <span className="text-xl font-bold text-gray-900">
            We<span className="text-purple-600">Hub</span>
          </span>
        </Link>

        {/* Nav Links */}
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

          {/* 分类按钮 */}
          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100/50 ${
                isCategoryActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              分类
              <motion.span
                className="inline-block ml-1"
                animate={{ rotate: categoryOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▾
              </motion.span>
              {isCategoryActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-purple-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
            <CategoryDropdown
              isOpen={categoryOpen}
              onClose={() => setCategoryOpen(false)}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            GitHub
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}
