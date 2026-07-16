import type { Currency } from '@/types';
import { CURRENCY_LABELS, CURRENCY_OPTIONS } from '@/utils/currencies';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onMenuOpen: () => void;
}

export function Header({ currency, onCurrencyChange, onMenuOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-deep-black/80 px-4 py-3 backdrop-blur-lg">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white"
          aria-label="Menú"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-slate-300">Calculadora de</span>
          <span className="text-base font-extrabold text-gradient-blue sm:text-lg">
            Ganancias P2P
          </span>
        </div>

        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as Currency)}
          className="cursor-pointer rounded-lg border border-slate-700/60 bg-slate-800/60 px-2 py-1.5 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {CURRENCY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
