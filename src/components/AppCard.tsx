import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { AppInfo } from '../types';

interface AppCardProps {
  app: AppInfo;
  index: number;
}

export default function AppCard({ app, index }: AppCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.8),
        ease: [0.2, 0.0, 0.0, 1.0],
      }}
      viewport={{ once: true, margin: '-40px' }}
    >
      <Link to={`/app/${app.id}`}>
        <motion.div
          className="relative glass rounded-2xl p-5 cursor-pointer card-shadow transition-all duration-300"
          whileHover={{ y: -6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-zinc-800/60 overflow-hidden flex-shrink-0 ring-1 ring-white/5"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <img
                src={app.icon}
                alt={app.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const char = app.name[0] || '?';
                  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23222" width="100" height="100"/><text x="50" y="70" text-anchor="middle" fill="%23555" font-size="50" font-family="sans-serif">${char}</text></svg>`;
                  target.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                }}
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-semibold text-base truncate">{app.name}</h3>
              <p className="text-gray-400 text-xs mt-0.5">@{app.author}</p>
            </div>
            <div className="flex items-center gap-1 glass rounded-full px-3 py-1 text-xs text-gray-500">
              <span className="text-yellow-400">⭐</span>
              {app.stars >= 1000 ? `${(app.stars / 1000).toFixed(1)}k` : app.stars}
            </div>
          </div>
          
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {app.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium glass px-3 py-1 rounded-full text-purple-300 border-purple-400/20">
              {app.category}
            </span>
            {app.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs font-medium glass px-3 py-1 rounded-full text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
