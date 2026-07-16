import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CommissionRate,
  Currency,
  CurrencyRates,
  EarningsHistoryPoint,
  NavTab,
  Operacion,
} from '@/types';
import { calculateP2PResults } from '@/utils/calculations';
import { CURRENCY_CONFIG, CURRENCY_OPTIONS } from '@/utils/currencies';
import { roundCurrency } from '@/utils/formatters';

function createDefaultRatesByCurrency(): Record<Currency, CurrencyRates> {
  return Object.fromEntries(
    CURRENCY_OPTIONS.map((currency) => [
      currency,
      {
        buyRate: CURRENCY_CONFIG[currency].defaultBuyRate,
        sellRate: CURRENCY_CONFIG[currency].defaultSellRate,
        commissionRate: CURRENCY_CONFIG[currency].commissionRate,
      },
    ]),
  ) as Record<Currency, CurrencyRates>;
}

function updateCurrencyRates(
  ratesByCurrency: Record<Currency, CurrencyRates>,
  currency: Currency,
  patch: Partial<CurrencyRates>,
): Record<Currency, CurrencyRates> {
  return {
    ...ratesByCurrency,
    [currency]: { ...ratesByCurrency[currency], ...patch },
  };
}

interface CalculatorState {
  capital: number;
  ratesByCurrency: Record<Currency, CurrencyRates>;
  currency: Currency;
  activeTab: NavTab;
  historial: Operacion[];

  setCapital: (value: number) => void;
  setBuyRate: (value: number) => void;
  setSellRate: (value: number) => void;
  setCommissionRate: (value: CommissionRate) => void;
  setCurrency: (value: Currency) => void;
  setActiveTab: (tab: NavTab) => void;
  guardarOperacion: (operacion: Operacion) => void;
  eliminarOperacion: (id: number) => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      capital: 500,
      ratesByCurrency: createDefaultRatesByCurrency(),
      currency: 'VES',
      activeTab: 'calculadora',
      historial: [],

      setCapital: (value) => set({ capital: roundCurrency(value) }),
      setBuyRate: (value) =>
        set((state) => ({
          ratesByCurrency: updateCurrencyRates(state.ratesByCurrency, state.currency, {
            buyRate: value,
          }),
        })),
      setSellRate: (value) =>
        set((state) => ({
          ratesByCurrency: updateCurrencyRates(state.ratesByCurrency, state.currency, {
            sellRate: value,
          }),
        })),
      setCommissionRate: (value) =>
        set((state) => ({
          ratesByCurrency: updateCurrencyRates(state.ratesByCurrency, state.currency, {
            commissionRate: value,
          }),
        })),
      setCurrency: (value) => set({ currency: value }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      guardarOperacion: (operacion) => {
        set((state) => ({
          historial: [operacion, ...state.historial],
        }));
      },

      eliminarOperacion: (id) => {
        set((state) => ({
          historial: state.historial.filter((op) => op.id !== id),
        }));
      },
    }),
    {
      name: 'p2p-historial-storage',
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Record<string, unknown>;
        const ratesByCurrency = createDefaultRatesByCurrency();
        const currency = (state.currency as Currency) ?? 'VES';

        if (typeof state.buyRate === 'number' && typeof state.sellRate === 'number') {
          ratesByCurrency[currency] = {
            buyRate: state.buyRate as number,
            sellRate: state.sellRate as number,
            commissionRate: (state.commissionRate as CommissionRate) ?? ratesByCurrency[currency].commissionRate,
          };
        }

        const historial = Array.isArray(state.historial)
          ? (state.historial as Operacion[]).map((op) => ({
              ...op,
              currency: op.currency ?? currency,
            }))
          : [];

        return {
          capital: state.capital ?? 500,
          ratesByCurrency,
          currency,
          activeTab: state.activeTab ?? 'calculadora',
          historial,
        };
      },
      partialize: (state) => ({
        historial: state.historial,
        capital: state.capital,
        ratesByCurrency: state.ratesByCurrency,
        currency: state.currency,
      }),
    },
  ),
);

export const useStore = useCalculatorStore;

export function useCurrentRates(): CurrencyRates {
  const currency = useCalculatorStore((s) => s.currency);
  const ratesByCurrency = useCalculatorStore((s) => s.ratesByCurrency);
  return ratesByCurrency[currency];
}

export function useCalculationResults() {
  const capital = useCalculatorStore((s) => s.capital);
  const currency = useCalculatorStore((s) => s.currency);
  const ratesByCurrency = useCalculatorStore((s) => s.ratesByCurrency);
  const { buyRate, sellRate, commissionRate } = ratesByCurrency[currency];

  return calculateP2PResults({ capital, buyRate, sellRate, commissionRate });
}

export function useEarningsChartData(): EarningsHistoryPoint[] {
  const historial = useCalculatorStore((s) => s.historial);

  return useMemo(
    () =>
      [...historial]
        .sort((a, b) => a.id - b.id)
        .slice(-7)
        .map((op) => ({
          date: op.fecha,
          label: op.fecha,
          profit: op.ganancia,
        })),
    [historial],
  );
}
