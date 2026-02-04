
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface KeyEvent {
    title: string;
    description: string;
}

interface KeyEventsManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: KeyEvent[];
    onSave: (newEvents: KeyEvent[]) => void;
}

export const KeyEventsManagerModal: React.FC<KeyEventsManagerModalProps> = ({ isOpen, onClose, events, onSave }) => {
    const [currentEvents, setCurrentEvents] = useState<KeyEvent[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<KeyEvent>({ title: '', description: '' });

    useEffect(() => {
        if (isOpen) {
            setCurrentEvents([...events]);
            setEditingIndex(null);
            setEditForm({ title: '', description: '' });
        }
    }, [isOpen, events]);

    const handleAdd = () => {
        setEditingIndex(-1); // -1 means adding new
        setEditForm({ title: '', description: '' });
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditForm({ ...currentEvents[index] });
    };

    const handleRemove = (index: number) => {
        setCurrentEvents(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingIndex === -1) {
            setCurrentEvents(prev => [...prev, editForm]);
        } else if (editingIndex !== null) {
            const newList = [...currentEvents];
            newList[editingIndex] = editForm;
            setCurrentEvents(newList);
        }
        setEditingIndex(null);
    };

    const handleFinalSave = () => {
        onSave(currentEvents);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Quản lý Sự kiện Quan trọng">
            <div className="p-6 space-y-6">
                {editingIndex !== null ? (
                    <form onSubmit={handleSaveForm} className="space-y-4 bg-background-tertiary p-4 rounded-xl border border-primary-200">
                        <h4 className="font-black text-primary-700 uppercase text-xs">{editingIndex === -1 ? 'Thêm sự kiện mới' : 'Sửa sự kiện'}</h4>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Tiêu đề</label>
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="VD: Ngày thành lập..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Mô tả ngắn</label>
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                required
                                rows={3}
                                className="w-full px-3 py-2 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Mô tả tóm tắt ý nghĩa sự kiện..."
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                            <button type="button" onClick={() => setEditingIndex(null)} className="px-4 py-2 text-sm font-bold text-text-secondary">Hủy</button>
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-sm font-black rounded-lg">Cập nhật vào danh sách</button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {currentEvents.length === 0 ? (
                                <p className="text-center text-text-secondary italic py-8">Chưa có sự kiện quan trọng nào được thiết lập.</p>
                            ) : (
                                currentEvents.map((ev, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-background-tertiary rounded-xl border border-border-primary group">
                                        <div className="flex-grow pr-4">
                                            <p className="font-bold text-text-primary">{ev.title}</p>
                                            <p className="text-xs text-text-secondary line-clamp-1">{ev.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <button onClick={() => handleEdit(idx)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><PencilIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleRemove(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button 
                            onClick={handleAdd}
                            className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-600 font-bold flex items-center justify-center hover:bg-primary-50 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" /> Thêm sự kiện quan trọng
                        </button>
                    </div>
                )}

                <div className="flex justify-end space-x-4 pt-4 border-t border-border-primary">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-background-tertiary text-text-primary rounded-full font-bold hover:bg-background-tertiary-hover">Hủy</button>
                    <button onClick={handleFinalSave} className="px-8 py-2 bg-primary-600 text-white rounded-full font-black shadow-lg">LƯU THAY ĐỔI</button>
                </div>
            </div>
        </Modal>
    );
};
