import { useMemo } from 'react';
import { useStore } from '@/store/calculatorStore';
import { EarningsChart } from '@/components/chart/EarningsChart';
import { formatProfit, formatRate, getProfitFromOperation, getRateSuffix } from '@/utils/formatters';

export function Historial() {
  const historial = useStore((s) => s.historial);
  const eliminarOperacion = useStore((s) => s.eliminarOperacion);
  const currency = useStore((s) => s.currency);

  const historialOrdenado = useMemo(
    () => [...historial].sort((a, b) => b.id - a.id),
    [historial],
  );

  const chartData = useMemo(
    () =>
      [...historial]
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
        })),
    [historial, currency],
  );

  if (historial.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 text-center">
        <p className="text-gray-400">No hay operaciones registradas aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EarningsChart data={chartData} currency={currency} />

      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Operaciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wide text-gray-500">
                <th className="pb-3 pr-4 font-medium">Fecha</th>
                <th className="pb-3 pr-4 font-medium">Tasa</th>
                <th className="pb-3 pr-4 font-medium">Ganancia Neta</th>
                <th className="pb-3 font-medium">
                  <span className="sr-only">Eliminar</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {historialOrdenado.map((op) => {
                const buyRate = op.tasaCompra ?? op.tasa;
                const displayProfit = getProfitFromOperation(op.ganancia, buyRate, currency);

                return (
                  <tr key={op.id} className="border-b border-gray-800/60 last:border-0">
                    <td className="py-3 pr-4 text-gray-300">{op.fecha}</td>
                    <td className="py-3 pr-4 text-gray-300">
                      {formatRate(op.tasa)} {getRateSuffix(currency)}
                    </td>
                    <td
                      className={`py-3 pr-4 font-medium ${
                        displayProfit >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {formatProfit(displayProfit, currency)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => eliminarOperacion(op.id)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-800 hover:text-red-400"
                        aria-label="Eliminar operación"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
