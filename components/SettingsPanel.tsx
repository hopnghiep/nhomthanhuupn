
import React from 'react';
import Modal from './Modal';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsButton = ({ label, onClick, isActive }: { label: string, onClick: () => void, isActive: boolean }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${isActive ? 'bg-primary-600 text-text-accent' : 'bg-background-tertiary text-text-primary hover:bg-background-tertiary-hover'}`}
    >
        {label}
    </button>
);

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSize = parseInt(e.target.value, 10);
      if (!isNaN(newSize)) {
          setTheme(prev => ({ ...prev, size: newSize }));
      }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('settings.title')}>
      <div className="p-6 space-y-6">
        
        {/* Display Mode */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">{t('settings.displayMode')}</h3>
          <div className="flex flex-wrap gap-2">
            <SettingsButton label={t('theme.light')} onClick={() => setTheme(p => ({ ...p, mode: 'light' }))} isActive={theme.mode === 'light'} />
            <SettingsButton label={t('theme.dark')} onClick={() => setTheme(p => ({ ...p, mode: 'dark' }))} isActive={theme.mode === 'dark'} />
            <SettingsButton label={t('theme.contrast')} onClick={() => setTheme(p => ({ ...p, mode: 'contrast' }))} isActive={theme.mode === 'contrast'} />
          </div>
        </div>
        
        {/* Color Theme */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">{t('settings.theme')}</h3>
          <div className="flex flex-wrap gap-2">
            <SettingsButton label={t('theme.indigo')} onClick={() => setTheme(p => ({ ...p, color: 'indigo' }))} isActive={theme.color === 'indigo'} />
            <SettingsButton label={t('theme.teal')} onClick={() => setTheme(p => ({ ...p, color: 'teal' }))} isActive={theme.color === 'teal'} />
            <SettingsButton label={t('theme.rose')} onClick={() => setTheme(p => ({ ...p, color: 'rose' }))} isActive={theme.color === 'rose'} />
            <SettingsButton label={t('theme.slate')} onClick={() => setTheme(p => ({ ...p, color: 'mono' }))} isActive={theme.color === 'mono'} />
            <SettingsButton label={t('theme.green')} onClick={() => setTheme(p => ({ ...p, color: 'green' }))} isActive={theme.color === 'green'} />
            <SettingsButton label={t('theme.orange')} onClick={() => setTheme(p => ({ ...p, color: 'orange' }))} isActive={theme.color === 'orange'} />
            <SettingsButton label={t('theme.purple')} onClick={() => setTheme(p => ({ ...p, color: 'purple' }))} isActive={theme.color === 'purple'} />
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">{t('settings.fontFamily')}</h3>
          <div className="flex flex-wrap gap-2">
            <SettingsButton label={t('font.inter')} onClick={() => setTheme(p => ({ ...p, font: 'inter' }))} isActive={theme.font === 'inter'} />
            <SettingsButton label={t('font.roboto')} onClick={() => setTheme(p => ({ ...p, font: 'roboto' }))} isActive={theme.font === 'roboto'} />
            <SettingsButton label={t('font.lora')} onClick={() => setTheme(p => ({ ...p, font: 'lora' }))} isActive={theme.font === 'lora'} />
            <SettingsButton label={t('font.poppins')} onClick={() => setTheme(p => ({ ...p, font: 'poppins' }))} isActive={theme.font === 'poppins'} />
            <SettingsButton label={t('font.playfair')} onClick={() => setTheme(p => ({ ...p, font: 'playfair' }))} isActive={theme.font === 'playfair'} />
            <SettingsButton label={t('font.arial')} onClick={() => setTheme(p => ({ ...p, font: 'arial' }))} isActive={theme.font === 'arial'} />
            <SettingsButton label={t('font.times')} onClick={() => setTheme(p => ({ ...p, font: 'times' }))} isActive={theme.font === 'times'} />
            <SettingsButton label={t('font.system')} onClick={() => setTheme(p => ({ ...p, font: 'system' }))} isActive={theme.font === 'system'} />
          </div>
        </div>

        {/* Font Size - Range Slider */}
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-text-primary">{t('settings.fontSize')}</h3>
                <span className="text-primary-600 font-bold bg-primary-50 px-3 py-1 rounded-md">{theme.size}px</span>
            </div>
            
            <div className="flex items-center space-x-4">
                <span className="text-xs text-text-secondary">A</span>
                <input 
                    type="range" 
                    min="12" 
                    max="32" 
                    step="1"
                    value={theme.size} 
                    onChange={handleFontSizeChange}
                    className="flex-grow h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <span className="text-xl text-text-primary font-bold">A</span>
            </div>

            <div className="flex items-center space-x-2 justify-end">
                <label htmlFor="fontSizeInput" className="text-sm text-text-secondary">Nhập cỡ chữ:</label>
                <input
                    id="fontSizeInput"
                    type="number"
                    min="10"
                    max="64"
                    value={theme.size}
                    onChange={handleFontSizeChange}
                    className="w-20 px-2 py-1 bg-white text-gray-900 border border-border-primary rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
            </div>
        </div>

      </div>
    </Modal>
  );
};
