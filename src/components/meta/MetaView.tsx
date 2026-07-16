import { CapitalCard } from '@/components/calculator/CapitalCard';
import { MetaProjectionSection } from '@/components/calculator/MetaProjectionSection';
import { NetProfitCard } from '@/components/calculator/NetProfitCard';
import type { CalculationResults, Currency } from '@/types';

interface MetaViewProps {
  capital: number;
  sellRate: number;
  currency: Currency;
  results: CalculationResults;
}

export function MetaView({ capital, sellRate, currency, results }: MetaViewProps) {
  return (
    <div className="space-y-4">
      <div className="glass-card border-green-500/30 p-4 glow-green">
        <h2 className="text-lg font-bold text-green-400">Meta</h2>
        <p className="mt-1 text-sm text-slate-400">
          Proyecta cuántos ciclos necesitas para alcanzar tu objetivo de ganancia.
        </p>
      </div>

      <CapitalCard capital={capital} />
      <NetProfitCard
        capital={capital}
        sellRate={sellRate}
        currency={currency}
        results={results}
      />
      <MetaProjectionSection gananciaPorCiclo={results.netProfitUsdt} />
    </div>
  );
}
