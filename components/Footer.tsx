import React from 'react';
import { GroupInfo } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { LinkIcon } from './icons/LinkIcon';
import { ViberIcon } from './icons/ViberIcon';

interface FooterProps {
    groupInfo: GroupInfo;
    isAdminMode: boolean;
    onManageSocialLinks: () => void;
}

const SocialLink: React.FC<{ href?: string; 'aria-label': string; children: React.ReactNode }> = ({ href, 'aria-label': ariaLabel, children }) => {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className="text-text-secondary hover:text-primary-500 transition-colors"
        >
            {children}
        </a>
    );
};

export const Footer: React.FC<FooterProps> = ({ groupInfo, isAdminMode, onManageSocialLinks }) => {
    const { socialLinks = {} } = groupInfo;

    return (
        <footer className="bg-background-secondary border-t border-border-primary mt-8">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <p className="text-sm text-text-secondary">
                    &copy; {new Date().getFullYear()} Nhóm Thân Hữu Phú Nhuận. All rights reserved.
                </p>
                <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-6">
                        <SocialLink href={socialLinks.facebook} aria-label="Facebook">
                            <FacebookIcon className="w-6 h-6" />
                        </SocialLink>
                        <SocialLink href={socialLinks.zalo} aria-label="Zalo">
                            <ChatBubbleIcon className="w-6 h-6" />
                        </SocialLink>
                        <SocialLink href={socialLinks.viber} aria-label="Viber">
                            <ViberIcon className="w-6 h-6" />
                        </SocialLink>
                        <SocialLink href={socialLinks.website} aria-label="Website">
                            <LinkIcon className="w-6 h-6" />
                        </SocialLink>
                    </div>
                    {isAdminMode && (
                        <button
                            onClick={onManageSocialLinks}
                            className="flex items-center text-sm text-text-secondary hover:text-primary-600 transition-colors ml-4"
                            aria-label="Chỉnh sửa liên kết mạng xã hội"
                        >
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
};