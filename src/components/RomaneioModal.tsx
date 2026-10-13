import React from 'react';
import { X, Printer, Download, Coffee, Check, Building, Truck } from 'lucide-react';
import { StockMovement, FarmProfile } from '../types/coffee';

interface RomaneioModalProps {
  isOpen: boolean;
  onClose: () => void;
  movement: StockMovement | null;
  farmProfile: FarmProfile;
}

export const RomaneioModal: React.FC<RomaneioModalProps> = ({
  isOpen,
  onClose,
  movement,
  farmProfile,
}) => {
  if (!isOpen || !movement) return null;

  const handlePrint = () => {
    window.print();
  };

  const isEntry = movement.type === 'ENTRADA';
  const tareWeightKg = movement.bagsCount * 1; // 1kg por saca de juta/ráfia
  const netWeightKg = (movement.bagsCount * 60);
  const grossWeightKg = netWeightKg + tareWeightKg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 print:m-0 print:border-none print:shadow-none animate-in fade-in zoom-in-95">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-[#2C1810] text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Comprovante de Romaneio Cafeeiro</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Romaneio Document Printable Body */}
        <div className="p-8 font-sans text-stone-900 bg-white" id="romaneio-print-area">
          {/* Cabeçalho da Fazenda / Armazém */}
          <div className="border-b-2 border-stone-800 pb-4 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-black tracking-tight uppercase text-stone-900 font-serif">
                  {farmProfile.farmName}
                </h1>
                <p className="text-xs text-stone-600 font-medium">
                  Produtor: <strong>{farmProfile.producerName}</strong> • Doc: {farmProfile.document}
                </p>
                <p className="text-xs text-stone-600">
                  {farmProfile.city} - {farmProfile.state} • Contato: {farmProfile.contact}
                </p>
              </div>

              <div className="text-right border-l-2 border-stone-200 pl-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 block">
                  Romaneio Oficial Nº
                </span>
                <span className="text-lg font-black font-mono text-amber-900 block">
                  {movement.receiptNumber || 'ROM-' + movement.id.slice(-6)}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  Data: {new Date(movement.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between bg-stone-100 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider">
              <span>Tipo de Operação: {isEntry ? 'Entrada / Depósito de Café' : 'Saída / Venda e Embarque de Café'}</span>
              <span className="font-mono text-stone-700">Motivo: {movement.reason}</span>
            </div>
          </div>

          {/* Dados das Partes e Transporte */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div>
              <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider mb-1">
                {isEntry ? 'Origem / Remetente' : 'Destinatário / Comprador'}
              </span>
              <div className="font-semibold text-stone-900">{movement.counterparty || farmProfile.farmName}</div>
              <div className="text-stone-500">
                Local de Movimentação: {isEntry ? movement.warehouseDest : movement.warehouseSource || 'Armazém Central'}
              </div>
            </div>

            <div>
              <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider mb-1">
                Transporte & Logística
              </span>
              <div className="text-stone-900 font-semibold">
                Motorista: {movement.driverName || 'Transporte do Produtor'}
              </div>
              <div className="text-stone-600 font-mono">
                Placa do Veículo: {movement.vehiclePlate || 'Não informada'}
              </div>
            </div>
          </div>

          {/* Tabela de Discriminação do Café */}
          <div className="mb-4">
            <span className="font-bold text-xs uppercase tracking-wider text-stone-800 block mb-1.5">
              Discriminação da Carga Cafeeira
            </span>
            <table className="w-full text-left text-xs border border-stone-300">
              <thead className="bg-stone-100 border-b border-stone-300 font-bold uppercase text-[10px] text-stone-700">
                <tr>
                  <th className="p-2 border-r border-stone-300">Lote</th>
                  <th className="p-2 border-r border-stone-300">Variedade / Tipo</th>
                  <th className="p-2 border-r border-stone-300 text-center">Umidade</th>
                  <th className="p-2 border-r border-stone-300 text-right">Sacas (60kg)</th>
                  <th className="p-2 border-r border-stone-300 text-right">Peso Líq.</th>
                  <th className="p-2 text-right">Preço / Saca</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-200">
                  <td className="p-2 border-r border-stone-300 font-mono font-bold">{movement.lotCode}</td>
                  <td className="p-2 border-r border-stone-300 font-medium">{movement.variety}</td>
                  <td className="p-2 border-r border-stone-300 text-center font-mono font-bold">
                    {movement.moisture ? `${movement.moisture}%` : '11.8%'}
                  </td>
                  <td className="p-2 border-r border-stone-300 text-right font-mono font-bold">
                    {movement.bagsCount} sc
                  </td>
                  <td className="p-2 border-r border-stone-300 text-right font-mono">
                    {netWeightKg.toLocaleString('pt-BR')} kg
                  </td>
                  <td className="p-2 text-right font-mono font-bold">
                    {movement.unitPrice ? `R$ ${movement.unitPrice.toFixed(2)}` : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quadro Resumo de Pesagem */}
          <div className="grid grid-cols-3 gap-3 text-xs mb-5 p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-semibold block">Peso Bruto Estimado</span>
              <span className="text-sm font-bold font-mono text-stone-800">{grossWeightKg.toLocaleString('pt-BR')} kg</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-semibold block">Tara Sacaria (1kg/sc)</span>
              <span className="text-sm font-bold font-mono text-stone-800">{tareWeightKg.toLocaleString('pt-BR')} kg</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-semibold block">Peso Líquido Final</span>
              <span className="text-sm font-black font-mono text-amber-950">{netWeightKg.toLocaleString('pt-BR')} kg</span>
            </div>
          </div>

          {/* Valor Financeiro Total */}
          {movement.totalPrice && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Valor Total da Negociação (R$):
              </span>
              <span className="text-lg font-black font-mono text-emerald-800">
                R$ {movement.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Observações */}
          {movement.notes && (
            <div className="mb-6 p-2 bg-stone-50 rounded border border-stone-200 text-xs text-stone-600">
              <strong className="text-stone-800">Observações:</strong> {movement.notes}
            </div>
          )}

          {/* Campo de Assinaturas */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-stone-300 text-center text-xs">
            <div>
              <div className="border-b border-stone-400 pb-1 mb-1"></div>
              <span className="font-bold text-stone-900 block">{farmProfile.producerName}</span>
              <span className="text-[10px] text-stone-500">Produtor / Responsável Armazém</span>
            </div>

            <div>
              <div className="border-b border-stone-400 pb-1 mb-1"></div>
              <span className="font-bold text-stone-900 block">
                {movement.driverName || movement.counterparty || 'Transportador / Destinatário'}
              </span>
              <span className="text-[10px] text-stone-500">Recebedor / Transportador</span>
            </div>
          </div>

          {/* Rodapé do Sistema */}
          <div className="mt-8 pt-3 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-400">
            <span>Emitido via Conilon Stock Pro • Armazenamento Local Seguro</span>
            <span>{new Date().toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
