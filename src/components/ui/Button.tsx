import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'green' | 'blue' | 'ghost';
  className?: string;
  fullWidth?: boolean;
}

const variants = {
  green:
    'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:from-green-400 hover:to-green-500 active:scale-[0.98]',
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-blue-500 active:scale-[0.98]',
  ghost:
    'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:bg-slate-700/60 active:scale-[0.98]',
};

export function Button({
  children,
  onClick,
  variant = 'blue',
  className = '',
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
