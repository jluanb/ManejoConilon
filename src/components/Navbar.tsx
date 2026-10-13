import React from 'react';
import { 
  Coffee, 
  Layers, 
  ArrowLeftRight, 
  Warehouse, 
  Calculator, 
  HardDriveDownload, 
  Plus, 
  Menu, 
  X,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { CoffeeLot, CoffeePriceQuote } from '../types/coffee';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lots: CoffeeLot[];
  quotes: CoffeePriceQuote[];
  onOpenNewLot: () => void;
  onOpenNewMovement: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lots,
  quotes,
  onOpenNewLot,
  onOpenNewMovement,
  onOpenBackup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const totalBags = lots.reduce((sum, lot) => sum + (lot.status !== 'Vendido' ? lot.bagsCount : 0), 0);
  const conilonQuote = quotes.find(q => q.group === 'Conilon') || quotes[0];

  const navItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: Layers },
    { id: 'lots', label: 'Lotes de Café', icon: Coffee },
    { id: 'movements', label: 'Movimentações', icon: ArrowLeftRight },
    { id: 'warehouses', label: 'Tulhas & Armazéns', icon: Warehouse },
    { id: 'calculator', label: 'Calculadora & Quebra', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#2C1810] text-[#F5EDE6] border-b border-[#4A2E20] shadow-md">
      {/* Top micro ticker for quotes and quick stats */}
      <div className="bg-[#1F100A] text-xs px-4 py-1.5 flex items-center justify-between border-b border-[#3B2216] overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4 text-[#D7CCC8]">
          <span className="flex items-center gap-1.5 font-medium text-amber-300">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            Cotação Conilon: 
            <strong className="text-white">R$ {conilonQuote?.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/sc</strong>
          </span>
          <span className="hidden sm:inline text-amber-200/60">•</span>
          <span className="hidden sm:inline text-[#BCAAA4]">
            Ref: {conilonQuote?.referenceLocation || 'Cooabriel / Norte ES'}
          </span>
          <span className="hidden md:inline text-amber-200/60">•</span>
          <span className="hidden md:flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Armazenamento 100% Local (Seguro e Sem Custos)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-200 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded font-mono font-semibold text-xs">
            {totalBags.toLocaleString('pt-BR')} sacas em estoque
          </span>
          <button
            onClick={onOpenBackup}
            className="text-xs text-amber-200 hover:text-white flex items-center gap-1 bg-[#3E2317] hover:bg-[#523020] px-2 py-0.5 rounded transition"
            title="Backup e Transferência entre Dispositivos"
          >
            <HardDriveDownload className="w-3 h-3 text-amber-400" />
            <span className="hidden xs:inline">Backup & Sinc</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-inner border border-amber-500/40">
              <Coffee className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-serif">Conilon Stock</span>
                <span className="text-xs uppercase font-extrabold tracking-widest bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 leading-none">Gestão de Estoque Cafeeiro</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenNewMovement}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#3E2317] hover:bg-[#523020] text-amber-200 border border-amber-800/60 shadow-sm transition active:scale-95"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              Movimentação / Romaneio
            </button>
            <button
              onClick={onOpenNewLot}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Lote
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenNewLot}
              className="p-2 rounded-lg bg-emerald-700 text-white sm:hidden"
              title="Cadastrar Lote"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/60"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#4A2E20] bg-[#22130C] px-4 pt-2 pb-4 space-y-1 animate-in fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-stone-300 hover:bg-stone-800/40'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-[#3B2216] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenNewMovement();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold bg-[#3E2317] text-amber-200 border border-amber-800/60"
            >
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              Lançar Entrada / Saída
            </button>
            <button
              onClick={() => {
                onOpenNewLot();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Novo Lote de Café
            </button>
            <button
              onClick={() => {
                onOpenBackup();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-white"
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-amber-400" />
              Gerenciar Backup & Transferência de Dados
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
