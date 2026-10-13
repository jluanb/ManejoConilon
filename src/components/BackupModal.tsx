import React, { useState } from 'react';
import { 
  X, 
  HardDriveDownload, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Building,
  Save,
  HelpCircle
} from 'lucide-react';
import { FarmProfile } from '../types/coffee';
import { storageService } from '../services/storageService';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmProfile: FarmProfile;
  onUpdateFarmProfile: (profile: FarmProfile) => void;
  onDataReloaded: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  farmProfile,
  onUpdateFarmProfile,
  onDataReloaded,
}) => {
  const [profileForm, setProfileForm] = useState<FarmProfile>(farmProfile);
  const [profileSaved, setProfileSaved] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = storageService.exportFullBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `backup_conilon_stock_pro_${dateStr}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedbackMsg({ type: 'success', text: 'Backup baixado com sucesso! Guarde o arquivo ou envie para o celular/Google Drive.' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = storageService.importFullBackupJSON(content);
        if (success) {
          onDataReloaded();
          setFeedbackMsg({ type: 'success', text: 'Dados restaurados com sucesso! O estoque foi atualizado.' });
        } else {
          setFeedbackMsg({ type: 'error', text: 'Arquivo inválido. Verifique se é um backup gerado pelo Conilon Stock Pro.' });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csvContent = storageService.exportLotsToCSV();
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_estoque_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFarmProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleClearAll = () => {
    if (confirm('Atenção: Esta ação apagará todos os lotes e movimentações do armazenamento local deste navegador. Deseja prosseguir?')) {
      storageService.clearAllData();
      onDataReloaded();
      setFeedbackMsg({ type: 'success', text: 'Todos os lotes e movimentações foram limpos.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#2C1810] text-[#F5EDE6] px-6 py-4 flex items-center justify-between border-b border-[#4A2E20]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/40">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif">
                Backup, Sincronização Local & Fazenda
              </h2>
              <p className="text-xs text-amber-200/70">
                100% Gratuito • Segurança total no seu dispositivo • Sem custos adicionais
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {feedbackMsg && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
              feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              {feedbackMsg.text}
            </div>
          )}

          {/* Sincronização entre Dispositivos Sem Custo */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Como Sincronizar entre Computador e Celular Grátis
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Você pode transferir todos os seus lotes de café entre celulares e computadores com facilidade e sem pagar servidores:
            </p>
            <ol className="text-xs text-stone-600 space-y-1 list-decimal list-inside bg-white p-3 rounded-xl border border-stone-100">
              <li>Clique em <strong>"Baixar Arquivo de Backup"</strong> abaixo.</li>
              <li>Envie o arquivo <strong>.json</strong> para seu WhatsApp, e-mail ou Google Drive pessoal.</li>
              <li>No outro aparelho, acesse este site, abra esta tela e clique em <strong>"Restaurar a partir de Arquivo"</strong>.</li>
            </ol>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadBackup}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4" />
                Baixar Arquivo de Backup (.json)
              </button>

              <label className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                <Upload className="w-4 h-4" />
                <span>Restaurar Backup do Arquivo</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Exportação em Planilhas */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Exportar para Excel / Google Planilhas
            </h3>
            <p className="text-xs text-stone-600">
              Gera planilha CSV com todos os lotes, sacas, umidade, preços e localização para controle contábil.
            </p>
            <button
              onClick={handleExportCSV}
              className="py-2 px-4 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              Baixar Planilha CSV de Estoque
            </button>
          </div>

          {/* Configuração dos Dados da Fazenda / Produtor */}
          <form onSubmit={handleSaveProfile} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-800" />
                Dados da Fazenda / Produtor (Para Romaneios)
              </h3>
              {profileSaved && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Salvo!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Nome da Fazenda / Sítio
                </label>
                <input
                  type="text"
                  value={profileForm.farmName}
                  onChange={e => setProfileForm({ ...profileForm, farmName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Nome do Produtor / Responsável
                </label>
                <input
                  type="text"
                  value={profileForm.producerName}
                  onChange={e => setProfileForm({ ...profileForm, producerName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  CPF / CNPJ / Inscrição Estadual
                </label>
                <input
                  type="text"
                  value={profileForm.document}
                  onChange={e => setProfileForm({ ...profileForm, document: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Município & UF
                </label>
                <input
                  type="text"
                  value={`${profileForm.city} - ${profileForm.state}`}
                  onChange={e => {
                    const parts = e.target.value.split('-');
                    setProfileForm({
                      ...profileForm,
                      city: parts[0]?.trim() || profileForm.city,
                      state: parts[1]?.trim() || profileForm.state,
                    });
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Salvar Dados da Fazenda
              </button>
            </div>
          </form>

          {/* Zona de Dados */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3 text-xs">
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Zerar Todos os Dados do Estoque
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
