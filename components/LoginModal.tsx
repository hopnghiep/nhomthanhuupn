

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPasswordSubmit: (input: string) => void;
    title?: string;
    mode: 'user_login' | 'admin_login' | 'admin_setup' | 'admin_change';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onPasswordSubmit, title, mode }) => {
    const { t } = useLanguage();
    const [inputValue, setInputValue] = useState('');
    const [confirmInputValue, setConfirmInputValue] = useState('');
    const [error, setError] = useState('');

    // Clear input when modal opens or mode changes
    useEffect(() => {
        if (isOpen) {
            setInputValue('');
            setConfirmInputValue('');
            setError('');
        }
    }, [isOpen, mode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (mode === 'admin_setup' || mode === 'admin_change') {
            if (inputValue !== confirmInputValue) {
                setError(t('login.passwordMismatch'));
                return;
            }
        }
        
        if (!inputValue.trim()) {
            return;
        }

        onPasswordSubmit(inputValue);
        // We do not clear inputs immediately here, parent handles closing/clearing on success
    };

    const getTitle = () => {
        if (title) return title;
        switch (mode) {
            case 'admin_setup': return t('login.createPassword');
            case 'admin_change': return t('login.changePassword');
            case 'admin_login': return t('login.titleAdmin');
            case 'user_login': return t('login.title');
            default: return t('login.title');
        }
    }

    const isUserMode = mode === 'user_login';
    const Icon = isUserMode ? UserCircleIcon : LockClosedIcon;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
            <form onSubmit={handleSubmit} className="p-8 flex flex-col items-center space-y-6">
                
                <div className={`p-4 rounded-full ${isUserMode ? 'bg-indigo-50' : 'bg-primary-50'}`}>
                    <Icon className={`w-12 h-12 ${isUserMode ? 'text-indigo-600' : 'text-primary-600'}`} />
                </div>
                
                <div className="text-center">
                    {mode === 'admin_setup' && (
                        <p className="text-text-secondary text-sm mb-4">
                            {t('login.setupPrompt')}
                        </p>
                    )}
                    {mode === 'user_login' && (
                         <p className="text-text-secondary text-sm mb-4">
                            {t('login.userPrompt')}
                        </p>
                    )}
                </div>

                <div className="w-full space-y-4">
                    <div>
                        <input
                            type={isUserMode ? "text" : "password"}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={
                                mode === 'user_login' ? t('login.codePlaceholder') :
                                (mode === 'admin_setup' || mode === 'admin_change' ? t('login.newPassword') : t('login.enterPassword'))
                            }
                            className="w-full px-4 py-3 bg-white text-gray-900 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                            autoFocus
                        />
                    </div>
                    
                    {(mode === 'admin_setup' || mode === 'admin_change') && (
                        <div>
                             <input
                                type="password"
                                value={confirmInputValue}
                                onChange={(e) => setConfirmInputValue(e.target.value)}
                                placeholder={t('login.confirmPassword')}
                                className="w-full px-4 py-3 bg-white text-gray-900 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                            />
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-red-600 font-medium text-sm">
                        {error}
                    </p>
                )}

                <div className="flex w-full space-x-4">
                     <button 
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-background-tertiary text-text-primary rounded-lg hover:bg-background-tertiary-hover transition-colors"
                    >
                        {t('form.cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={!inputValue}
                        className="flex-1 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mode === 'admin_change' || mode === 'admin_setup' ? t('videoManager.save') : t('login.cta')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
