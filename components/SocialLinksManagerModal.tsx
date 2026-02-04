

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { GroupInfo } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';

interface SocialLinksManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    links: NonNullable<GroupInfo['socialLinks']>;
    onSave: (newLinks: NonNullable<GroupInfo['socialLinks']>) => void;
}

export const SocialLinksManagerModal: React.FC<SocialLinksManagerModalProps> = ({ isOpen, onClose, links, onSave }) => {
    const [formData, setFormData] = useState(links);

    useEffect(() => {
        setFormData(links);
    }, [links, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleClear = (name: string) => {
        setFormData(prev => ({ ...prev, [name]: '' }));
    };

    const ClearableInput = ({ name, label, placeholder, value }: { name: string, label: string, placeholder: string, value: string }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-text-primary">{label}</label>
            <div className="relative mt-1">
                <input
                    type="text"
                    name={name}
                    id={name}
                    value={value || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pr-10 bg-white text-gray-900 border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder={placeholder}
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => handleClear(name)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
                        tabIndex={-1}
                    >
                        <XCircleIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Quản lý Liên kết Mạng xã hội & Website">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <ClearableInput name="facebook" label="URL Facebook" placeholder="https://facebook.com/yourgroup" value={formData.facebook || ''} />
                <ClearableInput name="zalo" label="URL Zalo" placeholder="https://zalo.me/yourgroup" value={formData.zalo || ''} />
                <ClearableInput name="viber" label="URL Viber" placeholder="https://viber.com/yourgroup" value={formData.viber || ''} />
                <ClearableInput name="website" label="URL Website" placeholder="https://yourwebsite.com" value={formData.website || ''} />
                
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-background-tertiary text-text-primary rounded-md hover:bg-background-tertiary-hover">
                        Hủy
                    </button>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-text-accent rounded-md hover:bg-primary-700">
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </Modal>
    );
};
