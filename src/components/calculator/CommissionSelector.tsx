import type { CommissionRate } from '@/types';
import { COMMISSION_OPTIONS } from '@/utils/calculations';

interface CommissionSelectorProps {
  value: CommissionRate;
  onChange: (value: CommissionRate) => void;
}

export function CommissionSelector({ value, onChange }: CommissionSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-slate-400">Comisión</span>
      <div className="flex rounded-full bg-slate-800/80 p-1">
        {COMMISSION_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              value === option.value
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
