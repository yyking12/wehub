import { motion } from 'framer-motion';

const titleLine1 = '发现 安卓';
const titleLine2 = '开源之灵';

export default function HeroSection() {
  const chars1 = titleLine1.split('');
  const chars2 = titleLine2.split('');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* 微弱的中心光晕 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-400/5 to-pink-400/5 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-gray-500 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            已收录 60+ 个优质开源应用
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-none mb-6">
            <span className="block overflow-hidden">
              {chars1.map((char, i) => (
                <motion.span
                  key={i}
                  className={`inline-block ${char === '安' || char === '卓' ? 'text-gradient' : ''}`}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.04, type: 'spring', stiffness: 250, damping: 25 }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            <br />
            <span className="block overflow-hidden">
              {chars2.map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-gradient"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.04, type: 'spring', stiffness: 250, damping: 25 }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
          >
            WeHub 收录 GitHub 上最优秀的安卓开源应用，
            <br className="hidden md:block" />
            纯净 · 免费 · 无广告 · 尊重隐私
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
