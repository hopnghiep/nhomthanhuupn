

import React, { useState } from 'react';
import Modal from './Modal';
import { XCircleIcon } from './icons/XCircleIcon';

interface BroadcastModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (title: string, message: string) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ isOpen, onClose, onSend }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && message.trim()) {
            onSend(title.trim(), message.trim());
            setTitle('');
            setMessage('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gửi thông báo chung">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label htmlFor="broadcast-title" className="block text-sm font-medium text-text-primary">Tiêu đề</label>
                    <div className="relative mt-1">
                        <input
                            type="text"
                            name="broadcast-title"
                            id="broadcast-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="block w-full px-3 py-2 pr-10 bg-white text-gray-900 border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="VD: Nhắc nhở quan trọng"
                        />
                         {title && (
                            <button
                                type="button"
                                onClick={() => setTitle('')}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
                                tabIndex={-1}
                            >
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="broadcast-message" className="block text-sm font-medium text-text-primary">Nội dung</label>
                    <textarea
                        name="broadcast-message"
                        id="broadcast-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Nhập nội dung thông báo của bạn tại đây..."
                    />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-background-tertiary text-text-primary rounded-md hover:bg-background-tertiary-hover">
                        Hủy
                    </button>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-text-accent rounded-md hover:bg-primary-700">
                        Gửi thông báo
                    </button>
                </div>
            </form>
        </Modal>
    );
};
