import { useState } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { useStore } from '@/store/calculatorStore';
import { Header } from '@/components/layout/Header';
import { DrawerMenu } from '@/components/layout/DrawerMenu';
import { BottomNav } from '@/components/layout/BottomNav';
import { CapitalCard } from '@/components/calculator/CapitalCard';
import { CommissionSelector } from '@/components/calculator/CommissionSelector';
import { BuySection } from '@/components/calculator/BuySection';
import { SellSection } from '@/components/calculator/SellSection';
import { NetProfitCard } from '@/components/calculator/NetProfitCard';
import { EarningsChart } from '@/components/chart/EarningsChart';
import { Historial } from '@/components/historial/Historial';
import { MetaView } from '@/components/meta/MetaView';
import { formatDate, getProfitFromOperation } from '@/utils/formatters';
import { getDisplayAmounts } from '@/utils/currencyDisplay';

export function Calculator() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const guardarOperacion = useStore((s) => s.guardarOperacion);
  const {
    capital,
    buyRate,
    sellRate,
    commissionRate,
    currency,
    activeTab,
    results,
    setCapital,
    setBuyRate,
    setSellRate,
    setCommissionRate,
    setCurrency,
    setActiveTab,
  } = useCalculator();

  const displayCapital = getDisplayAmounts(
    capital,
    results.sell,
    buyRate,
    sellRate,
    currency,
  ).capital;

  const chartData = useStore((s) => s.historial)
    .slice()
    .sort((a, b) => a.id - b.id)
    .slice(-7)
    .map((op) => ({
      date: op.fecha,
      label: op.fecha,
      profit: getProfitFromOperation(
        op.ganancia,
        op.tasaCompra ?? op.tasa,
        currency,
      ),
    }));

  const handleGuardarOperacion = () => {
    guardarOperacion({
      id: Date.now(),
      fecha: formatDate(),
      tasa: sellRate,
      tasaCompra: buyRate,
      ganancia: results.netProfit,
    });
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        onMenuOpen={() => setDrawerOpen(true)}
      />

      <DrawerMenu
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-4 px-4 py-4 pb-24">
        {activeTab === 'historial' ? (
          <Historial />
        ) : activeTab === 'meta' ? (
          <MetaView
            capital={capital}
            buyRate={buyRate}
            sellRate={sellRate}
            currency={currency}
            results={results}
          />
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <CommissionSelector value={commissionRate} onChange={setCommissionRate} />

              <button
                type="button"
                onClick={() => setActiveTab('historial')}
                className="flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700/60"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Historial
              </button>
            </div>

            <CapitalCard capital={displayCapital} currency={currency} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch">
              <BuySection
                buyRate={buyRate}
                capital={capital}
                commissionRate={commissionRate}
                currency={currency}
                results={results.buy}
                onBuyRateChange={setBuyRate}
                onCapitalChange={setCapital}
              />

              <SellSection
                sellRate={sellRate}
                capital={capital}
                buyRate={buyRate}
                commissionRate={commissionRate}
                currency={currency}
                results={results.sell}
                onSellRateChange={setSellRate}
                onGuardar={handleGuardarOperacion}
              />
            </div>

            <NetProfitCard
              capital={capital}
              buyRate={buyRate}
              sellRate={sellRate}
              currency={currency}
              results={results}
            />

            <EarningsChart data={chartData} currency={currency} />
          </>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
