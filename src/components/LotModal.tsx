import React, { useState, useEffect } from 'react';
import { X, Coffee, Warehouse, Droplets, DollarSign, AlertTriangle } from 'lucide-react';
import { CoffeeLot, CoffeeGroup, Warehouse as WarehouseType } from '../types/coffee';

interface LotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lotData: Omit<CoffeeLot, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingLot?: CoffeeLot | null;
  warehouses: WarehouseType[];
}

export const LotModal: React.FC<LotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLot,
  warehouses,
}) => {
  const [code, setCode] = useState('');
  const [group, setGroup] = useState<CoffeeGroup>('Conilon');
  const [variety, setVariety] = useState('Conilon Vitória');
  const [processType, setProcessType] = useState('Beneficiado / Pilado');
  const [harvestYear, setHarvestYear] = useState('2025/2026');
  const [bagsCount, setBagsCount] = useState<number>(100);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '');
  const [warehouseLocation, setWarehouseLocation] = useState('Tulha Principal 01');
  const [moisture, setMoisture] = useState<number>(11.8);
  const [sieve, setSieve] = useState('Peneira 13 acima');
  const [defects, setDefects] = useState('Tipo 7 (máx 20% defeitos)');
  const [cupProfile, setCupProfile] = useState('Padrão Comercial / Bebida Dura');
  const [estimatedPricePerBag, setEstimatedPricePerBag] = useState<number>(1380);
  const [producer, setProducer] = useState('Sítio Santa Rita');
  const [farmLocation, setFarmLocation] = useState('São Gabriel da Palha - ES');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<CoffeeLot['status']>('Disponível');

  useEffect(() => {
    if (editingLot) {
      setCode(editingLot.code);
      setGroup(editingLot.group);
      setVariety(editingLot.variety);
      setProcessType(editingLot.processType);
      setHarvestYear(editingLot.harvestYear);
      setBagsCount(editingLot.bagsCount);
      setWarehouseId(editingLot.warehouseId || warehouses[0]?.id || '');
      setWarehouseLocation(editingLot.warehouseLocation);
      setMoisture(editingLot.moisture);
      setSieve(editingLot.sieve);
      setDefects(editingLot.defects);
      setCupProfile(editingLot.cupProfile || '');
      setEstimatedPricePerBag(editingLot.estimatedPricePerBag);
      setProducer(editingLot.producer);
      setFarmLocation(editingLot.farmLocation);
      setNotes(editingLot.notes || '');
      setStatus(editingLot.status);
    } else {
      // Default limpo para novo lote
      setCode('');
      setGroup('Conilon');
      setVariety('Conilon Vitória');
      setProcessType('Beneficiado / Pilado');
      setHarvestYear('2025/2026');
      setBagsCount(0);
      const firstWh = warehouses[0];
      setWarehouseId(firstWh ? firstWh.id : '');
      setWarehouseLocation(firstWh ? `${firstWh.name}` : 'Tulha Principal 01');
      setMoisture(11.8);
      setSieve('Peneira 13 acima');
      setDefects('Tipo 7');
      setCupProfile('Padrão Comercial');
      setEstimatedPricePerBag(1380);
      setProducer('');
      setFarmLocation('');
      setNotes('');
      setStatus('Disponível');
    }
  }, [editingLot, isOpen, warehouses]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      code: code.trim() || `LOT-${Date.now().toString().slice(-4)}`,
      group,
      variety,
      processType,
      harvestYear,
      bagsCount: Number(bagsCount) || 0,
      weightKg: (Number(bagsCount) || 0) * 60,
      warehouseId,
      warehouseLocation: warehouseLocation.trim() || 'Tulha Padrão',
      moisture: Number(moisture) || 12.0,
      sieve,
      defects,
      cupProfile,
      estimatedPricePerBag: Number(estimatedPricePerBag) || 0,
      producer: producer.trim() || 'Produtor',
      farmLocation: farmLocation.trim(),
      notes,
      status,
    });
    onClose();
  };

  const conilonVarieties = [
    'Conilon Vitória',
    'Conilon Robusta Amazônico',
    'Conilon Tradicional / Clone',
    'Conilon Especial (80+ pts)',
    'Conilon Maratine',
    'Conilon Incaper 8142',
  ];

  const arabicaVarieties = [
    'Arábica Catuaí Vermelho/Amarelo',
    'Arábica Mundo Novo',
    'Arábica Bourbon Amarelo',
    'Arábica Acauã / Topázio',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#2C1810] text-[#F5EDE6] px-6 py-4 flex items-center justify-between border-b border-[#4A2E20]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/40">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif">
                {editingLot ? `Editar Lote: ${editingLot.code}` : 'Cadastrar Novo Lote de Café'}
              </h2>
              <p className="text-xs text-amber-200/70">
                Identificação, parâmetros de umidade, classificação e armazenamento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Linha 1: Código, Espécie e Safra */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Identificador / Código do Lote *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: LOT-CN-2026-01"
                className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Espécie / Grupo *
              </label>
              <select
                value={group}
                onChange={e => {
                  const newGroup = e.target.value as CoffeeGroup;
                  setGroup(newGroup);
                  if (newGroup === 'Conilon') setVariety('Conilon Vitória');
                  else if (newGroup === 'Arábica') setVariety('Arábica Catuaí');
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="Conilon">Conilon (Canephora)</option>
                <option value="Arábica">Arábica</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Safra Agrícola *
              </label>
              <input
                type="text"
                required
                value={harvestYear}
                onChange={e => setHarvestYear(e.target.value)}
                placeholder="Ex: 2025/2026"
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* Linha 2: Variedade e Processamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Variedade / Clone *
              </label>
              <input
                type="text"
                list="varieties-list"
                required
                value={variety}
                onChange={e => setVariety(e.target.value)}
                placeholder="Ex: Conilon Vitória"
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <datalist id="varieties-list">
                {(group === 'Conilon' ? conilonVarieties : arabicaVarieties).map(v => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tipo de Processamento *
              </label>
              <select
                value={processType}
                onChange={e => setProcessType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="Beneficiado / Pilado">Beneficiado / Pilado (Sacas 60kg)</option>
                <option value="Bica Corrida">Bica Corrida</option>
                <option value="Natural / Em Coco">Natural / Em Coco (Seco na tulha)</option>
                <option value="Cereja Descascado">Cereja Descascado</option>
                <option value="Despolpado">Despolpado</option>
                <option value="Café Escolha">Café Escolha / Resíduo</option>
              </select>
            </div>
          </div>

          {/* Linha 3: Volume de Sacas e Preço Estimado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Quantidade em Sacas (60kg) *
              </label>
              <input
                type="number"
                min="0"
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
                Preço Estimado R$/Saca *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-stone-500">R$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={estimatedPricePerBag}
                  onChange={e => setEstimatedPricePerBag(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-base font-mono font-bold rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <span className="text-[11px] text-stone-500 font-mono mt-0.5 block">
                Total: R$ {(bagsCount * estimatedPricePerBag).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Status do Lote *
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as CoffeeLot['status'])}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="Disponível">Disponível no Armazém</option>
                <option value="Reservado">Reservado para Venda</option>
                <option value="Em Beneficiamento">Em Beneficiamento</option>
                <option value="Vendido">Vendido / Entregue</option>
              </select>
            </div>
          </div>

          {/* Linha 4: Armazenagem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Armazém / Tulha *
              </label>
              <select
                value={warehouseId}
                onChange={e => {
                  setWarehouseId(e.target.value);
                  const selected = warehouses.find(w => w.id === e.target.value);
                  if (selected) setWarehouseLocation(selected.name);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.code}) - Cap. {w.capacityBags} sc
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Local Específico (Pilha, Baia, Silo)
              </label>
              <input
                type="text"
                value={warehouseLocation}
                onChange={e => setWarehouseLocation(e.target.value)}
                placeholder="Ex: Baia 02 - Pilha Lateral"
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* Linha 5: Qualidade Física (Umidade, Peneira, Defeito) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Umidade (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="25"
                  required
                  value={moisture}
                  onChange={e => setMoisture(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-500 font-bold">%</span>
              </div>
              {moisture > 12.5 && (
                <span className="text-[10px] text-red-600 font-bold flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Atenção: &gt;12.5% risco de mofo
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Peneira
              </label>
              <input
                type="text"
                value={sieve}
                onChange={e => setSieve(e.target.value)}
                placeholder="Ex: Peneira 13 acima (86%)"
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tipo / Defeitos
              </label>
              <input
                type="text"
                value={defects}
                onChange={e => setDefects(e.target.value)}
                placeholder="Ex: Tipo 7 (14% imperfeitos)"
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* Linha 6: Produtor & Talhão */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Produtor / Fazenda de Origem
              </label>
              <input
                type="text"
                value={producer}
                onChange={e => setProducer(e.target.value)}
                placeholder="Ex: Sítio Santa Rita"
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Talhão / Localização Agrícola
              </label>
              <input
                type="text"
                value={farmLocation}
                onChange={e => setFarmLocation(e.target.value)}
                placeholder="Ex: Córrego da Laje, Talhão 02"
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Observações Técnicas / Secagem / Rastreabilidade
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Secador rotativo com temperatura máxima de 40°C. Grãos limpos e ensacados em juta nova."
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          {/* Botões de Ação */}
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
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 shadow-md transition active:scale-95"
            >
              {editingLot ? 'Salvar Alterações' : 'Cadastrar Lote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
