import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import type { CommissionRate, Currency, SellResults } from '@/types';
import { formatMoney, getRateSuffix } from '@/utils/formatters';
import { getDisplayAmounts } from '@/utils/currencyDisplay';

interface SellSectionProps {
  sellRate: number;
  capital: number;
  commissionRate: CommissionRate;
  currency: Currency;
  results: SellResults;
  netProfitUsdt: number;
  netProfitLocal: number;
  onSellRateChange: (value: number) => void;
  onGuardar: () => void;
}

export function SellSection({
  sellRate,
  capital,
  commissionRate,
  currency,
  results,
  netProfitUsdt,
  netProfitLocal,
  onSellRateChange,
  onGuardar,
}: SellSectionProps) {
  const commissionPercent = (commissionRate * 100).toFixed(2);
  const display = getDisplayAmounts(
    capital,
    results,
    sellRate,
    netProfitUsdt,
    netProfitLocal,
  );

  return (
    <div className="glass-card flex h-full flex-col gap-4 border-blue-500/20 p-4 glow-blue">
      <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Venta</h3>

      <InputField
        label="Tasa de Venta"
        value={sellRate}
        onChange={onSellRateChange}
        suffix={getRateSuffix(currency)}
        accent="blue"
      />

      <div aria-hidden className="pointer-events-none invisible">
        <InputField label="Capital" value={0} onChange={() => {}} suffix="USDT" accent="blue" />
      </div>

      <div className="flex-1 space-y-2 rounded-xl bg-slate-800/40 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Total Bruto</span>
          <span className="text-sm font-bold text-blue-400">
            {formatMoney(display.grossTotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Comisión de Venta ({commissionPercent}%)
          </span>
          <span className="text-sm font-semibold text-slate-300">
            {formatMoney(display.sellCommission)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-700/50 pt-2">
          <span className="text-xs font-medium text-slate-300">Total Obtenido</span>
          <span className="text-sm font-bold text-blue-400">
            {formatMoney(display.netTotal)}
          </span>
        </div>
      </div>

      <Button variant="blue" fullWidth className="mt-auto" onClick={onGuardar}>
        Guardar
      </Button>
    </div>
  );
}
