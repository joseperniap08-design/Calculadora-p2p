import { useCalculationResults, useCalculatorStore } from '@/store/calculatorStore';

/**
 * Hook que expone el estado de la calculadora y los resultados calculados en tiempo real.
 */
export function useCalculator() {
  const store = useCalculatorStore();
  const results = useCalculationResults();

  return {
    ...store,
    results,
  };
}
