
import React, { useRef } from 'react';
import Modal from './Modal';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClipboardDocumentIcon } from './icons/ClipboardDocumentIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { Member, Event, GroupInfo } from '../types';

interface AdminDashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    members: Member[];
    guests: Member[];
    events: Event[];
    groupInfo: GroupInfo;
    onChangePassword: () => void;
    onImportData: (data: any) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ 
    isOpen, onClose, members, guests, events, groupInfo, onChangePassword, onImportData 
}) => {
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const StatCard = ({ title, count, icon, color }: { title: string, count: number, icon: React.ReactNode, color: string }) => (
        <div className="bg-background-tertiary p-4 rounded-lg flex items-center space-x-4 border border-border-primary shadow-sm">
            <div className={`p-3 rounded-full ${color} text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-black text-text-primary">{count}</p>
            </div>
        </div>
    );

    const handleExportData = () => {
        // Lấy cấu hình giao diện từ localStorage để đóng gói vào JSON
        const themeSettings = JSON.parse(localStorage.getItem('app-theme') || '{}');
        const finalName = 'nhomthanhuupn';
        
        const fullData = {
            version: "2.5",
            appName: "NHÓM THÂN HỬU PHÚ NHUẬN",
            groupInfo,
            members,
            guests,
            events,
            themeSettings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        // Định dạng yêu cầu: Tên _ngày-tháng-năm _lúc_18h36.json
        const fileName = `${finalName} _${day}-${month}-${year} _lúc_${hours}h${minutes}.json`;

        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`Đã xuất tệp dữ liệu: ${fileName}`);
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (!json.members && !json.groupInfo) {
                    throw new Error("Sai định dạng");
                }
                onImportData(json);
            } catch (err) {
                alert("Lỗi: Tệp không đúng định dạng lưu trữ của ứng dụng.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('admin.dashboardTitle')}>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard 
                        title={t('memberType.member')} 
                        count={members.length} 
                        icon={<UserGroupIcon className="w-6 h-6" />} 
                        color="bg-indigo-600" 
                    />
                    <StatCard 
                        title={t('memberType.guest')} 
                        count={guests.length} 
                        icon={<UserGroupIcon className="w-6 h-6" />} 
                        color="bg-teal-600" 
                    />
                    <StatCard 
                        title={t('events.title')} 
                        count={events.length} 
                        icon={<CalendarIcon className="w-6 h-6" />} 
                        color="bg-rose-600" 
                    />
                </div>

                <div className="border-t border-border-primary pt-6">
                    <h3 className="text-lg font-black text-text-primary mb-4 flex items-center uppercase tracking-tighter">
                        <span className="w-2 h-6 bg-primary-600 mr-2 rounded-full"></span>
                        {t('admin.quickActions')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={handleExportData}
                            className="flex items-center p-4 bg-background-primary border-2 border-primary-100 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group shadow-sm"
                        >
                            <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors mr-4">
                                <ClipboardDocumentIcon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-text-primary">Xuất Gói Dữ Liệu</span>
                                <span className="text-xs text-text-secondary">Tải về tệp .json định dạng yêu cầu</span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center p-4 bg-background-primary border-2 border-primary-100 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group shadow-sm"
                        >
                            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors mr-4">
                                <ArrowUpTrayIcon className="w-6 h-6 text-teal-600" />
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".json" 
                                onChange={handleFileImport} 
                            />
                            <div className="text-left">
                                <span className="block font-bold text-text-primary">{t('admin.importData')}</span>
                                <span className="text-xs text-text-secondary">Thay thế dữ liệu hiện tại từ tệp dự phòng</span>
                            </div>
                        </button>

                        <button 
                            onClick={onChangePassword}
                            className="flex items-center p-4 bg-background-primary border-2 border-primary-100 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group col-span-1 sm:col-span-2 shadow-sm"
                        >
                            <div className="p-3 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors mr-4">
                                <LockClosedIcon className="w-6 h-6 text-rose-600" />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-text-primary">{t('admin.changePassword')}</span>
                                <span className="text-xs text-text-secondary">{t('admin.changePasswordDesc')}</span>
                            </div>
                        </button>
                    </div>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-xl border border-primary-200">
                    <h4 className="text-sm font-bold text-primary-800 mb-2">💡 Lưu ý:</h4>
                    <p className="text-xs text-primary-700 leading-relaxed">
                        Tên tệp JSON xuất ra sẽ bao gồm tên của bạn (hoặc mặc định admin) và thời gian chính xác để dễ dàng quản lý.
                    </p>
                </div>
            </div>
        </Modal>
    );
};
