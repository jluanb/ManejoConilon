import React, { useState, useMemo } from 'react';
import { 
  Coffee, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit3, 
  Trash2, 
  FileText, 
  Droplets, 
  Warehouse, 
  AlertTriangle,
  ChevronRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { CoffeeLot, Warehouse as WarehouseType } from '../types/coffee';
import { storageService } from '../services/storageService';

interface LotListProps {
  lots: CoffeeLot[];
  warehouses: WarehouseType[];
  onOpenNewLot: () => void;
  onEditLot: (lot: CoffeeLot) => void;
  onDeleteLot: (id: string) => void;
  onOpenMovementForLot: (lot: CoffeeLot, defaultType: 'ENTRADA' | 'SAIDA') => void;
  onViewLotDetail: (lot: CoffeeLot) => void;
}

export const LotList: React.FC<LotListProps> = ({
  lots,
  warehouses,
  onOpenNewLot,
  onEditLot,
  onDeleteLot,
  onOpenMovementForLot,
  onViewLotDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
  const [moistureFilter, setMoistureFilter] = useState<string>('ALL');

  // Filtragem combinada
  const filteredLots = useMemo(() => {
    return lots.filter(lot => {
      const matchesSearch = 
        lot.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.processType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup = selectedGroup === 'ALL' || lot.group === selectedGroup;
      const matchesStatus = selectedStatus === 'ALL' || lot.status === selectedStatus;
      const matchesWarehouse = selectedWarehouse === 'ALL' || lot.warehouseId === selectedWarehouse || lot.warehouseLocation.includes(selectedWarehouse);
      
      let matchesMoisture = true;
      if (moistureFilter === 'HIGH') {
        matchesMoisture = lot.moisture > 12.5;
      } else if (moistureFilter === 'OPTIMAL') {
        matchesMoisture = lot.moisture >= 11.0 && lot.moisture <= 12.5;
      } else if (moistureFilter === 'LOW') {
        matchesMoisture = lot.moisture < 11.0;
      }

      return matchesSearch && matchesGroup && matchesStatus && matchesWarehouse && matchesMoisture;
    });
  }, [lots, searchTerm, selectedGroup, selectedStatus, selectedWarehouse, moistureFilter]);

  const totalFilteredBags = filteredLots.reduce((acc, l) => acc + (l.status !== 'Vendido' ? l.bagsCount : 0), 0);
  const totalFilteredValue = filteredLots.reduce((acc, l) => acc + (l.status !== 'Vendido' ? l.bagsCount * l.estimatedPricePerBag : 0), 0);

  const handleExportCSV = () => {
    const csvContent = storageService.exportLotsToCSV();
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `estoque_conilon_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMoistureBadge = (moisture: number) => {
    if (moisture > 13.0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          {moisture}% (Risco Alto)
        </span>
      );
    }
    if (moisture > 12.5) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <Droplets className="w-3 h-3 text-amber-600" />
          {moisture}% (Atenção)
        </span>
      );
    }
    if (moisture < 10.5) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
          <Droplets className="w-3 h-3 text-blue-600" />
          {moisture}% (Seco)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        {moisture}% (Ideal)
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif flex items-center gap-2">
            <Coffee className="w-6 h-6 text-amber-800" />
            Lotes de Café em Armazém
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Controle de sacas, umidade, peneira e rastreabilidade por tulha
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition shadow-sm"
            title="Exportar para Excel / Google Planilhas"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            Exportar CSV
          </button>
          <button
            onClick={onOpenNewLot}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Novo Lote de Café
          </button>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Input de Busca */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por lote, variedade, tulha ou produtor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Filtro Espécie */}
          <div className="md:col-span-2">
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="ALL">Todas Espécies</option>
              <option value="Conilon">Apenas Conilon</option>
              <option value="Arábica">Apenas Arábica</option>
            </select>
          </div>

          {/* Filtro Armazém */}
          <div className="md:col-span-3">
            <select
              value={selectedWarehouse}
              onChange={e => setSelectedWarehouse(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="ALL">Todas Tulhas / Armazéns</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
              ))}
            </select>
          </div>

          {/* Filtro Umidade */}
          <div className="md:col-span-2">
            <select
              value={moistureFilter}
              onChange={e => setMoistureFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="ALL">Umidade: Todas</option>
              <option value="OPTIMAL">Ideal (11 - 12.5%)</option>
              <option value="HIGH">Alta (&gt; 12.5% risco)</option>
              <option value="LOW">Seca (&lt; 11%)</option>
            </select>
          </div>
        </div>

        {/* Resumo rápido do filtro */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div>
            Exibindo <strong className="text-stone-800">{filteredLots.length}</strong> lote(s)
          </div>
          <div className="flex items-center gap-4">
            <span>
              Total: <strong className="font-mono text-stone-900">{totalFilteredBags} sacas</strong>
            </span>
            <span className="hidden sm:inline">
              Valor: <strong className="font-mono text-emerald-700">R$ {totalFilteredValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Lots Grid / Cards - Visualmente Excelente para Celular e Desktop */}
      {filteredLots.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300">
          <Coffee className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Nenhum lote de café encontrado</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            Ajuste os filtros de busca acima ou clique no botão abaixo para cadastrar um novo lote de Conilon ou Arábica.
          </p>
          <button
            onClick={onOpenNewLot}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition"
          >
            Cadastrar Novo Lote
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLots.map(lot => {
            const isSoldOut = lot.bagsCount === 0 || lot.status === 'Vendido';
            const lotValue = lot.bagsCount * lot.estimatedPricePerBag;

            return (
              <div
                key={lot.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isSoldOut 
                    ? 'border-stone-200 opacity-60 bg-stone-50' 
                    : lot.moisture > 12.5 
                    ? 'border-amber-300 ring-1 ring-amber-300/50' 
                    : 'border-stone-200/90 hover:border-amber-400'
                }`}
              >
                {/* Header do Card */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${
                        lot.group === 'Conilon'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}>
                        {lot.group === 'Conilon' ? 'CN' : 'AB'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sm text-stone-900">{lot.code}</span>
                          <span className="text-[10px] text-stone-400 font-mono">({lot.harvestYear})</span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-700 truncate max-w-[180px]">{lot.variety}</h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        lot.status === 'Disponível'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lot.status === 'Reservado'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {lot.status}
                      </span>
                    </div>
                  </div>

                  {/* Volume Principal em Sacas */}
                  <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Saldo em Armazém</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-black text-stone-900 font-mono">{lot.bagsCount}</span>
                        <span className="text-xs text-stone-600 font-medium">sacas (60kg)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-stone-500 block">Total em peso</span>
                      <span className="text-xs font-mono font-semibold text-stone-700">
                        {(lot.bagsCount * 60).toLocaleString('pt-BR')} kg
                      </span>
                    </div>
                  </div>

                  {/* Detalhes Agronômicos */}
                  <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500 flex items-center gap-1">
                        <Warehouse className="w-3.5 h-3.5 text-stone-400" />
                        Localização:
                      </span>
                      <span className="font-semibold text-stone-800 truncate max-w-[160px]">{lot.warehouseLocation}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-stone-400" />
                        Umidade:
                      </span>
                      <div>{getMoistureBadge(lot.moisture)}</div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Peneira / Defeito:</span>
                      <span className="font-mono text-[11px] text-stone-700">{lot.sieve || 'Bica Corrida'}</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-500">Valor Estimado:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        R$ {lotValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="px-5 py-3 bg-stone-50/80 border-t border-stone-100 rounded-b-2xl flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenMovementForLot(lot, 'ENTRADA')}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition"
                      title="Lançar Entrada para este lote"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Entrada</span>
                    </button>
                    <button
                      onClick={() => onOpenMovementForLot(lot, 'SAIDA')}
                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1 transition"
                      title="Lançar Venda/Saída deste lote"
                      disabled={lot.bagsCount <= 0}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Venda</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewLotDetail(lot)}
                      className="p-1.5 rounded-lg hover:bg-stone-200/80 text-stone-600 transition"
                      title="Ver Ficha Completa / Romaneio"
                    >
                      <FileText className="w-4 h-4 text-amber-800" />
                    </button>
                    <button
                      onClick={() => onEditLot(lot)}
                      className="p-1.5 rounded-lg hover:bg-stone-200/80 text-stone-600 transition"
                      title="Editar Lote"
                    >
                      <Edit3 className="w-4 h-4 text-stone-600" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir o lote ${lot.code}?`)) {
                          onDeleteLot(lot.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
                      title="Excluir Lote"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
