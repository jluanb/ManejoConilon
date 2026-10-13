import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, FileText, Truck, DollarSign, Calendar } from 'lucide-react';
import { CoffeeLot, MovementType, MovementReason, StockMovement } from '../types/coffee';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  lots: CoffeeLot[];
  preselectedLot?: CoffeeLot | null;
  defaultType?: MovementType;
  onSaveMovement: (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => void;
}

export const MovementModal: React.FC<MovementModalProps> = ({
  isOpen,
  onClose,
  lots,
  preselectedLot,
  defaultType = 'ENTRADA',
  onSaveMovement,
}) => {
  const [selectedLotId, setSelectedLotId] = useState('');
  const [type, setType] = useState<MovementType>(defaultType);
  const [reason, setReason] = useState<MovementReason>('Venda / Embarque');
  const [bagsCount, setBagsCount] = useState<number>(50);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [unitPrice, setUnitPrice] = useState<number>(1380);
  const [counterparty, setCounterparty] = useState('COOABRIEL');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setType(defaultType);
    if (defaultType === 'ENTRADA') {
      setReason('Colheita Própria');
      setCounterparty('');
    } else {
      setReason('Venda / Embarque');
      setCounterparty('');
    }

    if (preselectedLot) {
      setSelectedLotId(preselectedLot.id);
      setUnitPrice(preselectedLot.estimatedPricePerBag);
    } else if (lots.length > 0) {
      const active = lots.find(l => l.bagsCount > 0) || lots[0];
      setSelectedLotId(active.id);
      setUnitPrice(active.estimatedPricePerBag);
    }

    const randomRom = Math.floor(1000 + Math.random() * 9000);
    setReceiptNumber(`ROM-${new Date().getFullYear()}-${randomRom}`);
  }, [isOpen, defaultType, preselectedLot, lots]);

  if (!isOpen) return null;

  const currentLot = lots.find(l => l.id === selectedLotId);

  const handleLotChange = (id: string) => {
    setSelectedLotId(id);
    const lot = lots.find(l => l.id === id);
    if (lot && lot.estimatedPricePerBag) {
      setUnitPrice(lot.estimatedPricePerBag);
    }
  };

  const totalPrice = bagsCount * (unitPrice || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLot) return;

    if (type === 'SAIDA' && bagsCount > currentLot.bagsCount) {
      if (!confirm(`Atenção: A quantidade lançada (${bagsCount} sc) é maior que o saldo em estoque (${currentLot.bagsCount} sc). Deseja continuar?`)) {
        return;
      }
    }

    onSaveMovement({
      lotId: currentLot.id,
      lotCode: currentLot.code,
      variety: currentLot.variety,
      type,
      reason,
      bagsCount: Number(bagsCount) || 0,
      weightKg: (Number(bagsCount) || 0) * 60,
      date,
      unitPrice: unitPrice > 0 ? unitPrice : undefined,
      totalPrice: totalPrice > 0 ? totalPrice : undefined,
      counterparty: counterparty.trim(),
      receiptNumber: receiptNumber.trim() || undefined,
      driverName: driverName.trim() || undefined,
      vehiclePlate: vehiclePlate.trim().toUpperCase() || undefined,
      warehouseSource: type === 'SAIDA' ? currentLot.warehouseLocation : undefined,
      warehouseDest: type === 'ENTRADA' ? currentLot.warehouseLocation : undefined,
      moisture: currentLot.moisture,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between text-white ${
          type === 'ENTRADA' ? 'bg-blue-900 border-b border-blue-950' : 'bg-amber-900 border-b border-amber-950'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white ${type === 'ENTRADA' ? 'bg-blue-700' : 'bg-amber-700'}`}>
              {type === 'ENTRADA' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold font-serif">
                {type === 'ENTRADA' ? 'Lançar Entrada / Recebimento de Café' : 'Lançar Saída / Venda de Café'}
              </h2>
              <p className="text-xs text-stone-200">
                Gera comprovante e atualiza o saldo do armazém automaticamente
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tipo Switch Tabs */}
        <div className="p-3 bg-stone-100 flex gap-2 border-b border-stone-200">
          <button
            type="button"
            onClick={() => {
              setType('ENTRADA');
              setReason('Colheita Própria');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              type === 'ENTRADA' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Entrada no Armazém
          </button>
          <button
            type="button"
            onClick={() => {
              setType('SAIDA');
              setReason('Venda / Embarque');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              type === 'SAIDA' ? 'bg-amber-700 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Saída / Comercialização
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Selecionar Lote */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Lote de Café Alvo *
            </label>
            <select
              value={selectedLotId}
              onChange={e => handleLotChange(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              {lots.map(l => (
                <option key={l.id} value={l.id}>
                  {l.code} - {l.variety} | Saldo: {l.bagsCount} sc ({l.warehouseLocation})
                </option>
              ))}
            </select>
            {currentLot && (
              <div className="mt-1 flex items-center justify-between text-xs text-stone-500 bg-stone-50 p-2 rounded-lg">
                <span>Saldo atual: <strong className="text-stone-900 font-mono">{currentLot.bagsCount} sacas</strong></span>
                <span>Umidade: <strong className="font-mono">{currentLot.moisture}%</strong></span>
                <span>Local: <strong className="font-mono">{currentLot.warehouseLocation}</strong></span>
              </div>
            )}
          </div>

          {/* Motivo e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Motivo da Movimentação *
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as MovementReason)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                {type === 'ENTRADA' ? (
                  <>
                    <option value="Colheita Própria">Colheita Própria</option>
                    <option value="Compra / Recebimento">Compra / Recebimento de Terceiro</option>
                    <option value="Retorno de Beneficiamento">Retorno de Beneficiamento</option>
                    <option value="Ajuste de Quebra / Inventário">Ajuste de Inventário</option>
                  </>
                ) : (
                  <>
                    <option value="Venda / Embarque">Venda / Embarque Cooperativa</option>
                    <option value="Remessa para Beneficiamento">Remessa para Máquina / Pilagem</option>
                    <option value="Transferência entre Tulhas">Transferência Interna</option>
                    <option value="Ajuste de Quebra / Inventário">Ajuste / Perda</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Data da Operação *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* Sacas & Valores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Quantidade de Sacas *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={bagsCount}
                onChange={e => setBagsCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-base font-mono font-bold rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <span className="text-[11px] text-stone-500 font-mono mt-0.5 block">
                = {(bagsCount * 60).toLocaleString('pt-BR')} kg
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Valor Negociado (R$/sc)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={e => setUnitPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-base font-mono font-bold rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Total da Carga
              </label>
              <div className="py-2.5 px-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-xs font-mono font-extrabold text-emerald-800 block truncate">
                  R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Contraparte e Romaneio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {type === 'SAIDA' ? 'Comprador / Cooperativa / Destino' : 'Produtor / Origem'}
              </label>
              <input
                type="text"
                value={counterparty}
                onChange={e => setCounterparty(e.target.value)}
                placeholder={type === 'SAIDA' ? 'Ex: Cooabriel, Maratá' : 'Ex: Talhão 03'}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nº Romaneio / Nota Fiscal
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={e => setReceiptNumber(e.target.value)}
                placeholder="Ex: ROM-2026-0042"
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* Transporte: Motorista e Placa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome do Motorista
              </label>
              <input
                type="text"
                value={driverName}
                onChange={e => setDriverName(e.target.value)}
                placeholder="Ex: Marcos Vinicius"
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Placa do Caminhão / Veículo
              </label>
              <input
                type="text"
                value={vehiclePlate}
                onChange={e => setVehiclePlate(e.target.value.toUpperCase())}
                placeholder="Ex: PPX-4A20"
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Observações Adicionais
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Pagamento programado em 30 dias na cooperativa"
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          {/* Rodapé e Ação */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-95 ${
                type === 'ENTRADA' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-amber-700 hover:bg-amber-600'
              }`}
            >
              {type === 'ENTRADA' ? 'Confirmar Entrada' : 'Confirmar Saída'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
