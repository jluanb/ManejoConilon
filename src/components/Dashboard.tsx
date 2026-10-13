import React from 'react';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Warehouse as WarehouseIcon, 
  Droplets,
  Calendar,
  FileText,
  Plus,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { CoffeeLot, StockMovement, Warehouse, CoffeePriceQuote } from '../types/coffee';

interface DashboardProps {
  lots: CoffeeLot[];
  movements: StockMovement[];
  warehouses: Warehouse[];
  quotes: CoffeePriceQuote[];
  onNavigateTab: (tab: string) => void;
  onOpenNewLot: () => void;
  onOpenNewMovement: () => void;
  onSelectLot: (lot: CoffeeLot) => void;
  onOpenQuoteEdit: (quote: CoffeePriceQuote) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  lots,
  movements,
  warehouses,
  quotes,
  onNavigateTab,
  onOpenNewLot,
  onOpenNewMovement,
  onSelectLot,
  onOpenQuoteEdit,
}) => {
  // Cálculos de estoque
  const activeLots = lots.filter(l => l.status !== 'Vendido');
  const totalBags = activeLots.reduce((sum, l) => sum + l.bagsCount, 0);
  const totalTons = (totalBags * 60) / 1000;
  
  // Valor patrimonial total calculado com base no preço de cada lote
  const totalValue = activeLots.reduce((sum, l) => sum + (l.bagsCount * l.estimatedPricePerBag), 0);

  // Divisão por grupo
  const conilonBags = activeLots
    .filter(l => l.group === 'Conilon')
    .reduce((sum, l) => sum + l.bagsCount, 0);
  const arabicaBags = activeLots
    .filter(l => l.group === 'Arábica')
    .reduce((sum, l) => sum + l.bagsCount, 0);
  const otherBags = totalBags - conilonBags - arabicaBags;

  // Movimentações no mês atual
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const monthMovements = movements.filter(m => m.date.startsWith(currentMonthStr));
  const monthEntries = monthMovements
    .filter(m => m.type === 'ENTRADA')
    .reduce((sum, m) => sum + m.bagsCount, 0);
  const monthExits = monthMovements
    .filter(m => m.type === 'SAIDA')
    .reduce((sum, m) => sum + m.bagsCount, 0);

  // Alertas de umidade (>12.5% perigo de mofo/aquecimento na tulha; <10% muito seco)
  const highMoistureLots = activeLots.filter(l => l.moisture > 12.5);
  const lowMoistureLots = activeLots.filter(l => l.moisture < 10.0);

  // Ocupação de armazéns
  const warehouseStats = warehouses.map(w => {
    const bagsInWarehouse = activeLots
      .filter(l => l.warehouseId === w.id || l.warehouseLocation.toLowerCase().includes(w.name.toLowerCase()) || l.warehouseLocation.toLowerCase().includes(w.code.toLowerCase()))
      .reduce((sum, l) => sum + l.bagsCount, 0);
    const occupancyPercent = w.capacityBags > 0 ? Math.min(100, Math.round((bagsInWarehouse / w.capacityBags) * 100)) : 0;
    return {
      ...w,
      occupiedBags: bagsInWarehouse,
      occupancyPercent,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Coffee Atmosphere */}
      <div className="bg-gradient-to-r from-[#381E11] via-[#4A2817] to-[#2B160C] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-[#5A3420] relative overflow-hidden">
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <WarehouseIcon className="w-80 h-80" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Painel Agrícola em Tempo Real
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-[#FFF8F0]">
              Controle de Estoque de Café Conilon
            </h1>
            <p className="mt-2 text-sm sm:text-base text-stone-300 leading-relaxed">
              Gestão precisa de sacas, umidade, lotes por tulha e romaneios de colheita e comercialização.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewMovement}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition flex items-center gap-2 active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Lançar Entrada / Saída
            </button>
            <button
              onClick={onOpenNewLot}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md transition flex items-center gap-2 border border-emerald-500/40 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Novo Lote
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sacas */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Volume em Estoque</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 font-mono">
              {totalBags.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-stone-500 font-medium">sacas (60kg)</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
            <span>Peso total líquido:</span>
            <span className="font-semibold text-stone-800 font-mono">
              {totalTons.toFixed(1)} toneladas
            </span>
          </div>
        </div>

        {/* Valor Patrimonial */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Valor Estimado</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs font-semibold text-stone-500">R$</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">
              {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
            <span>Preço médio / saca:</span>
            <span className="font-semibold text-stone-800 font-mono">
              R$ {totalBags > 0 ? (totalValue / totalBags).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}
            </span>
          </div>
        </div>

        {/* Entradas do Mês */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Entradas no Mês</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-900 font-mono">
              +{monthEntries.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-stone-500 font-medium">sc colhidas/rec.</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
            <span>Lotes ativos no armazém:</span>
            <span className="font-semibold text-stone-800">
              {activeLots.length} lotes
            </span>
          </div>
        </div>

        {/* Saídas / Vendas do Mês */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Saídas / Vendas no Mês</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-800 font-mono">
              -{monthExits.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-stone-500 font-medium">sc entregues</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
            <span>Movimentações totais:</span>
            <span className="font-semibold text-stone-800">
              {movements.length} registros
            </span>
          </div>
        </div>
      </div>

      {/* Alertas de Umidade e Controle de Tulha */}
      {(highMoistureLots.length > 0 || lowMoistureLots.length > 0) && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900">
                Alerta Agronômico de Umidade em Armazenamento
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                A faixa ideal para conservação do café conilon na tulha é entre <strong>11.0% e 12.5%</strong>. 
                Lotes com umidade superior correm risco de fermentação, proliferação de fungos e perda de bebida; 
                lotes muito secos perdem peso e sofrem quebra na pilagem.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {highMoistureLots.map(lot => (
                  <button
                    key={lot.id}
                    onClick={() => onSelectLot(lot)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 border border-red-300 text-red-800 text-xs font-semibold hover:bg-red-200 transition"
                  >
                    <Flame className="w-3.5 h-3.5 text-red-600" />
                    {lot.code} ({lot.moisture}% umidade) - {lot.bagsCount} sc em {lot.warehouseLocation}
                  </button>
                ))}
                {lowMoistureLots.map(lot => (
                  <button
                    key={lot.id}
                    onClick={() => onSelectLot(lot)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold hover:bg-amber-200 transition"
                  >
                    <Droplets className="w-3.5 h-3.5 text-amber-600" />
                    {lot.code} ({lot.moisture}% muito seco)
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Cotações do Café & Distribuição de Estoque */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Cotações com Edição Rápida */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-900">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Cotação do Dia</h2>
                  <p className="text-[11px] text-stone-500">Referências de Cooperativas / CEPEA</p>
                </div>
              </div>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                R$/saca 60kg
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {quotes.map(quote => (
                <div
                  key={quote.id}
                  onClick={() => onOpenQuoteEdit(quote)}
                  className="p-3 rounded-xl border border-stone-100 hover:border-amber-300 bg-stone-50/60 hover:bg-amber-50/40 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-800 group-hover:text-amber-900">
                        {quote.name}
                      </span>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{quote.referenceLocation}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-stone-900 font-mono">
                        R$ {quote.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className={`block text-[10px] font-semibold ${quote.changePercent >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {quote.changePercent >= 0 ? `+${quote.changePercent}%` : `${quote.changePercent}%`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('calculator')}
            className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            Abrir Simulador de Venda Líquida
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Gráfico / Distribuição por Variedades */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Composição do Estoque</h2>
                  <p className="text-[11px] text-stone-500">Por espécie e variedade de grão</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-stone-700 font-mono">
                {totalBags} sc
              </span>
            </div>

            {/* Visual Bar Distribution */}
            <div className="mt-5">
              <div className="h-4 w-full rounded-full bg-stone-100 overflow-hidden flex shadow-inner">
                {totalBags > 0 ? (
                  <>
                    <div
                      style={{ width: `${(conilonBags / totalBags) * 100}%` }}
                      className="bg-amber-600 h-full transition-all"
                      title={`Conilon: ${conilonBags} sacas`}
                    />
                    <div
                      style={{ width: `${(arabicaBags / totalBags) * 100}%` }}
                      className="bg-emerald-600 h-full transition-all"
                      title={`Arábica: ${arabicaBags} sacas`}
                    />
                    <div
                      style={{ width: `${(otherBags / totalBags) * 100}%` }}
                      className="bg-stone-400 h-full transition-all"
                      title={`Outros: ${otherBags} sacas`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-stone-200" />
                )}
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                    <span className="font-semibold text-stone-800">Café Conilon (Canephora)</span>
                  </div>
                  <div className="font-mono text-stone-700">
                    <strong>{conilonBags} sc</strong> ({totalBags > 0 ? Math.round((conilonBags / totalBags) * 100) : 0}%)
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                    <span className="font-semibold text-stone-800">Café Arábica</span>
                  </div>
                  <div className="font-mono text-stone-700">
                    <strong>{arabicaBags} sc</strong> ({totalBags > 0 ? Math.round((arabicaBags / totalBags) * 100) : 0}%)
                  </div>
                </div>

                {otherBags > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-stone-400"></span>
                      <span className="font-semibold text-stone-800">Outros / Em Coco</span>
                    </div>
                    <div className="font-mono text-stone-700">
                      <strong>{otherBags} sc</strong> ({totalBags > 0 ? Math.round((otherBags / totalBags) * 100) : 0}%)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('lots')}
            className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            Gerenciar Todos os Lotes
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ocupação das Tulhas & Armazéns */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-stone-100 text-stone-800">
                  <WarehouseIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Ocupação das Tulhas</h2>
                  <p className="text-[11px] text-stone-500">Capacidade física de armazenamento</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('warehouses')}
                className="text-xs text-amber-700 hover:underline font-semibold"
              >
                Ver armazéns
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {warehouseStats.slice(0, 4).map(wh => (
                <div key={wh.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800 truncate max-w-[170px]">{wh.name}</span>
                    <span className="font-mono text-stone-600 text-[11px]">
                      {wh.occupiedBags} / {wh.capacityBags} sc ({wh.occupancyPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${wh.occupancyPercent}%` }}
                      className={`h-full rounded-full transition-all ${
                        wh.occupancyPercent > 85
                          ? 'bg-red-500'
                          : wh.occupancyPercent > 65
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('warehouses')}
            className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            Ajustar Tulhas e Galpões
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Lotes em Destaque & Histórico Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lotes com Maior Volume no Estoque */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Lotes de Café em Estoque</h2>
              <p className="text-[11px] text-stone-500">Prontos para comercialização ou pilagem</p>
            </div>
            <button
              onClick={() => onNavigateTab('lots')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
            >
              Ver todos ({activeLots.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-stone-100">
            {activeLots.length === 0 ? (
              <div className="py-8 text-center text-stone-400">
                <p className="text-xs font-medium">Nenhum lote cadastrado ainda no armazém.</p>
                <button
                  onClick={onOpenNewLot}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Cadastrar primeiro lote
                </button>
              </div>
            ) : (
              activeLots.slice(0, 4).map(lot => (
                <div
                  key={lot.id}
                  onClick={() => onSelectLot(lot)}
                  className="py-3 flex items-center justify-between hover:bg-amber-50/50 px-2 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center font-bold text-xs border border-amber-200">
                      {lot.group === 'Conilon' ? 'CN' : 'AB'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-xs sm:text-sm font-mono">{lot.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          lot.status === 'Disponível' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {lot.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {lot.variety} • Umidade: {lot.moisture}% • {lot.warehouseLocation}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-stone-900 font-mono">
                      {lot.bagsCount} sc
                    </span>
                    <span className="block text-[11px] text-stone-500 font-mono">
                      R$ {(lot.bagsCount * lot.estimatedPricePerBag).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimas Movimentações */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Últimas Movimentações</h2>
              <p className="text-[11px] text-stone-500">Histórico de entradas e saídas</p>
            </div>
            <button
              onClick={() => onNavigateTab('movements')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
            >
              Ver extrato
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-stone-100">
            {movements.length === 0 ? (
              <div className="py-8 text-center text-stone-400">
                <p className="text-xs font-medium">Nenhuma movimentação registrada no histórico.</p>
                <button
                  onClick={onOpenNewMovement}
                  className="mt-2 text-xs font-bold text-amber-800 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Lançar primeira entrada ou saída
                </button>
              </div>
            ) : (
              movements.slice(0, 4).map(mov => (
                <div key={mov.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      mov.type === 'ENTRADA' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {mov.type === 'ENTRADA' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-800">{mov.reason}</span>
                        <span className="text-[11px] text-stone-500 font-mono">({mov.lotCode})</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        {mov.counterparty || 'Fazenda'} • {new Date(mov.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs sm:text-sm font-bold font-mono ${
                      mov.type === 'ENTRADA' ? 'text-blue-700' : 'text-stone-800'
                    }`}>
                      {mov.type === 'ENTRADA' ? `+${mov.bagsCount} sc` : `-${mov.bagsCount} sc`}
                    </span>
                    {mov.receiptNumber && (
                      <span className="block text-[10px] text-stone-400 font-mono">
                        {mov.receiptNumber}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
