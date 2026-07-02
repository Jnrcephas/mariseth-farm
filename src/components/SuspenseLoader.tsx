'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  logo?: React.ReactNode;
  backgroundColor?: string;
}

export function SuspenseLoader({
  logo = <DefaultLogo />,
  backgroundColor = 'bg-background',
}: LoadingScreenProps) {
  // This helps prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${backgroundColor}`}
    >
      <motion.div
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
        className="w-16 h-16 md:w-24 md:h-24 animate-pulse"
      >
        {logo}
      </motion.div>
    </div>
  );
}

export function DefaultLogo() {
  return <img src="/images/meriseth-logo.svg" alt="Logo" className="w-[120px] h-[120px]" />;
}

export function SuspenseLogo(){
  return(
    <motion.div
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
        className="w-16 h-16 md:w-24 md:h-24 animate-pulse" 
      >
        <DefaultLogo/>
      </motion.div>
  )
}
