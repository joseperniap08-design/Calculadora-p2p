import { useMemo, useState } from 'react';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { calculateCycleProjection } from '@/utils/calculations';
import { formatMoney } from '@/utils/formatters';

interface MetaProjectionSectionProps {
  gananciaPorCiclo: number;
}

export function MetaProjectionSection({ gananciaPorCiclo }: MetaProjectionSectionProps) {
  const [metaGoal, setMetaGoal] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const projection = useMemo(
    () => calculateCycleProjection(metaGoal, gananciaPorCiclo),
    [metaGoal, gananciaPorCiclo],
  );

  const handleCalcular = () => {
    if (metaGoal > 0) {
      setShowResult(true);
    }
  };

  return (
    <div className="glass-card flex flex-col gap-4 border-green-500/20 p-4 glow-green">
      <h3 className="text-sm font-bold uppercase tracking-widest text-green-400">
        Proyectar Meta
      </h3>

      <InputField
        label="Ganancia Meta (USDT)"
        value={metaGoal}
        onChange={setMetaGoal}
        suffix="USDT"
        accent="green"
      />

      <Button variant="green" fullWidth onClick={handleCalcular}>
        Calcular Ciclos
      </Button>

      {showResult && metaGoal > 0 && (
        <div className="rounded-xl bg-slate-800/40 p-3">
          {projection.isValid ? (
            <p className="text-sm leading-relaxed text-slate-300">
              Para ganar{' '}
              <span className="font-bold text-green-400">{formatMoney(metaGoal)}</span>, necesitas
              completar{' '}
              <span className="font-bold text-green-400">{projection.ciclosNecesarios}</span>{' '}
              {projection.ciclosNecesarios === 1 ? 'ciclo' : 'ciclos'} con tu capital actual.
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              Con tu capital y tasas actuales, la operación no genera ganancia por ciclo. Ajusta las
              tasas o el capital para proyectar una meta.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
