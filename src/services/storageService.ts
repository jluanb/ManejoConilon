import { CoffeeLot, StockMovement, Warehouse, CoffeePriceQuote, FarmProfile } from '../types/coffee';

const STORAGE_KEYS = {
  LOTS: 'conilon_stock_lots_v2',
  MOVEMENTS: 'conilon_stock_movements_v2',
  WAREHOUSES: 'conilon_stock_warehouses_v2',
  QUOTES: 'conilon_stock_quotes_v2',
  FARM_PROFILE: 'conilon_stock_farm_profile_v2',
};

// Armazéns padrão limpos para organização inicial
export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'w-1',
    name: 'Tulha Principal 01',
    code: 'T-01',
    type: 'Tulha de Madeira',
    capacityBags: 1000,
    notes: 'Tulha para armazenamento de café seco',
  },
  {
    id: 'w-2',
    name: 'Galpão A',
    code: 'GL-A',
    type: 'Galpão de Alvenaria',
    capacityBags: 2000,
    notes: 'Armazenamento em sacaria de juta',
  },
];

export const INITIAL_QUOTES: CoffeePriceQuote[] = [
  {
    id: 'q-1',
    name: 'Café Conilon Tipo 7 (P13 acima)',
    group: 'Conilon',
    description: 'Padrão Cooabriel / Norte do ES - até 20% de defeitos',
    price: 1380.00,
    referenceLocation: 'Cooabriel / Norte ES',
    changePercent: 0,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'q-2',
    name: 'Café Conilon Especial (80+ pts)',
    group: 'Conilon',
    description: 'Robusta de qualidade superior rastreado',
    price: 1650.00,
    referenceLocation: 'Espírito Santo',
    changePercent: 0,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'q-3',
    name: 'Café Arábica Tipo 6 (Duro)',
    group: 'Arábica',
    description: 'Referência CEPEA / Bebida Dura',
    price: 1820.00,
    referenceLocation: 'Bolsa / Cooperativas',
    changePercent: 0,
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_FARM_PROFILE: FarmProfile = {
  farmName: '',
  producerName: '',
  document: '',
  city: '',
  state: '',
  contact: '',
};

// Inicialmente sem lotes ou movimentações prévias
export const INITIAL_LOTS: CoffeeLot[] = [];
export const INITIAL_MOVEMENTS: StockMovement[] = [];

export const storageService = {
  // Limpa chaves legadas antigas se existirem
  cleanLegacyData() {
    try {
      localStorage.removeItem('conilon_stock_lots_v1');
      localStorage.removeItem('conilon_stock_movements_v1');
      localStorage.removeItem('conilon_stock_warehouses_v1');
      localStorage.removeItem('conilon_stock_quotes_v1');
      localStorage.removeItem('conilon_stock_farm_profile_v1');
    } catch {
      // Ignora erro
    }
  },

  getLots(): CoffeeLot[] {
    try {
      this.cleanLegacyData();
      const data = localStorage.getItem(STORAGE_KEYS.LOTS);
      if (!data) {
        this.saveLots(INITIAL_LOTS);
        return INITIAL_LOTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LOTS;
    }
  },

  saveLots(lots: CoffeeLot[]) {
    localStorage.setItem(STORAGE_KEYS.LOTS, JSON.stringify(lots));
  },

  addLot(lot: Omit<CoffeeLot, 'id' | 'createdAt' | 'updatedAt'>): CoffeeLot {
    const lots = this.getLots();
    const newLot: CoffeeLot = {
      ...lot,
      id: 'lot-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    lots.unshift(newLot);
    this.saveLots(lots);

    // Registra movimentação de entrada inicial automática
    if (newLot.bagsCount > 0) {
      this.addMovement({
        lotId: newLot.id,
        lotCode: newLot.code,
        variety: newLot.variety,
        type: 'ENTRADA',
        reason: 'Colheita Própria',
        bagsCount: newLot.bagsCount,
        weightKg: newLot.weightKg,
        date: new Date().toISOString().split('T')[0],
        receiptNumber: `ROM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        counterparty: newLot.producer || 'Fazenda',
        warehouseDest: newLot.warehouseLocation,
        moisture: newLot.moisture,
        notes: `Entrada inicial cadastrada no lote ${newLot.code}`,
      }, false);
    }

    return newLot;
  },

  updateLot(id: string, updates: Partial<CoffeeLot>): CoffeeLot | null {
    const lots = this.getLots();
    const index = lots.findIndex(l => l.id === id);
    if (index === -1) return null;

    const updatedLot: CoffeeLot = {
      ...lots[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    lots[index] = updatedLot;
    this.saveLots(lots);
    return updatedLot;
  },

  deleteLot(id: string): boolean {
    const lots = this.getLots();
    const filtered = lots.filter(l => l.id !== id);
    this.saveLots(filtered);
    return true;
  },

  getMovements(): StockMovement[] {
    try {
      this.cleanLegacyData();
      const data = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      if (!data) {
        this.saveMovements(INITIAL_MOVEMENTS);
        return INITIAL_MOVEMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOVEMENTS;
    }
  },

  saveMovements(movements: StockMovement[]) {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  },

  addMovement(
    movementData: Omit<StockMovement, 'id' | 'createdAt'>,
    updateLotCount = true
  ): StockMovement {
    const movements = this.getMovements();
    const newMovement: StockMovement = {
      ...movementData,
      id: 'mov-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    if (updateLotCount && movementData.lotId) {
      const lots = this.getLots();
      const targetLot = lots.find(l => l.id === movementData.lotId);
      if (targetLot) {
        let newCount = targetLot.bagsCount;
        if (movementData.type === 'ENTRADA') {
          newCount += movementData.bagsCount;
        } else if (movementData.type === 'SAIDA') {
          newCount = Math.max(0, newCount - movementData.bagsCount);
        } else if (movementData.type === 'AJUSTE') {
          newCount = movementData.bagsCount;
        }
        targetLot.bagsCount = newCount;
        targetLot.weightKg = newCount * 60;
        targetLot.updatedAt = new Date().toISOString();
        if (newCount === 0) {
          targetLot.status = 'Vendido';
        }
        this.saveLots(lots);
      }
    }

    movements.unshift(newMovement);
    this.saveMovements(movements);
    return newMovement;
  },

  getWarehouses(): Warehouse[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WAREHOUSES);
      if (!data) {
        this.saveWarehouses(INITIAL_WAREHOUSES);
        return INITIAL_WAREHOUSES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_WAREHOUSES;
    }
  },

  saveWarehouses(warehouses: Warehouse[]) {
    localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(warehouses));
  },

  addWarehouse(wh: Omit<Warehouse, 'id'>): Warehouse {
    const warehouses = this.getWarehouses();
    const newWh: Warehouse = {
      ...wh,
      id: 'w-' + Date.now(),
    };
    warehouses.push(newWh);
    this.saveWarehouses(warehouses);
    return newWh;
  },

  updateWarehouse(id: string, updates: Partial<Warehouse>) {
    const warehouses = this.getWarehouses();
    const index = warehouses.findIndex(w => w.id === id);
    if (index !== -1) {
      warehouses[index] = { ...warehouses[index], ...updates };
      this.saveWarehouses(warehouses);
    }
  },

  deleteWarehouse(id: string) {
    const warehouses = this.getWarehouses();
    this.saveWarehouses(warehouses.filter(w => w.id !== id));
  },

  getQuotes(): CoffeePriceQuote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUOTES);
      if (!data) {
        this.saveQuotes(INITIAL_QUOTES);
        return INITIAL_QUOTES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_QUOTES;
    }
  },

  saveQuotes(quotes: CoffeePriceQuote[]) {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
  },

  updateQuotePrice(id: string, newPrice: number) {
    const quotes = this.getQuotes();
    const item = quotes.find(q => q.id === id);
    if (item) {
      const oldPrice = item.price;
      item.price = newPrice;
      item.changePercent = oldPrice > 0 ? Number((((newPrice - oldPrice) / oldPrice) * 100).toFixed(2)) : 0;
      item.updatedAt = new Date().toISOString();
      this.saveQuotes(quotes);
    }
  },

  getFarmProfile(): FarmProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FARM_PROFILE);
      if (!data) {
        this.saveFarmProfile(INITIAL_FARM_PROFILE);
        return INITIAL_FARM_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_FARM_PROFILE;
    }
  },

  saveFarmProfile(profile: FarmProfile) {
    localStorage.setItem(STORAGE_KEYS.FARM_PROFILE, JSON.stringify(profile));
  },

  exportFullBackupJSON(): string {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      farmProfile: this.getFarmProfile(),
      warehouses: this.getWarehouses(),
      lots: this.getLots(),
      movements: this.getMovements(),
      quotes: this.getQuotes(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importFullBackupJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.lots)) {
        throw new Error('Arquivo de backup inválido.');
      }
      if (data.farmProfile) this.saveFarmProfile(data.farmProfile);
      if (Array.isArray(data.warehouses)) this.saveWarehouses(data.warehouses);
      if (Array.isArray(data.lots)) this.saveLots(data.lots);
      if (Array.isArray(data.movements)) this.saveMovements(data.movements);
      if (Array.isArray(data.quotes)) this.saveQuotes(data.quotes);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  clearAllData() {
    this.saveLots([]);
    this.saveMovements([]);
    this.saveWarehouses(INITIAL_WAREHOUSES);
    this.saveFarmProfile(INITIAL_FARM_PROFILE);
  },

  exportLotsToCSV(): string {
    const lots = this.getLots();
    const headers = [
      'Código Lote',
      'Variedade',
      'Grupo',
      'Tipo Processamento',
      'Safra',
      'Sacas (60kg)',
      'Peso (kg)',
      'Armazém / Local',
      'Umidade (%)',
      'Peneira',
      'Defeitos',
      'Preço Estimado Saca (R$)',
      'Valor Total Lote (R$)',
      'Produtor / Fazenda',
      'Status',
      'Data Cadastro'
    ];

    const rows = lots.map(l => [
      `"${l.code}"`,
      `"${l.variety}"`,
      `"${l.group}"`,
      `"${l.processType}"`,
      `"${l.harvestYear}"`,
      l.bagsCount,
      l.weightKg,
      `"${l.warehouseLocation}"`,
      l.moisture,
      `"${l.sieve}"`,
      `"${l.defects}"`,
      l.estimatedPricePerBag.toFixed(2),
      (l.bagsCount * l.estimatedPricePerBag).toFixed(2),
      `"${l.producer}"`,
      `"${l.status}"`,
      `"${new Date(l.createdAt).toLocaleDateString('pt-BR')}"`
    ]);

    return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  },

  exportMovementsToCSV(): string {
    const movements = this.getMovements();
    const headers = [
      'Data',
      'Romaneio / Doc',
      'Tipo',
      'Motivo',
      'Lote',
      'Variedade',
      'Sacas (60kg)',
      'Peso (kg)',
      'Contraparte (Comprador/Produtor)',
      'Preço Unitário (R$)',
      'Valor Total (R$)',
      'Motorista',
      'Placa Veículo',
      'Observações'
    ];

    const rows = movements.map(m => [
      `"${m.date}"`,
      `"${m.receiptNumber || '-'}"`,
      `"${m.type}"`,
      `"${m.reason}"`,
      `"${m.lotCode}"`,
      `"${m.variety}"`,
      m.bagsCount,
      m.weightKg,
      `"${m.counterparty || '-'}"`,
      m.unitPrice ? m.unitPrice.toFixed(2) : '-',
      m.totalPrice ? m.totalPrice.toFixed(2) : '-',
      `"${m.driverName || '-'}"`,
      `"${m.vehiclePlate || '-'}"`,
      `"${m.notes || ''}"`
    ]);

    return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  }
};
