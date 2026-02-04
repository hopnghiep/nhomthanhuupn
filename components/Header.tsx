
import React, { useState, useRef, useEffect } from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CogIcon } from './icons/CogIcon';
import { BellIcon } from './icons/BellIcon';
import { NotificationPermission } from '../hooks/useNotifications';
import { Member } from '../types';
import { WrenchIcon } from './icons/WrenchIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { ArrowsPointingOutIcon } from './icons/ArrowsPointingOutIcon';
import { ArrowsPointingInIcon } from './icons/ArrowsPointingInIcon';
import { ArrowUturnLeftIcon } from './icons/ArrowUturnLeftIcon';
import { ArrowUturnRightIcon } from './icons/ArrowUturnRightIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';

type View = 'home' | 'members' | 'guests' | 'events';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isAdminMode: boolean;
  isEffectiveAdmin: boolean;
  onToggleAdminMode: () => void;
  onToggleSettings: () => void;
  notificationPermission: NotificationPermission;
  onNotificationRequest: () => void;
  currentUser: Member | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onOpenAdminDashboard: () => void;
  onOpenGuide: () => void;
  isWideMode: boolean;
  onToggleWideMode: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onExportData?: () => void;
  onImportData?: () => void;
}

const NavLink: React.FC<{
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
}> = ({ label, view, currentView, onClick }) => {
  const isActive = view === currentView;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-md text-[10px] sm:text-xs md:text-sm font-black transition-all duration-200 uppercase tracking-tighter whitespace-nowrap ${
        isActive
          ? 'bg-primary-600 text-text-accent shadow-md scale-105'
          : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
      }`}
    >
      {label}
    </button>
  );
};

const UserMenu: React.FC<{
    currentUser: Member;
    onLogout: () => void;
}> = ({ currentUser, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-background-tertiary transition-colors"
            >
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="font-bold text-text-primary hidden sm:inline truncate max-w-[100px] uppercase text-xs">{currentUser.name}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background-secondary rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-border-primary overflow-hidden">
                    <div className="py-1">
                        <div className="px-4 py-2 border-b border-border-primary sm:hidden">
                            <p className="text-xs font-black text-text-primary truncate uppercase">{currentUser.name}</p>
                        </div>
                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-3 text-xs text-red-600 hover:bg-red-50 font-black uppercase tracking-widest transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ 
    currentView, setCurrentView, isAdminMode, isEffectiveAdmin, onToggleAdminMode, 
    onToggleSettings, notificationPermission, onNotificationRequest, currentUser, 
    onLoginClick, onLogoutClick, onOpenAdminDashboard, onOpenGuide, isWideMode, onToggleWideMode,
    onUndo, onRedo, canUndo, canRedo, onExportData, onImportData
}) => {
  const { t } = useLanguage();
  const zaloGroupUrl = "https://zalo.me/g/ilzakd825";

  return (
    <header className="bg-background-secondary shadow-md sticky top-0 z-50">
      <div className={`${isWideMode ? 'max-w-none w-full px-4 lg:px-6' : 'max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'}`}>
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center overflow-hidden mr-2">
            <div className="flex-shrink-0">
              <span className="text-sm xs:text-base sm:text-2xl md:text-3xl font-black text-primary-600 tracking-tighter uppercase drop-shadow-sm truncate block">THÂN HỬU PHÚ NHUẬN</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-4">
            <nav className="hidden xl:block">
              <div className="ml-10 flex items-center space-x-2">
                <NavLink label={t('nav.home')} view="home" currentView={currentView} onClick={setCurrentView} />
                <NavLink label={t('nav.members')} view="members" currentView={currentView} onClick={setCurrentView} />
                <NavLink label={t('nav.guests')} view="guests" currentView={currentView} onClick={setCurrentView} />
                <NavLink label={t('nav.events')} view="events" currentView={currentView} onClick={setCurrentView} />
              </div>
            </nav>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
               {/* Mobile/Desktop Update Button - Priority 1, Name only as requested */}
               <button 
                  onClick={onImportData}
                  className="flex items-center px-2 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black text-red-600 hover:bg-red-50 transition-all duration-200 uppercase tracking-widest border-2 border-red-100 active:scale-95 shadow-sm"
                  title="Cập nhật dữ liệu"
               >
                  Cập nhật
               </button>

               {currentUser && (
                   <UserMenu currentUser={currentUser} onLogout={onLogoutClick} />
               )}
               
               <div className="hidden lg:flex items-center border-l border-border-primary pl-4">
                 <div className="flex items-center mr-2 space-x-2 border-r border-border-primary pr-2">
                    <button 
                        onClick={onUndo} 
                        disabled={!canUndo}
                        className={`p-2 rounded-full transition-all transform hover:scale-110 ${canUndo ? 'text-black hover:bg-background-tertiary' : 'text-text-secondary opacity-20 cursor-not-allowed'}`}
                        title={t('common.undo')}
                    >
                        <ArrowUturnLeftIcon className="w-7 h-7 stroke-[2.5]" />
                    </button>
                    <button 
                        onClick={onRedo} 
                        disabled={!canRedo}
                        className={`p-2 rounded-full transition-all transform hover:scale-110 ${canRedo ? 'text-black hover:bg-background-tertiary' : 'text-text-secondary opacity-20 cursor-not-allowed'}`}
                        title={t('common.redo')}
                    >
                        <ArrowUturnRightIcon className="w-7 h-7 stroke-[2.5]" />
                    </button>
                 </div>

                 <button onClick={onToggleWideMode} className="p-2 rounded-full text-text-secondary hover:bg-background-tertiary mx-1" title={isWideMode ? t('common.collapse') : t('common.expand')}>
                    {isWideMode ? <ArrowsPointingInIcon className="w-6 h-6" /> : <ArrowsPointingOutIcon className="w-6 h-6" />}
                 </button>

                 {isAdminMode && (
                    <a 
                        href={zaloGroupUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors relative group"
                        title="Thông báo Zalo Nhóm"
                    >
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
                    </a>
                 )}
                 
                 <button onClick={onOpenGuide} className="p-2 rounded-full text-text-secondary hover:bg-background-tertiary mx-1" title="Hướng dẫn sử dụng">
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                 </button>

                 <button onClick={onToggleSettings} className="p-2 rounded-full text-text-secondary hover:bg-background-tertiary mx-1">
                    <CogIcon className="w-6 h-6" />
                 </button>

                 <div className="flex items-center ml-2 relative">
                    <span className="text-[10px] font-bold mr-2 text-text-secondary uppercase tracking-widest">Admin</span>
                    <button
                        type="button"
                        className={`${isAdminMode ? 'bg-red-600 border-red-700' : 'bg-background-tertiary border-red-500 animate-pulse'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-all shadow-md`}
                        onClick={onToggleAdminMode}
                    >
                        <span className={`${isAdminMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 mt-0.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                    </button>
                    {isEffectiveAdmin && (
                        <button 
                            onClick={onOpenAdminDashboard} 
                            className="ml-3 p-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors"
                            title={t('admin.tool')}
                        >
                            <WrenchIcon className="w-5 h-5" />
                        </button>
                    )}
                 </div>
               </div>

               {/* Mobile Action buttons */}
               <div className="lg:hidden flex items-center space-x-1">
                    <button onClick={onToggleSettings} className="p-1.5 rounded-full text-text-secondary hover:bg-background-tertiary">
                        <CogIcon className="w-5 h-5" />
                    </button>
                    <div className="flex items-center border-l border-border-primary pl-1">
                        <button
                            type="button"
                            className={`${isAdminMode ? 'bg-red-600 border-red-700' : 'bg-background-tertiary border-red-500'} relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-all`}
                            onClick={onToggleAdminMode}
                        >
                            <span className={`${isAdminMode ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 mt-px ml-px transform rounded-full bg-white shadow`} />
                        </button>
                    </div>
               </div>
            </div>
          </div>
        </div>
      </div>

       {/* Mobile Nav Bar */}
      <nav className="md:hidden bg-background-primary p-2 border-t border-border-primary overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 min-w-max px-1">
              <NavLink label={t('nav.home')} view="home" currentView={currentView} onClick={setCurrentView} />
              <NavLink label={t('nav.members')} view="members" currentView={currentView} onClick={setCurrentView} />
              <NavLink label={t('nav.guests')} view="guests" currentView={currentView} onClick={setCurrentView} />
              <NavLink label={t('nav.events')} view="events" currentView={currentView} onClick={setCurrentView} />
        </div>
      </nav>

      {/* Mobile Tools Tray */}
      <div className="md:hidden bg-background-tertiary px-3 py-2 border-t border-border-primary flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-4">
                <button onClick={onUndo} disabled={!canUndo} className={`p-1 ${canUndo ? 'text-black' : 'text-text-secondary opacity-20'}`}><ArrowUturnLeftIcon className="w-6 h-6 stroke-[2.5]"/></button>
                <button onClick={onRedo} disabled={!canRedo} className={`p-1 ${canRedo ? 'text-black' : 'text-text-secondary opacity-20'}`}><ArrowUturnRightIcon className="w-6 h-6 stroke-[2.5]"/></button>
            </div>
            <div className="flex items-center space-x-3">
                {isEffectiveAdmin && (
                    <button onClick={onExportData} title="Xuất" className="p-1 text-black"><ArrowDownTrayIcon className="w-5 h-5"/></button>
                )}
                {isEffectiveAdmin && (
                    <button onClick={onOpenAdminDashboard} className="p-1.5 bg-primary-600 text-white rounded-lg shadow-sm"><WrenchIcon className="w-4 h-4"/></button>
                )}
                <button onClick={onOpenGuide} className="p-1 text-text-secondary"><QuestionMarkCircleIcon className="w-5 h-5"/></button>
            </div>
      </div>
      <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
};
