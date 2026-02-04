
import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { Member } from '../types';
import { PhoneIcon } from './icons/PhoneIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { ViberIcon } from './icons/ViberIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface DirectMessagingModalProps {
    isOpen: boolean;
    onClose: () => void;
    allMembers: Member[];
}

export const DirectMessagingModal: React.FC<DirectMessagingModalProps> = ({ isOpen, onClose, allMembers }) => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = useMemo(() => {
        if (!searchQuery) return allMembers;
        const lower = searchQuery.toLowerCase();
        return allMembers.filter(m => 
            m.name.toLowerCase().includes(lower) || 
            m.profession.toLowerCase().includes(lower)
        );
    }, [allMembers, searchQuery]);

    const handleCall = (phoneNumber?: string) => {
        if (phoneNumber) {
            const clean = phoneNumber.replace(/\s+/g, '');
            window.location.href = `tel:${clean}`;
        }
    };

    const handleZalo = (phoneNumber?: string) => {
        if (phoneNumber) {
            const clean = phoneNumber.replace(/\s+/g, '');
            window.open(`https://zalo.me/${clean}`, '_blank');
        }
    };

    const handleViber = (phoneNumber?: string) => {
        if (phoneNumber) {
            const clean = phoneNumber.replace(/\s+/g, '');
            const viberNumber = clean.startsWith('0') ? '84' + clean.substring(1) : clean;
            window.location.href = `viber://chat?number=${viberNumber}`;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Bảng điều khiển Nhắn tin Trực tiếp">
            <div className="flex flex-col h-[70vh]">
                <div className="p-4 border-b border-border-primary">
                    <p className="text-sm text-text-secondary mb-4">
                        Chọn một thành viên để nhắn tin hoặc gọi điện trực tiếp qua các ứng dụng liên kết.
                    </p>
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Tìm tên thành viên..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background-tertiary border border-border-primary rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 hover:bg-background-tertiary rounded-xl transition-colors border border-transparent hover:border-border-primary">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-border-primary flex-shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-text-primary truncate">{member.name}</h4>
                                        <p className="text-xs text-text-secondary truncate">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <button 
                                        onClick={() => handleCall(member.phoneNumber)}
                                        disabled={!member.phoneNumber}
                                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-20 transition-all active:scale-95"
                                        title="Gọi điện"
                                    >
                                        <PhoneIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleZalo(member.phoneNumber)}
                                        disabled={!member.phoneNumber}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-20 transition-all active:scale-95"
                                        title="Zalo"
                                    >
                                        <ChatBubbleIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleViber(member.phoneNumber)}
                                        disabled={!member.phoneNumber}
                                        className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-20 transition-all active:scale-95"
                                        title="Viber"
                                    >
                                        <ViberIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-text-secondary italic">Không tìm thấy thành viên phù hợp.</p>
                        </div>
                    )}
                </div>
                
                <div className="p-4 border-t border-border-primary flex justify-end bg-background-secondary">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-background-tertiary text-text-primary rounded-full font-bold hover:bg-background-tertiary-hover uppercase text-xs"
                    >
                        Đóng
                    </button>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </Modal>
    );
};
