import { useCalculationResults, useCalculatorStore, useCurrentRates } from '@/store/calculatorStore';

/**
 * Hook que expone el estado de la calculadora y los resultados calculados en tiempo real.
 */
export function useCalculator() {
  const store = useCalculatorStore();
  const results = useCalculationResults();
  const { buyRate, sellRate, commissionRate } = useCurrentRates();

  return {
    ...store,
    buyRate,
    sellRate,
    commissionRate,
    results,
  };
}
