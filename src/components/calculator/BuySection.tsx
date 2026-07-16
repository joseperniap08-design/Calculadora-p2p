import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import type { BuyResults, CommissionRate, Currency } from '@/types';
import { formatUsdt, getRateSuffix } from '@/utils/formatters';

interface BuySectionProps {
  buyRate: number;
  capital: number;
  commissionRate: CommissionRate;
  currency: Currency;
  results: BuyResults;
  onBuyRateChange: (value: number) => void;
  onCapitalChange: (value: number) => void;
}

export function BuySection({
  buyRate,
  capital,
  commissionRate,
  currency,
  results,
  onBuyRateChange,
  onCapitalChange,
}: BuySectionProps) {
  const commissionPercent = (commissionRate * 100).toFixed(2);

  return (
    <div className="glass-card flex h-full flex-col gap-4 border-green-500/20 p-4 glow-green">
      <h3 className="text-sm font-bold uppercase tracking-widest text-green-400">Compra</h3>

      <InputField
        label="Tasa de Compra"
        value={buyRate}
        onChange={onBuyRateChange}
        suffix={getRateSuffix(currency)}
        accent="green"
      />

      <InputField
        label="Capital"
        value={capital}
        onChange={onCapitalChange}
        suffix="USDT"
        accent="green"
      />

      <div className="flex-1 space-y-2 rounded-xl bg-slate-800/40 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">USDT Comprados</span>
          <span className="text-sm font-bold text-green-400">
            {formatUsdt(results.usdtBought)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Comisión de Compra ({commissionPercent}%)
          </span>
          <span className="text-sm font-semibold text-slate-300">
            {formatUsdt(results.buyCommission)}
          </span>
        </div>
      </div>

      <Button variant="green" fullWidth className="mt-auto">
        Comprar
      </Button>
    </div>
  );
}
