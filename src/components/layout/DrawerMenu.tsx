import { Calculator, History, Target, X } from 'lucide-react';
import type { NavTab } from '@/types';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const menuItems: { id: NavTab; label: string; icon: typeof Calculator }[] = [
  { id: 'calculadora', label: 'Calculadora', icon: Calculator },
  { id: 'historial', label: 'Historial', icon: History },
  { id: 'meta', label: 'Meta', icon: Target },
];

export function DrawerMenu({ isOpen, onClose, activeTab, onTabChange }: DrawerMenuProps) {
  const handleTabChange = (tab: NavTab) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed left-0 top-0 z-[70] flex h-full w-72 flex-col border-r border-gray-800 bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="border-b border-gray-800 px-6 pb-6 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="CalculatorP2P"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-lg font-extrabold text-transparent">
                CalculatorP2P
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-900 hover:text-white"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => handleTabChange(id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="border-t border-gray-800 px-6 py-4">
          <p className="cursor-default text-center text-[10px] text-gray-600">v1.0.0</p>
        </footer>
      </aside>
    </>
  );
}
