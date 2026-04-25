'use client';

import { motion } from 'framer-motion';
import React from 'react';

// Button hover effect
export const HoverButton = ({ children, onClick, className = '' }: any) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`transition-all ${className}`}
  >
    {children}
  </motion.button>
);

// Loading spinner animation
export const LoadingSpinner = ({ size = 40 }: { size?: number }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    style={{
      width: size,
      height: size,
      border: `3px solid rgba(0,0,0,0.1)`,
      borderTop: `3px solid currentColor`,
      borderRadius: '50%',
    }}
  />
);

// Success animation
export const SuccessAnimation = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    className="flex items-center justify-center"
  >
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <motion.circle
        cx="32"
        cy="32"
        r="30"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d="M20 32l8 8 16-16"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </motion.svg>
  </motion.div>
);

// Error animation
export const ErrorAnimation = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
  >
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      animate={{ rotate: [0, -5, 5, -5, 0] }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <circle cx="32" cy="32" r="30" />
      <path d="M20 20l24 24M44 20l-24 24" />
    </motion.svg>
  </motion.div>
);

// Page transition wrapper
export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Skeleton loader
export const SkeletonLoader = ({ width = '100%', height = '20px', count = 3 }: any) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ width, height }}
        className="bg-gray-200 dark:bg-gray-700 rounded"
      />
    ))}
  </div>
);

// Confetti animation
export const Confetti = () => {
  const confetti = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 10,
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: 2 + Math.random() * 1,
            ease: 'easeIn',
          }}
          className="absolute w-2 h-2 bg-blue-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Staggered list animation
export const StaggerContainer = ({ children, delay = 0.1 }: any) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: delay,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children }: any) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    {children}
  </motion.div>
);
