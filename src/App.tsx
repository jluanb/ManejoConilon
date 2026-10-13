import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { LotList } from './components/LotList';
import { MovementsHistory } from './components/MovementsHistory';
import { WarehousesView } from './components/WarehousesView';
import { CoffeeCalculator } from './components/Calculator';
import { LotModal } from './components/LotModal';
import { MovementModal } from './components/MovementModal';
import { RomaneioModal } from './components/RomaneioModal';
import { BackupModal } from './components/BackupModal';
import { QuoteEditModal } from './components/QuoteEditModal';
import { LotDetailModal } from './components/LotDetailModal';
import { storageService } from './services/storageService';
import { CoffeeLot, StockMovement, Warehouse, CoffeePriceQuote, FarmProfile } from './types/coffee';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Dados centrais
  const [lots, setLots] = useState<CoffeeLot[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [quotes, setQuotes] = useState<CoffeePriceQuote[]>([]);
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(storageService.getFarmProfile());

  // Modais
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<CoffeeLot | null>(null);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [preselectedLotForMovement, setPreselectedLotForMovement] = useState<CoffeeLot | null>(null);
  const [movementDefaultType, setMovementDefaultType] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');

  const [isRomaneioOpen, setIsRomaneioOpen] = useState(false);
  const [activeMovementForRomaneio, setActiveMovementForRomaneio] = useState<StockMovement | null>(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const [isQuoteEditOpen, setIsQuoteEditOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<CoffeePriceQuote | null>(null);

  const [isLotDetailOpen, setIsLotDetailOpen] = useState(false);
  const [selectedLotDetail, setSelectedLotDetail] = useState<CoffeeLot | null>(null);

  // Carregar dados locais na inicialização
  const reloadData = () => {
    setLots(storageService.getLots());
    setMovements(storageService.getMovements());
    setWarehouses(storageService.getWarehouses());
    setQuotes(storageService.getQuotes());
    setFarmProfile(storageService.getFarmProfile());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Handlers para Lotes
  const handleOpenNewLot = () => {
    setEditingLot(null);
    setIsLotModalOpen(true);
  };

  const handleEditLot = (lot: CoffeeLot) => {
    setEditingLot(lot);
    setIsLotModalOpen(true);
  };

  const handleSaveLot = (lotData: Omit<CoffeeLot, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingLot) {
      storageService.updateLot(editingLot.id, lotData);
    } else {
      storageService.addLot(lotData);
    }
    reloadData();
  };

  const handleDeleteLot = (id: string) => {
    storageService.deleteLot(id);
    reloadData();
  };

  // Handlers para Movimentações
  const handleOpenNewMovement = () => {
    setPreselectedLotForMovement(null);
    setMovementDefaultType('ENTRADA');
    setIsMovementModalOpen(true);
  };

  const handleOpenMovementForLot = (lot: CoffeeLot, defaultType: 'ENTRADA' | 'SAIDA') => {
    setPreselectedLotForMovement(lot);
    setMovementDefaultType(defaultType);
    setIsMovementModalOpen(true);
  };

  const handleSaveMovement = (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
    const newMovement = storageService.addMovement(movementData, true);
    reloadData();
    // Abre automaticamente o romaneio para conferência ou impressão
    setActiveMovementForRomaneio(newMovement);
    setIsRomaneioOpen(true);
  };

  const handleViewRomaneio = (movement: StockMovement) => {
    setActiveMovementForRomaneio(movement);
    setIsRomaneioOpen(true);
  };

  const handleViewLotDetail = (lot: CoffeeLot) => {
    setSelectedLotDetail(lot);
    setIsLotDetailOpen(true);
  };

  // Handlers para Armazéns
  const handleAddWarehouse = (wh: Omit<Warehouse, 'id'>) => {
    storageService.addWarehouse(wh);
    reloadData();
  };

  const handleUpdateWarehouse = (id: string, updates: Partial<Warehouse>) => {
    storageService.updateWarehouse(id, updates);
    reloadData();
  };

  const handleDeleteWarehouse = (id: string) => {
    storageService.deleteWarehouse(id);
    reloadData();
  };

  // Handlers para Cotação
  const handleOpenQuoteEdit = (quote: CoffeePriceQuote) => {
    setEditingQuote(quote);
    setIsQuoteEditOpen(true);
  };

  const handleSaveQuotePrice = (id: string, newPrice: number) => {
    storageService.updateQuotePrice(id, newPrice);
    reloadData();
  };

  // Handlers para Perfil da Fazenda
  const handleUpdateFarmProfile = (profile: FarmProfile) => {
    storageService.saveFarmProfile(profile);
    setFarmProfile(profile);
  };

  return (
    <div className="min-h-screen bg-[#F7F4F0] text-stone-900 flex flex-col font-sans">
      {/* Navegação Superior */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lots={lots}
        quotes={quotes}
        onOpenNewLot={handleOpenNewLot}
        onOpenNewMovement={handleOpenNewMovement}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            lots={lots}
            movements={movements}
            warehouses={warehouses}
            quotes={quotes}
            onNavigateTab={setCurrentTab}
            onOpenNewLot={handleOpenNewLot}
            onOpenNewMovement={handleOpenNewMovement}
            onSelectLot={handleViewLotDetail}
            onOpenQuoteEdit={handleOpenQuoteEdit}
          />
        )}

        {currentTab === 'lots' && (
          <LotList
            lots={lots}
            warehouses={warehouses}
            onOpenNewLot={handleOpenNewLot}
            onEditLot={handleEditLot}
            onDeleteLot={handleDeleteLot}
            onOpenMovementForLot={handleOpenMovementForLot}
            onViewLotDetail={handleViewLotDetail}
          />
        )}

        {currentTab === 'movements' && (
          <MovementsHistory
            movements={movements}
            onOpenNewMovement={handleOpenNewMovement}
            onViewRomaneio={handleViewRomaneio}
          />
        )}

        {currentTab === 'warehouses' && (
          <WarehousesView
            warehouses={warehouses}
            lots={lots}
            onAddWarehouse={handleAddWarehouse}
            onUpdateWarehouse={handleUpdateWarehouse}
            onDeleteWarehouse={handleDeleteWarehouse}
            onSelectLot={handleViewLotDetail}
          />
        )}

        {currentTab === 'calculator' && (
          <CoffeeCalculator quotes={quotes} />
        )}
      </main>

      {/* Barra de Navegação Rápida Flutuante para Celular */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#22130C]/95 backdrop-blur-md border-t border-[#3E2317] py-2 px-3 z-30 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            currentTab === 'dashboard' ? 'text-amber-400' : 'text-stone-400'
          }`}
        >
          <span className="text-base leading-none">📊</span>
          Painel
        </button>
        <button
          onClick={() => setCurrentTab('lots')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            currentTab === 'lots' ? 'text-amber-400' : 'text-stone-400'
          }`}
        >
          <span className="text-base leading-none">☕</span>
          Lotes
        </button>
        <button
          onClick={handleOpenNewMovement}
          className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-amber-500 text-stone-950 shadow-lg border-2 border-[#22130C] active:scale-95 transition"
          title="Nova Entrada/Saída"
        >
          <span className="text-xl font-bold leading-none">+</span>
        </button>
        <button
          onClick={() => setCurrentTab('movements')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            currentTab === 'movements' ? 'text-amber-400' : 'text-stone-400'
          }`}
        >
          <span className="text-base leading-none">📋</span>
          Romaneios
        </button>
        <button
          onClick={() => setCurrentTab('calculator')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            currentTab === 'calculator' ? 'text-amber-400' : 'text-stone-400'
          }`}
        >
          <span className="text-base leading-none">🧮</span>
          Simulador
        </button>
      </div>

      {/* Modais Globais */}
      <LotModal
        isOpen={isLotModalOpen}
        onClose={() => setIsLotModalOpen(false)}
        onSave={handleSaveLot}
        editingLot={editingLot}
        warehouses={warehouses}
      />

      <MovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        lots={lots}
        preselectedLot={preselectedLotForMovement}
        defaultType={movementDefaultType}
        onSaveMovement={handleSaveMovement}
      />

      <RomaneioModal
        isOpen={isRomaneioOpen}
        onClose={() => setIsRomaneioOpen(false)}
        movement={activeMovementForRomaneio}
        farmProfile={farmProfile}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        farmProfile={farmProfile}
        onUpdateFarmProfile={handleUpdateFarmProfile}
        onDataReloaded={reloadData}
      />

      <QuoteEditModal
        isOpen={isQuoteEditOpen}
        onClose={() => setIsQuoteEditOpen(false)}
        quote={editingQuote}
        onSaveQuote={handleSaveQuotePrice}
      />

      <LotDetailModal
        isOpen={isLotDetailOpen}
        onClose={() => setIsLotDetailOpen(false)}
        lot={selectedLotDetail}
        onEditLot={handleEditLot}
        onOpenMovement={handleOpenMovementForLot}
      />
    </div>
  );
}
