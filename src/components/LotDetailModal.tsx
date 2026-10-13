import React from 'react';
import { X, Coffee, Droplets, Warehouse, DollarSign, Calendar, ArrowDownLeft, ArrowUpRight, Edit3, Printer, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CoffeeLot } from '../types/coffee';

interface LotDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: CoffeeLot | null;
  onEditLot: (lot: CoffeeLot) => void;
  onOpenMovement: (lot: CoffeeLot, type: 'ENTRADA' | 'SAIDA') => void;
}

export const LotDetailModal: React.FC<LotDetailModalProps> = ({
  isOpen,
  onClose,
  lot,
  onEditLot,
  onOpenMovement,
}) => {
  if (!isOpen || !lot) return null;

  const totalValue = lot.bagsCount * lot.estimatedPricePerBag;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 print:m-0 print:border-none animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="bg-[#2C1810] text-[#F5EDE6] px-6 py-4 flex items-center justify-between border-b border-[#4A2E20] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/40">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">{lot.code}</h2>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-semibold">
                  Safra {lot.harvestYear}
                </span>
              </div>
              <p className="text-xs text-amber-200/70">{lot.variety} • {lot.processType}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status e Volume Banner */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Volume Disponível</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black font-mono text-stone-900">{lot.bagsCount}</span>
                <span className="text-xs text-stone-600 font-medium">sacas (60kg)</span>
              </div>
              <span className="text-xs text-stone-500 font-mono mt-0.5 block">
                {(lot.bagsCount * 60).toLocaleString('pt-BR')} kg • {((lot.bagsCount * 60) / 1000).toFixed(2)} toneladas
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Valor Estimado</span>
              <div className="text-xl font-black font-mono text-emerald-700 mt-0.5">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-stone-500 font-mono">
                R$ {lot.estimatedPricePerBag.toFixed(2)} / saca
              </span>
            </div>
          </div>

          {/* Dados Físicos e Agronômicos */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
              <span className="text-stone-500 flex items-center gap-1 font-semibold">
                <Droplets className="w-3.5 h-3.5 text-stone-400" />
                Teor de Umidade
              </span>
              <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-stone-900">
                {lot.moisture}%
                {lot.moisture > 12.5 ? (
                  <span className="text-[10px] text-red-600 font-bold flex items-center gap-0.5">
                    <AlertTriangle className="w-3 h-3" /> Atenção
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Ideal
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
              <span className="text-stone-500 flex items-center gap-1 font-semibold">
                <Warehouse className="w-3.5 h-3.5 text-stone-400" />
                Local no Armazém
              </span>
              <span className="font-bold text-stone-900 block truncate">{lot.warehouseLocation}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
              <span className="text-stone-500 font-semibold">Peneira / Granulometria</span>
              <span className="font-mono text-stone-900 font-bold block">{lot.sieve || 'Padrão Bica'}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
              <span className="text-stone-500 font-semibold">Classificação / Defeitos</span>
              <span className="font-mono text-stone-900 font-bold block">{lot.defects || 'Tipo 7'}</span>
            </div>
          </div>

          {/* Produtor & Origem */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Produtor / Fazenda:</span>
              <strong className="text-stone-900">{lot.producer}</strong>
            </div>
            {lot.farmLocation && (
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Localização / Talhão:</span>
                <span className="text-stone-700">{lot.farmLocation}</span>
              </div>
            )}
            {lot.cupProfile && (
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Padrão de Bebida:</span>
                <span className="text-stone-700 font-medium">{lot.cupProfile}</span>
              </div>
            )}
          </div>

          {/* Observações */}
          {lot.notes && (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-stone-700">
              <strong className="text-amber-950 block mb-0.5">Notas do Cafeicultor:</strong>
              {lot.notes}
            </div>
          )}

          {/* Ações Rápidas (Ocultas na Impressão) */}
          <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 print:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenMovement(lot, 'ENTRADA');
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Lançar Entrada
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenMovement(lot, 'SAIDA');
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-xs flex items-center gap-1.5 transition"
                disabled={lot.bagsCount <= 0}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Lançar Venda
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg text-stone-700 hover:bg-stone-100 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir Ficha
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEditLot(lot);
                }}
                className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editar Lote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
