import React, { useState } from 'react';
import { Calculator, DollarSign, Scale, ArrowRight, Percent, Truck, TrendingUp, Sparkles } from 'lucide-react';
import { CoffeePriceQuote } from '../types/coffee';

interface CalculatorProps {
  quotes: CoffeePriceQuote[];
}

export const CoffeeCalculator: React.FC<CalculatorProps> = ({ quotes }) => {
  // 1. Conversor Rápido
  const [converterBags, setConverterBags] = useState<number>(100);

  // 2. Simulador de Fechamento de Venda
  const defaultQuote = quotes.find(q => q.group === 'Conilon')?.price || 1380;
  const [saleBags, setSaleBags] = useState<number>(60);
  const [pricePerBag, setPricePerBag] = useState<number>(defaultQuote);
  const [brokerCommissionPercent, setBrokerCommissionPercent] = useState<number>(0.5);
  const [freightPerBag, setFreightPerBag] = useState<number>(8.0);
  const [funruralPercent, setFunruralPercent] = useState<number>(1.5);
  const [otherFees, setOtherFees] = useState<number>(0);

  // 3. Calculadora de Beneficiamento (Coco -> Pilado)
  const [cocoBags, setCocoBags] = useState<number>(200);
  const [yieldPercent, setYieldPercent] = useState<number>(50); // Média de 50% de rendimento de café pilado

  // Cálculos de Venda
  const grossTotal = saleBags * pricePerBag;
  const brokerAmount = grossTotal * (brokerCommissionPercent / 100);
  const freightTotal = saleBags * freightPerBag;
  const funruralAmount = grossTotal * (funruralPercent / 100);
  const totalDeductions = brokerAmount + freightTotal + funruralAmount + otherFees;
  const netTotal = grossTotal - totalDeductions;
  const netPricePerBag = saleBags > 0 ? netTotal / saleBags : 0;

  // Cálculos de Beneficiamento
  // 1 saca de café em coco rende ~30kg de café pilado (50%) -> logo 2 sacas de coco para 1 saca de 60kg pilada
  const estimatedCleanBags = Math.round(cocoBags * (yieldPercent / 100));
  const estimatedStrawKg = (cocoBags * 60) - (estimatedCleanBags * 60);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif flex items-center gap-2">
          <Calculator className="w-6 h-6 text-amber-800" />
          Calculadoras & Simulador Cafeeiro
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Ferramentas práticas para simular fechamentos de venda líquida, conversão de peso e quebra de beneficiamento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulador de Fechamento de Venda Líquida (Coluna Principal) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-stone-900">Simulador de Fechamento de Venda</h2>
                <p className="text-[11px] text-stone-500">Cálculo exato de taxas, frete, corretagem e Funrural</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-bold">
              Líquido no Bolso
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Quantidade a Comercializar *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={saleBags}
                  onChange={e => setSaleBags(Number(e.target.value))}
                  className="w-full px-3 py-2 text-base font-mono font-bold rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-500">sacas (60kg)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preço Negociado Bruto (R$/saca) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-stone-500 font-bold">R$</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={pricePerBag}
                  onChange={e => setPricePerBag(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-base font-mono font-bold rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Deduções e Taxas */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              Descontos & Custos Operacionais
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Comissão Corretor (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={brokerCommissionPercent}
                    onChange={e => setBrokerCommissionPercent(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-stone-200 bg-white"
                  />
                  <span className="absolute right-2.5 top-2 text-xs text-stone-400">%</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
                  - R$ {brokerAmount.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Frete por Saca (R$)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={freightPerBag}
                    onChange={e => setFreightPerBag(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-stone-200 bg-white"
                  />
                  <span className="absolute right-2.5 top-2 text-xs text-stone-400">R$</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
                  - R$ {freightTotal.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Funrural (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={funruralPercent}
                    onChange={e => setFunruralPercent(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-stone-200 bg-white"
                  />
                  <span className="absolute right-2.5 top-2 text-xs text-stone-400">%</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
                  - R$ {funruralAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Resultado Financeiro Destacado */}
          <div className="p-5 bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-2xl shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-200/80">
              <span>Valor Bruto da Operação:</span>
              <span className="font-mono font-bold">R$ {grossTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-red-300">
              <span>Total de Deduções e Custos:</span>
              <span className="font-mono font-bold">- R$ {totalDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="pt-3 border-t border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                  Valor Líquido a Receber
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">
                  R$ {netTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="sm:text-right bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60">
                <span className="text-[10px] uppercase text-stone-300 block">Preço Líquido Efetivo</span>
                <span className="text-base font-bold font-mono text-white">
                  R$ {netPricePerBag.toFixed(2)} <span className="text-xs font-normal text-stone-300">/ saca</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral: Conversor de Peso & Beneficiamento */}
        <div className="lg:col-span-5 space-y-6">
          {/* Conversor de Peso */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                <Scale className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-stone-900">Conversão Sacas ⇄ Quilos</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Volume em Sacas (60kg)
              </label>
              <input
                type="number"
                min="1"
                value={converterBags}
                onChange={e => setConverterBags(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="text-[11px] text-stone-500 uppercase font-semibold block">Quilos (kg)</span>
                <span className="text-lg font-black font-mono text-stone-900">
                  {(converterBags * 60).toLocaleString('pt-BR')} kg
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="text-[11px] text-stone-500 uppercase font-semibold block">Toneladas (t)</span>
                <span className="text-lg font-black font-mono text-stone-900">
                  {((converterBags * 60) / 1000).toFixed(2)} t
                </span>
              </div>
            </div>
          </div>

          {/* Rendimento de Beneficiamento (Café em Coco -> Pilado) */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-stone-900">Rendimento de Pilagem / Beneficiamento</h2>
                <p className="text-[11px] text-stone-500">Estimativa de café em coco para café beneficiado</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sacas Café em Coco
                </label>
                <input
                  type="number"
                  min="1"
                  value={cocoBags}
                  onChange={e => setCocoBags(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm font-mono font-bold rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Rendimento (%)
                </label>
                <input
                  type="number"
                  min="40"
                  max="60"
                  value={yieldPercent}
                  onChange={e => setYieldPercent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm font-mono font-bold rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-900 font-semibold">Estimativa Pilado Líquido:</span>
                <span className="font-mono font-extrabold text-stone-900 text-sm">
                  ~ {estimatedCleanBags} sacas (60kg)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Palha residual para lavoura:</span>
                <span className="font-mono">~ {estimatedStrawKg.toLocaleString('pt-BR')} kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
