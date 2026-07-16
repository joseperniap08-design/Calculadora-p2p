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

interface PersistedCalculatorState {
  capital: number;
  ratesByCurrency: Record<Currency, CurrencyRates>;
  currency: Currency;
  historial: Operacion[];
}

function isCommissionRate(value: unknown): value is CommissionRate {
  return value === 0 || value === 0.0025 || value === 0.0035;
}

function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && CURRENCY_OPTIONS.includes(value as Currency);
}

function migratePersistedState(persistedState: unknown): PersistedCalculatorState {
  const state = (persistedState ?? {}) as Record<string, unknown>;
  const ratesByCurrency = createDefaultRatesByCurrency();
  const currency = isCurrency(state.currency) ? state.currency : 'VES';

  if (typeof state.buyRate === 'number' && typeof state.sellRate === 'number') {
    ratesByCurrency[currency] = {
      buyRate: state.buyRate,
      sellRate: state.sellRate,
      commissionRate: isCommissionRate(state.commissionRate)
        ? state.commissionRate
        : ratesByCurrency[currency].commissionRate,
    };
  } else if (state.ratesByCurrency && typeof state.ratesByCurrency === 'object') {
    const savedRates = state.ratesByCurrency as Partial<Record<Currency, CurrencyRates>>;

    for (const option of CURRENCY_OPTIONS) {
      const saved = savedRates[option];
      if (!saved) continue;

      ratesByCurrency[option] = {
        buyRate: typeof saved.buyRate === 'number' ? saved.buyRate : ratesByCurrency[option].buyRate,
        sellRate: typeof saved.sellRate === 'number' ? saved.sellRate : ratesByCurrency[option].sellRate,
        commissionRate: isCommissionRate(saved.commissionRate)
          ? saved.commissionRate
          : ratesByCurrency[option].commissionRate,
      };
    }
  }

  const historial = Array.isArray(state.historial)
    ? (state.historial as Operacion[]).map((op) => ({
        ...op,
        currency: isCurrency(op.currency) ? op.currency : currency,
      }))
    : [];

  return {
    capital: typeof state.capital === 'number' ? state.capital : 500,
    ratesByCurrency,
    currency,
    historial,
  };
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
      version: 3,
      migrate: (persistedState): PersistedCalculatorState =>
        migratePersistedState(persistedState),
      partialize: (state): PersistedCalculatorState => ({
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
  return {
    ...ratesByCurrency[currency],
    commissionRate: CURRENCY_CONFIG[currency].commissionRate,
  };
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
