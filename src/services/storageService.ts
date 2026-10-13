import { CoffeeLot, StockMovement, Warehouse, CoffeePriceQuote, FarmProfile } from '../types/coffee';

const STORAGE_KEYS = {
  LOTS: 'conilon_stock_lots_v1',
  MOVEMENTS: 'conilon_stock_movements_v1',
  WAREHOUSES: 'conilon_stock_warehouses_v1',
  QUOTES: 'conilon_stock_quotes_v1',
  FARM_PROFILE: 'conilon_stock_farm_profile_v1',
};

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'w-1',
    name: 'Tulha Principal 01',
    code: 'T-01',
    type: 'Tulha de Madeira',
    capacityBags: 1200,
    notes: 'Tulha ventilada para café conilon seco em coco ou beneficiado',
  },
  {
    id: 'w-2',
    name: 'Galpão A - Pilha Central',
    code: 'GL-A',
    type: 'Galpão de Alvenaria',
    capacityBags: 2500,
    notes: 'Armazenamento em sacaria de juta sobre paletes de madeira',
  },
  {
    id: 'w-3',
    name: 'Tulha Secundária 02',
    code: 'T-02',
    type: 'Tulha de Madeira',
    capacityBags: 800,
    notes: 'Destinada a lotes de escolha e bica corrida',
  },
  {
    id: 'w-4',
    name: 'Silo Graneleiro 01',
    code: 'SILO-1',
    type: 'Silo Graneleiro',
    capacityBags: 3000,
    notes: 'Armazenamento a granel com aeração forçada',
  },
];

