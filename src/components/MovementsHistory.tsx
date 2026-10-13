import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Download, 
  FileText, 
  Printer, 
  Calendar,
  Truck,
  Plus
} from 'lucide-react';
import { StockMovement } from '../types/coffee';
import { storageService } from '../services/storageService';

interface MovementsHistoryProps {
  movements: StockMovement[];
  onOpenNewMovement: () => void;
  onViewRomaneio: (movement: StockMovement) => void;
}

export const MovementsHistory: React.FC<MovementsHistoryProps> = ({
  movements,
  onOpenNewMovement,
  onViewRomaneio,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'ENTRADA' | 'SAIDA'>('ALL');

  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const matchesSearch = 
        m.lotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.receiptNumber && m.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.counterparty && m.counterparty.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.driverName && m.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.vehiclePlate && m.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = typeFilter === 'ALL' || m.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [movements, searchTerm, typeFilter]);

  const totalEntries = filteredMovements
    .filter(m => m.type === 'ENTRADA')
    .reduce((sum, m) => sum + m.bagsCount, 0);

  const totalExits = filteredMovements
    .filter(m => m.type === 'SAIDA')
    .reduce((sum, m) => sum + m.bagsCount, 0);

  const totalFinancial = filteredMovements
    .reduce((sum, m) => sum + (m.totalPrice || 0), 0);

  const handleExportCSV = () => {
    const csvContent = storageService.exportMovementsToCSV();
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `movimentacoes_cafe_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-amber-800" />
            Movimentações & Romaneios
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Histórico completo de entradas de colheita, entregas a cooperativas e romaneios
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            Exportar CSV
          </button>
          <button
            onClick={onOpenNewMovement}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-600 rounded-xl transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nova Movimentação
          </button>
        </div>
      </div>

      {/* Resumo de Movimentações */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Entradas Registradas</span>
            <div className="text-2xl font-black text-blue-700 font-mono mt-1">+{totalEntries} sacas</div>
            <span className="text-[11px] text-stone-400 font-mono">{(totalEntries * 60).toLocaleString('pt-BR')} kg</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Saídas / Comercialização</span>
            <div className="text-2xl font-black text-amber-800 font-mono mt-1">-{totalExits} sacas</div>
            <span className="text-[11px] text-stone-400 font-mono">{(totalExits * 60).toLocaleString('pt-BR')} kg</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-800">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Comercializado</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
              R$ {totalFinancial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-stone-400 font-mono">{filteredMovements.length} operações filtradas</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Caixa de Busca e Filtro */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por lote, romaneio, comprador ou placa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              typeFilter === 'ALL' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setTypeFilter('ENTRADA')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              typeFilter === 'ENTRADA' ? 'bg-blue-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setTypeFilter('SAIDA')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              typeFilter === 'SAIDA' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Saídas / Vendas
          </button>
        </div>
      </div>

      {/* Lista / Tabela de Movimentações */}
      {filteredMovements.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300">
          <ArrowLeftRight className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">Nenhuma movimentação encontrada</h3>
          <p className="text-xs text-stone-500 mt-1">
            Gere uma nova entrada de sacas ou saída de venda para registrar o primeiro romaneio.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Data & Romaneio</th>
                  <th className="py-3 px-4">Tipo / Motivo</th>
                  <th className="py-3 px-4">Lote & Variedade</th>
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4">Comprador / Origem</th>
                  <th className="py-3 px-4 text-right">Valor Financeiro</th>
                  <th className="py-3 px-4 text-center">Romaneio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredMovements.map(mov => {
                  const isEntry = mov.type === 'ENTRADA';
                  return (
                    <tr key={mov.id} className="hover:bg-amber-50/40 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-stone-800">
                          {new Date(mov.date).toLocaleDateString('pt-BR')}
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {mov.receiptNumber || 'S/N'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                          isEntry ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isEntry ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {mov.reason}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-900">{mov.lotCode}</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[150px]">{mov.variety}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className={`font-mono font-bold ${isEntry ? 'text-blue-700' : 'text-stone-900'}`}>
                          {isEntry ? `+${mov.bagsCount}` : `-${mov.bagsCount}`} sacas
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          {(mov.bagsCount * 60).toLocaleString('pt-BR')} kg
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800 truncate max-w-[160px]">
                          {mov.counterparty || 'Fazenda'}
                        </div>
                        {mov.vehiclePlate && (
                          <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            {mov.vehiclePlate} {mov.driverName ? `(${mov.driverName})` : ''}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {mov.totalPrice ? (
                          <>
                            <div className="font-mono font-bold text-emerald-700">
                              R$ {mov.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            {mov.unitPrice && (
                              <div className="text-[10px] text-stone-400 font-mono">
                                R$ {mov.unitPrice.toFixed(2)}/sc
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-stone-400 font-mono">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onViewRomaneio(mov)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-semibold text-[11px] transition shadow-xs"
                          title="Visualizar e Imprimir Romaneio"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          Romaneio
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
