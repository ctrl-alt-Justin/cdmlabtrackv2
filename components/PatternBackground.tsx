import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { generatePalette } from '../utils/colorUtils';

const PatternBackground = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { colorTheme, customColor } = useTheme();

  useEffect(() => {
    // Detect mobile device on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const themeColors = {
    orange: {
      orb1: 'bg-orange-600',
      orb2: 'bg-red-600',
      orb3: 'bg-purple-900',
      orb4: 'bg-orange-500'
    },
    violet: {
      orb1: 'bg-violet-600',
      orb2: 'bg-indigo-600',
      orb3: 'bg-fuchsia-900',
      orb4: 'bg-violet-500'
    },
    custom: {
      orb1: '', orb2: '', orb3: '', orb4: ''
    }
  };

  const colors = themeColors[colorTheme];

  // Generate palette if custom
  const customPalette = colorTheme === 'custom' ? generatePalette(customColor) : null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-80" />

      {/* Floating Orbs - Static on mobile */}
      <div className="absolute inset-0 opacity-80">
        {/* Orb 1 - Top Left */}
        <motion.div
          animate={isMobile ? {} : {
            x: [0, 300, 0],
            y: [0, 150, 0],
            scale: [1, 1.4, 1],
          }}
          transition={isMobile ? {} : {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={customPalette ? { background: `radial-gradient(circle, ${customPalette.primary} 0%, transparent 70%)` } : {}}
          className={`absolute -top-20 -left-20 w-96 h-96 ${colors.orb1} rounded-full blur-[100px] opacity-60 transition-colors duration-1000`}
        />

        {/* Orb 2 - Bottom Right */}
        <motion.div
          animate={isMobile ? {} : {
            x: [0, -300, 0],
            y: [0, -150, 0],
            scale: [1, 1.6, 1],
          }}
          transition={isMobile ? {} : {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={customPalette ? { background: `radial-gradient(circle, ${customPalette.secondary} 0%, transparent 70%)` } : {}}
          className={`absolute -bottom-32 -right-32 w-[500px] h-[500px] ${colors.orb2} rounded-full blur-[100px] opacity-50 transition-colors duration-1000`}
        />

        {/* Orb 3 - Center/Moving - Hidden on mobile for performance */}
        {!isMobile && (
          <motion.div
            animate={{
              x: [0, 400, -400, 0],
              y: [0, -200, 200, 0],
              scale: [1, 1.4, 0.8, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            style={customPalette ? { background: `radial-gradient(circle, ${customPalette.dark} 0%, transparent 70%)` } : {}}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${colors.orb3} rounded-full blur-[120px] opacity-40 transition-colors duration-1000`}
          />
        )}

        {/* Orb 4 - Top Right - Hidden on mobile */}
        {!isMobile && (
          <motion.div
            animate={{
              x: [0, -150, 0],
              y: [0, 200, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={customPalette ? { background: `radial-gradient(circle, ${customPalette.highlight} 0%, transparent 70%)` } : {}}
            className={`absolute top-0 right-0 w-80 h-80 ${colors.orb4} rounded-full blur-[80px] opacity-40 transition-colors duration-1000`}
          />
        )}
      </div>

      {/* Noise Texture Overlay - Reduced opacity on mobile */}
      <div className={`absolute inset-0 mix-blend-overlay ${isMobile ? 'opacity-[0.01]' : 'opacity-[0.03]'}`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Blur overlay for readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
    </div>
  );
}

export default PatternBackground;
