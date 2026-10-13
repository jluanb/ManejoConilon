import React, { useState } from 'react';
import { Warehouse as WarehouseIcon, Plus, Edit2, Trash2, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Warehouse, CoffeeLot } from '../types/coffee';

interface WarehousesViewProps {
  warehouses: Warehouse[];
  lots: CoffeeLot[];
  onAddWarehouse: (wh: Omit<Warehouse, 'id'>) => void;
  onUpdateWarehouse: (id: string, updates: Partial<Warehouse>) => void;
  onDeleteWarehouse: (id: string) => void;
  onSelectLot: (lot: CoffeeLot) => void;
}

export const WarehousesView: React.FC<WarehousesViewProps> = ({
  warehouses,
  lots,
  onAddWarehouse,
  onUpdateWarehouse,
  onDeleteWarehouse,
  onSelectLot,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWhId, setEditingWhId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<Warehouse['type']>('Tulha de Madeira');
  const [capacityBags, setCapacityBags] = useState<number>(1000);
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingWhId(null);
    setName('');
    setCode(`T-${warehouses.length + 1}`);
    setType('Tulha de Madeira');
    setCapacityBags(1000);
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (wh: Warehouse) => {
    setEditingWhId(wh.id);
    setName(wh.name);
    setCode(wh.code);
    setType(wh.type);
    setCapacityBags(wh.capacityBags);
    setNotes(wh.notes || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWhId) {
      onUpdateWarehouse(editingWhId, {
        name,
        code,
        type,
        capacityBags: Number(capacityBags) || 100,
        notes,
      });
    } else {
      onAddWarehouse({
        name,
        code,
        type,
        capacityBags: Number(capacityBags) || 100,
        notes,
      });
    }
    setModalOpen(false);
  };

  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacityBags, 0);
  const activeLots = lots.filter(l => l.status !== 'Vendido');
  const totalBagsStored = activeLots.reduce((sum, l) => sum + l.bagsCount, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalBagsStored / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif flex items-center gap-2">
            <WarehouseIcon className="w-6 h-6 text-amber-800" />
            Tulhas, Galpões & Silos de Café
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Controle de capacidade física e distribuição espacial dos lotes
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Nova Tulha / Galpão
        </button>
      </div>

      {/* Capacidade Geral Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Capacidade Geral de Armazenagem
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-stone-900">
              {totalBagsStored.toLocaleString('pt-BR')} / {totalCapacity.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-medium text-stone-500">sacas de 60kg</span>
          </div>
          <p className="text-xs text-stone-600">
            Espaço disponível restante: <strong className="font-mono text-emerald-700">{Math.max(0, totalCapacity - totalBagsStored)} sacas</strong>
          </p>
        </div>

        <div className="md:w-72 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-stone-700">Taxa de Ocupação Global</span>
            <span className={`font-mono font-bold ${overallOccupancy > 85 ? 'text-red-600' : 'text-stone-900'}`}>
              {overallOccupancy}%
            </span>
          </div>
          <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
            <div
              style={{ width: `${overallOccupancy}%` }}
              className={`h-full rounded-full transition-all ${
                overallOccupancy > 85 ? 'bg-red-500' : overallOccupancy > 65 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Grid de Armazéns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {warehouses.map(wh => {
          // Lotes alocados neste armazém
          const whLots = activeLots.filter(
            l => l.warehouseId === wh.id || l.warehouseLocation.toLowerCase().includes(wh.name.toLowerCase()) || l.warehouseLocation.toLowerCase().includes(wh.code.toLowerCase())
          );
          const occupiedBags = whLots.reduce((sum, l) => sum + l.bagsCount, 0);
          const occupancy = wh.capacityBags > 0 ? Math.min(100, Math.round((occupiedBags / wh.capacityBags) * 100)) : 0;
          const remainingBags = Math.max(0, wh.capacityBags - occupiedBags);

          return (
            <div
              key={wh.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-300 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs border border-amber-300">
                      {wh.code}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">{wh.name}</h3>
                      <span className="text-xs text-stone-500">{wh.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(wh)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                      title="Editar Capacidade"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {warehouses.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Excluir ${wh.name}?`)) onDeleteWarehouse(wh.id);
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Excluir Armazém"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Barra de Progresso e Ocupação */}
                <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">Ocupação Atual</span>
                    <span className="font-mono text-stone-900 font-bold">
                      {occupiedBags} / {wh.capacityBags} sc ({occupancy}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${occupancy}%` }}
                      className={`h-full rounded-full transition-all ${
                        occupancy > 85 ? 'bg-red-500' : occupancy > 65 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span>Disponível: <strong className="font-mono text-emerald-700">{remainingBags} sc</strong></span>
                    <span>Capacidade: <strong className="font-mono">{wh.capacityBags} sc</strong></span>
                  </div>
                </div>

                {/* Lista de Lotes Presentes */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                    Lotes Armazenados ({whLots.length})
                  </span>
                  {whLots.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">Nenhum lote alocado no momento.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {whLots.map(lot => (
                        <div
                          key={lot.id}
                          onClick={() => onSelectLot(lot)}
                          className="flex items-center justify-between p-2 rounded-lg bg-stone-50 hover:bg-amber-50 transition cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-900">{lot.code}</span>
                            <span className="text-stone-500 truncate max-w-[130px]">{lot.variety}</span>
                          </div>
                          <span className="font-mono font-bold text-stone-800">{lot.bagsCount} sc</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {wh.notes && (
                <p className="text-[11px] text-stone-500 italic pt-2 border-t border-stone-100">
                  {wh.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Criação / Edição de Armazém */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in">
            <div className="bg-[#2C1810] text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold font-serif">
                {editingWhId ? 'Editar Armazém / Tulha' : 'Nova Tulha / Galpão'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nome da Tulha / Galpão *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Tulha 03 - Fundos"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Código / Sigla *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="Ex: T-03"
                    className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Capacidade (Sacas) *</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    required
                    value={capacityBags}
                    onChange={e => setCapacityBags(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tipo de Estrutura</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as Warehouse['type'])}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value="Tulha de Madeira">Tulha de Madeira</option>
                  <option value="Galpão de Alvenaria">Galpão de Alvenaria</option>
                  <option value="Silo Graneleiro">Silo Graneleiro</option>
                  <option value="Armazém Geral">Armazém Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Observações</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Ventilação natural, piso elevado"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
