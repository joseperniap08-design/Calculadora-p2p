interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  accent?: 'green' | 'blue';
}

const accentRing = {
  green: 'focus:ring-green-500/50 focus:border-green-500/50',
  blue: 'focus:ring-blue-500/50 focus:border-blue-500/50',
};

export function InputField({
  label,
  value,
  onChange,
  suffix,
  accent = 'blue',
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-3 py-2.5 text-sm font-semibold text-white outline-none transition-all focus:ring-2 ${accentRing[accent]}`}
          step="any"
          min="0"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
