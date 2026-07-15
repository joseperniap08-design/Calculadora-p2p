import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CommissionRate, Currency, EarningsHistoryPoint, NavTab, Operacion } from '@/types';
import { calculateP2PResults } from '@/utils/calculations';
import { roundCurrency } from '@/utils/formatters';

interface CalculatorState {
  capital: number;
  buyRate: number;
  sellRate: number;
  commissionRate: CommissionRate;
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
      buyRate: 817,
      sellRate: 825,
      commissionRate: 0.0025,
      currency: 'USDT',
      activeTab: 'calculadora',
      historial: [],

      setCapital: (value) => set({ capital: roundCurrency(value) }),
      setBuyRate: (value) => set({ buyRate: value }),
      setSellRate: (value) => set({ sellRate: value }),
      setCommissionRate: (value) => set({ commissionRate: value }),
      setCurrency: (value) =>
        set((state) => {
          if (value === state.currency) return state;

          if (value === 'USD') {
            return {
              currency: 'USD',
              buyRate: 1.025,
              sellRate: 1.035,
              commissionRate: 0.0035,
            };
          }

          if (state.currency === 'USD' && (value === 'VES' || value === 'USDT')) {
            return {
              currency: value,
              buyRate: 817,
              sellRate: 825,
              commissionRate: 0.0025,
            };
          }

          return { currency: value };
        }),
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
      partialize: (state) => ({
        historial: state.historial,
        capital: state.capital,
      }),
    },
  ),
);

export const useStore = useCalculatorStore;

export function useCalculationResults() {
  const capital = useCalculatorStore((s) => s.capital);
  const buyRate = useCalculatorStore((s) => s.buyRate);
  const sellRate = useCalculatorStore((s) => s.sellRate);
  const commissionRate = useCalculatorStore((s) => s.commissionRate);

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
