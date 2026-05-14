import { motion } from 'framer-motion';
import AppCard from './AppCard';
import type { AppInfo } from '../types';

interface AppGridProps {
  apps: AppInfo[];
}

export default function AppGrid({ apps }: AppGridProps) {
  if (apps.length === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-500 text-lg">没有找到匹配的应用 😕</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, index) => (
          <AppCard key={app.id} app={app} index={index} />
        ))}
      </div>
    </div>
  );
}
