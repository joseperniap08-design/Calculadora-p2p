import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: 'green' | 'blue' | 'none';
}

const glowClasses = {
  green: 'glow-green border-green-500/30',
  blue: 'glow-blue border-blue-500/30',
  none: 'border-slate-800/60',
};

export function Card({ children, className = '', glow = 'none' }: CardProps) {
  return (
    <div className={`glass-card ${glowClasses[glow]} ${className}`}>
      {children}
    </div>
  );
}
