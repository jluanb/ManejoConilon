export type CoffeeVariety = 
  | 'Conilon'
  | 'Robusta Amazônico'
  | 'Outro';

export type CoffeeGroup = 'Conilon' | 'Arábica' | 'Outro';

export type ProcessType = 
  | 'Natural / Em Coco'
  | 'Bica Corrida'
  | 'Beneficiado / Pilado'
  | 'Cereja Descascado'
  | 'Despolpado'
  | 'Café Escolha';

export type LotStatus = 'Disponível' | 'Reservado' | 'Vendido' | 'Em Beneficiamento';

export interface CoffeeLot {
  id: string;
  code: string;                 // ex: LOT-2026-001
  variety: CoffeeVariety | string;
  group: CoffeeGroup;
  processType: ProcessType | string;
  harvestYear: string;          // ex: 2025/2026
  bagsCount: number;            // Quantidade de sacas de 60kg
  weightKg: number;             // Peso total em kg (geralmente sacas * 60)
  warehouseId: string;          // ID do armazém / tulha
  warehouseLocation: string;    // ex: Tulha 02 - Pilha A
  moisture: number;             // % Umidade (ex: 11.5%)
  sieve: string;                // ex: Peneira 13 acima, Peneira 16
  defects: string;              // ex: Tipo 7 (20% defeitos), Tipo 6
  cupProfile?: string;          // ex: Bebida Dura, Rio, Neutro
  estimatedPricePerBag: number; // R$ por saca
  producer: string;             // Nome do Produtor / Fazenda
  farmLocation: string;         // Município / Região
  notes?: string;
  status: LotStatus;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'ENTRADA' | 'SAIDA' | 'AJUSTE';

export type MovementReason = 
  | 'Colheita Própria'
  | 'Compra / Recebimento'
  | 'Venda / Embarque'
  | 'Remessa para Beneficiamento'
  | 'Retorno de Beneficiamento'
  | 'Transferência entre Tulhas'
  | 'Ajuste de Quebra / Inventário';

export interface StockMovement {
  id: string;
  lotId: string;
  lotCode: string;
  variety: string;
  type: MovementType;
  reason: MovementReason | string;
  bagsCount: number;
  weightKg: number;
  date: string;
  unitPrice?: number;           // R$ por saca (se venda/compra)
  totalPrice?: number;          // Valor financeiro total
  counterparty?: string;        // Comprador, Cooperativa ou Produtor (ex: Cooabriel, Café Três Corações, etc.)
  receiptNumber?: string;       // Número do Romaneio ou Nota Fiscal
  driverName?: string;          // Nome do motorista
  vehiclePlate?: string;        // Placa do caminhão/veículo
  warehouseSource?: string;
  warehouseDest?: string;
  moisture?: number;
  notes?: string;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: 'Tulha de Madeira' | 'Galpão de Alvenaria' | 'Silo Graneleiro' | 'Armazém Geral';
  capacityBags: number;
  notes?: string;
}

export interface CoffeePriceQuote {
  id: string;
  name: string;
  group: CoffeeGroup;
  description: string;
  price: number;
  referenceLocation: string;    // ex: ES - Região Norte (Cooabriel)
  changePercent: number;
  updatedAt: string;
}

export interface FarmProfile {
  farmName: string;
  producerName: string;
  document: string;             // CPF / CNPJ / Inscrição Estadual
  city: string;
  state: string;
  contact: string;
}