export const INITIAL_QUOTES: CoffeePriceQuote[] = [
  {
    id: 'q-1',
    name: 'Café Conilon Tipo 7 (P13 acima)',
    group: 'Conilon',
    description: 'Padrão Cooabriel / Norte do ES - até 20% de defeitos',
    price: 1380.00,
    referenceLocation: 'São Gabriel da Palha / Colatina - ES',
    changePercent: 1.85,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'q-2',
    name: 'Café Conilon Especial (80+ pts)',
    group: 'Conilon',
    description: 'Robusta de qualidade superior, fermentado e rastreado',
    price: 1650.00,
    referenceLocation: 'Região Serrana & Norte Capixaba',
    changePercent: 0.50,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'q-3',
    name: 'Café Conilon Tipo 7 (Bica Corrida)',
    group: 'Conilon',
    description: 'Bica corrida direto da tulha com impurezas usuais',
    price: 1320.00,
    referenceLocation: 'Espírito Santo / Rondônia',
    changePercent: 1.20,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'q-4',
    name: 'Café Arábica Tipo 6 (Duro)',
    group: 'Arábica',
    description: 'Referência CEPEA / Sul de Minas & Montanhas ES',
    price: 1820.00,
    referenceLocation: 'Venda Nova do Imigrante - ES / MG',
    changePercent: -0.65,
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_FARM_PROFILE: FarmProfile = {
  farmName: 'Sítio Santa Rita - Fazenda Café Ouro',
  producerName: 'Luan Bissoli & Família',
  document: '028.941.517-80 / IE: 082.910.44-1',
  city: 'São Gabriel da Palha',
  state: 'ES',
  contact: '(27) 99876-5432',
};

export const INITIAL_LOTS: CoffeeLot[] = [
  {
    id: 'lot-01',
    code: 'LOT-CN-2026-01',
    variety: 'Conilon Vitória',
    group: 'Conilon',
    processType: 'Beneficiado / Pilado',
    harvestYear: '2025/2026',
    bagsCount: 380,
    weightKg: 22800,
    warehouseId: 'w-1',
    warehouseLocation: 'Tulha Principal 01 - Baia 1',
    moisture: 11.8,
    sieve: 'Peneira 13 acima (86%)',
    defects: 'Tipo 7 (14% imperfeitos)',
    cupProfile: 'Bebida Neutra / Padrão Comercial',
    estimatedPricePerBag: 1380.00,
    producer: 'Sítio Santa Rita',
    farmLocation: 'Córrego da Laje, Talhão 04',
    notes: 'Café de excelente granulação, secador estático com temperatura controlada a 38°C.',
    status: 'Disponível',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lot-02',
    code: 'LOT-CN-2026-02',
    variety: 'Conilon Robusta Amazônico',
    group: 'Conilon',
    processType: 'Cereja Descascado',
    harvestYear: '2025/2026',
    bagsCount: 195,
    weightKg: 11700,
    warehouseId: 'w-2',
    warehouseLocation: 'Galpão A - Pilha Central',
    moisture: 11.2,
    sieve: 'Peneira 16 acima (92%)',
    defects: 'Tipo 6 (máx 9% defeitos)',
    cupProfile: 'Especial 82 pontos (notas de cacau e melaço)',
    estimatedPricePerBag: 1650.00,
    producer: 'Sítio Santa Rita',
    farmLocation: 'Talhão Novo dos Clones Incaper',
    notes: 'Lote selecionado colheita madura com fermentação anaeróbica 48h.',
    status: 'Disponível',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lot-03',
    code: 'LOT-CN-2026-03',
    variety: 'Conilon Tradicional',
    group: 'Conilon',
    processType: 'Natural / Em Coco',
    harvestYear: '2025/2026',
    bagsCount: 520,
    weightKg: 31200,
    warehouseId: 'w-4',
    warehouseLocation: 'Silo Graneleiro 01',
    moisture: 12.3,
    sieve: 'Bica Corrida',
    defects: 'Tipo 7/8',
    cupProfile: 'Bebida Limpa',
    estimatedPricePerBag: 1320.00,
    producer: 'Fazenda Boa Esperança (Parceria)',
    farmLocation: 'Linhares - ES',
    notes: 'Café em coco pronto para beneficiamento na máquina própria.',
    status: 'Disponível',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lot-04',
    code: 'LOT-AB-2026-01',
    variety: 'Arábica Catuaí',
    group: 'Arábica',
    processType: 'Beneficiado / Pilado',
    harvestYear: '2025/2026',
    bagsCount: 110,
    weightKg: 6600,
    warehouseId: 'w-2',
    warehouseLocation: 'Galpão A - Palete 04',
    moisture: 11.5,
    sieve: 'Peneira 16 acima',
    defects: 'Tipo 6 Bebida Dura',
    cupProfile: 'Acidez cítrica e corpo cremoso',
    estimatedPricePerBag: 1820.00,
    producer: 'Sítio Santa Rita - Talhão Alto',
    farmLocation: 'Região de Altitude (720m)',
    notes: 'Lote de arábica colhido a mão e despolpado no mesmo dia.',
    status: 'Reservado',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-01',
    lotId: 'lot-01',
    lotCode: 'LOT-CN-2026-01',
    variety: 'Conilon Vitória',
    type: 'ENTRADA',
    reason: 'Colheita Própria',
    bagsCount: 380,
    weightKg: 22800,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString().split('T')[0],
    receiptNumber: 'ROM-2026-0042',
    counterparty: 'Sítio Santa Rita (Colheita)',
    driverName: 'Marcos Vinicius',
    vehiclePlate: 'PPX-4A20',
    warehouseDest: 'Tulha Principal 01',
    moisture: 11.8,
    notes: 'Entrada após secagem e pilagem no beneficiador.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: 'mov-02',
    lotId: 'lot-02',
    lotCode: 'LOT-CN-2026-02',
    variety: 'Conilon Robusta Amazônico',
    type: 'ENTRADA',
    reason: 'Colheita Própria',
    bagsCount: 250,
    weightKg: 15000,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0],
    receiptNumber: 'ROM-2026-0051',
    counterparty: 'Sítio Santa Rita',
    driverName: 'Antônio Carlos',
    vehiclePlate: 'MQE-8B90',
    warehouseDest: 'Galpão A - Pilha Central',
    moisture: 11.2,
    notes: 'Entrada lote especial cereja descascado.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'mov-03',
    lotId: 'lot-02',
    lotCode: 'LOT-CN-2026-02',
    variety: 'Conilon Robusta Amazônico',
    type: 'SAIDA',
    reason: 'Venda / Embarque',
    bagsCount: 55,
    weightKg: 3300,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
    unitPrice: 1680.00,
    totalPrice: 92400.00,
    receiptNumber: 'ROM-2026-0068',
    counterparty: 'Cooperativa COOABRIEL - Unidade Central',
    driverName: 'Roberto Silva',
    vehiclePlate: 'OKZ-3312',
    warehouseSource: 'Galpão A - Pilha Central',
    notes: 'Venda antecipada com prêmio de qualidade por pontuação especial.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

export const storageService = {
  getLots(): CoffeeLot[] {
    try {
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
        counterparty: newLot.producer,
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
      version: '1.0',
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

  resetToSampleData() {
    this.saveLots(INITIAL_LOTS);
    this.saveMovements(INITIAL_MOVEMENTS);
    this.saveWarehouses(INITIAL_WAREHOUSES);
    this.saveQuotes(INITIAL_QUOTES);
    this.saveFarmProfile(INITIAL_FARM_PROFILE);
  },

  clearAllData() {
    this.saveLots([]);
    this.saveMovements([]);
    this.saveWarehouses(INITIAL_WAREHOUSES);
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
