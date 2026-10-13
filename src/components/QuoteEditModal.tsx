import React, { useState, useEffect } from 'react';
import { X, TrendingUp, DollarSign } from 'lucide-react';
import { CoffeePriceQuote } from '../types/coffee';

interface QuoteEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: CoffeePriceQuote | null;
  onSaveQuote: (id: string, newPrice: number) => void;
}

export const QuoteEditModal: React.FC<QuoteEditModalProps> = ({
  isOpen,
  onClose,
  quote,
  onSaveQuote,
}) => {
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (quote) {
      setPrice(quote.price);
    }
  }, [quote]);

  if (!isOpen || !quote) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price > 0) {
      onSaveQuote(quote.id, price);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#2C1810] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold font-serif">Atualizar Cotação de Mercado</h2>
          </div>
          <button onClick={onClose} className="text-stone-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <span className="text-xs font-bold text-stone-900 block">{quote.name}</span>
            <span className="text-[11px] text-stone-500 block">{quote.description}</span>
            <span className="text-[11px] text-amber-800 font-semibold block mt-1">Ref: {quote.referenceLocation}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Novo Preço de Referência (R$/saca 60kg) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-stone-500 font-bold">R$</span>
              <input
                type="number"
                step="0.5"
                min="100"
                required
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-base font-mono font-bold rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm"
            >
              Atualizar Cotação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
