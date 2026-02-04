
import React, { useState } from 'react';
import Modal from './Modal';
import { useLanguage } from '../contexts/LanguageContext';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { PencilIcon } from './icons/PencilIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { ClipboardDocumentIcon } from './icons/ClipboardDocumentIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';
import { LinkIcon } from './icons/LinkIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type GuideTab = 'member' | 'admin';

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<GuideTab>('member');

    const memberSteps = [
        {
            icon: <LinkIcon className="w-6 h-6 text-blue-500" />,
            title: t('guide.step1Title'),
            desc: t('guide.step1Desc')
        },
        {
            icon: <UserCircleIcon className="w-6 h-6 text-indigo-500" />,
            title: t('guide.step2Title'),
            desc: t('guide.step2Desc')
        },
        {
            icon: <PencilIcon className="w-6 h-6 text-orange-500" />,
            title: t('guide.step3Title'),
            desc: t('guide.step3Desc')
        },
        {
            icon: <ClipboardDocumentIcon className="w-6 h-6 text-emerald-500" />,
            title: t('guide.step4Title'),
            desc: t('guide.step4Desc')
        },
        {
            icon: <ArrowUpTrayIcon className="w-6 h-6 text-rose-500" />,
            title: t('guide.step5Title'),
            desc: t('guide.step5Desc')
        }
    ];

    const adminSteps = [
        {
            icon: <LockClosedIcon className="w-6 h-6 text-rose-600" />,
            title: t('guide.adminStep1Title'),
            desc: t('guide.adminStep1Desc')
        },
        {
            icon: <PencilIcon className="w-6 h-6 text-blue-600" />,
            title: t('guide.adminStep2Title'),
            desc: t('guide.adminStep2Desc')
        },
        {
            icon: <ClipboardDocumentIcon className="w-6 h-6 text-amber-500" />,
            title: t('guide.adminStep3Title'),
            desc: t('guide.adminStep3Desc')
        },
        {
            icon: <UserGroupIcon className="w-6 h-6 text-indigo-500" />,
            title: t('guide.adminStep4Title'),
            desc: t('guide.adminStep4Desc')
        },
        {
            icon: <ArrowUpTrayIcon className="w-6 h-6 text-teal-600" />,
            title: t('guide.adminStep5Title'),
            desc: t('guide.adminStep5Desc')
        }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('guide.title')}>
            <div className="flex flex-col h-full max-h-[80vh]">
                {/* Tab Switcher */}
                <div className="flex p-1 bg-background-tertiary rounded-xl mx-6 mt-4 border border-border-primary">
                    <button
                        onClick={() => setActiveTab('member')}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'member'
                            ? 'bg-background-secondary text-primary-600 shadow-sm'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <UserCircleIcon className="w-5 h-5 mr-2" />
                        {t('guide.tabMember')}
                    </button>
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'admin'
                            ? 'bg-background-secondary text-primary-600 shadow-sm'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <WrenchIcon className="w-5 h-5 mr-2" />
                        {t('guide.tabAdmin')}
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className={`p-4 rounded-xl mb-6 flex items-start ${activeTab === 'member' ? 'bg-primary-50 border border-primary-100' : 'bg-amber-50 border border-amber-100'}`}>
                        <div className={`p-2 rounded-lg text-white mr-4 shadow-md ${activeTab === 'member' ? 'bg-primary-600' : 'bg-amber-600'}`}>
                            {activeTab === 'member' ? <UserGroupIcon className="w-6 h-6" /> : <MegaphoneIcon className="w-6 h-6" />}
                        </div>
                        <p className={`text-sm font-medium leading-relaxed ${activeTab === 'member' ? 'text-primary-800' : 'text-amber-800'}`}>
                            {activeTab === 'member' ? t('guide.intro') : t('guide.adminIntro')}
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        {(activeTab === 'member' ? memberSteps : adminSteps).map((step, index) => (
                            <div key={index} className="flex items-start bg-background-tertiary p-5 rounded-xl border border-border-primary transition-all hover:border-primary-300 hover:shadow-sm">
                                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-background-secondary border border-border-primary shadow-inner mr-4">
                                    {step.icon}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-text-primary text-lg flex items-center">
                                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded border mr-2 ${activeTab === 'member' ? 'text-primary-600 bg-primary-50 border-primary-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                                            {t('guide.step')} {index + 1}
                                        </span>
                                        {step.title}
                                    </h3>
                                    <p className="text-text-secondary text-sm mt-1 leading-relaxed whitespace-pre-line">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-background-tertiary rounded-xl border border-border-primary text-center">
                        <p className="text-text-secondary text-sm italic">{t('guide.outro')}</p>
                    </div>

                    <div className="mt-8 flex justify-center pb-4">
                        <button 
                            onClick={onClose}
                            className="px-10 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all shadow-lg font-bold transform hover:scale-105 active:scale-95"
                        >
                            {t('guide.gotIt')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
