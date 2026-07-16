import type { CalculationResults, Currency } from '@/types';
import { formatMoney, formatPercent, formatProfitLocal, formatProfitUsdt } from '@/utils/formatters';
import { getDisplayAmounts } from '@/utils/currencyDisplay';

interface NetProfitCardProps {
  capital: number;
  sellRate: number;
  currency: Currency;
  results: CalculationResults;
}

export function NetProfitCard({ capital, sellRate, currency, results }: NetProfitCardProps) {
  const display = getDisplayAmounts(
    capital,
    results.sell,
    sellRate,
    results.netProfitUsdt,
    results.netProfit,
  );
  const isProfitable = results.netProfit > 0;

  return (
    <div className="glass-card border-green-500/30 p-5 glow-green">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
        Ganancia Neta
      </p>

      <div className="mb-1 flex items-center gap-3">
        <p
          className={`text-4xl font-extrabold sm:text-5xl ${
            isProfitable ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {formatProfitUsdt(display.netProfit)}
        </p>

        {isProfitable && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Operación rentable
          </span>
        )}
      </div>

      <p
        className={`mb-3 text-sm font-medium ${
          isProfitable ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        {formatProfitLocal(display.netProfitLocal, currency)}
      </p>

      <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-800/40 p-3">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">ROI</p>
          <p className="text-sm font-bold text-white">{formatPercent(results.roi)}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Nuevo Capital</p>
          <p className="text-sm font-bold text-white">{formatMoney(display.newCapital)}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Resultado</p>
          <p className={`text-sm font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
            {isProfitable ? 'Ganancia' : 'Pérdida'}
          </p>
        </div>
      </div>
    </div>
  );
}
