

import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';
import { LinkIcon } from './icons/LinkIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { CameraIcon } from './icons/CameraIcon';
import { MediaItem, MediaType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AnthemManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMedia: MediaItem | undefined;
    onSave: (newMedia: MediaItem | undefined) => void;
}

type SourceType = 'youtube' | 'web' | 'upload';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const getYoutubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|shorts\/|v\/)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    // Return the original watch URL for consistency, the renderer will handle it.
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
};

const getYoutubeId = (url: string): string | null => {
     if (!url) return null;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|shorts\/|v\/)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export const VideoManagerModal: React.FC<AnthemManagerModalProps> = ({ isOpen, onClose, initialMedia, onSave }) => {
    const { t } = useLanguage();
    const [activeSource, setActiveSource] = useState<SourceType>('youtube');
    const [mediaItem, setMediaItem] = useState<MediaItem | undefined>(initialMedia);
    const [urlInput, setUrlInput] = useState('');
    const [customThumbnail, setCustomThumbnail] = useState<string | undefined>(undefined);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMediaItem(initialMedia);
            setCustomThumbnail(initialMedia?.thumbnailUrl);

            if (initialMedia?.type === 'youtube' || initialMedia?.type === 'web') {
                setActiveSource(initialMedia.type);
                setUrlInput(initialMedia.url);
            } else if (initialMedia?.type === 'video') {
                setActiveSource('upload');
                setUrlInput('');
            } else {
                setActiveSource('youtube');
                setUrlInput('');
            }
        }
    }, [isOpen, initialMedia]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setMediaItem({ id: `vid-${Date.now()}`, type: 'video', url: base64, title: file.name });
            setUrlInput('');
            setCustomThumbnail(undefined);
        }
    };
    
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrlInput(newUrl);
        
        if (activeSource === 'youtube') {
            const ytUrl = getYoutubeEmbedUrl(newUrl);
            if (ytUrl) {
                // If we don't have a custom thumbnail yet, set the default YT one
                const videoId = getYoutubeId(newUrl);
                const defaultThumb = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined;
                setMediaItem({ 
                    id: `yt-${Date.now()}`, 
                    type: 'youtube', 
                    url: ytUrl, 
                    title: 'YouTube Video'
                });
                if (!customThumbnail && defaultThumb) {
                   // We don't strictly set customThumbnail here, we let the render logic fallback to YT default
                   // unless the user uploads one.
                }
            }
        } else if (activeSource === 'web') {
            setMediaItem({ id: `web-${Date.now()}`, type: 'web', url: newUrl, title: 'Web Video' });
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setCustomThumbnail(base64);
        }
    };

    const handleResetThumbnail = () => {
        setCustomThumbnail(undefined);
    };

    const handleSave = () => {
        if (mediaItem) {
            const updatedMedia = {
                ...mediaItem,
                thumbnailUrl: customThumbnail
            };
            onSave(updatedMedia);
        } else {
            onSave(undefined);
        }
        onClose();
    };

    const SourceButton = ({ type, label, icon }: { type: SourceType, label: string, icon: React.ReactNode }) => (
        <button
            type="button"
            onClick={() => { setActiveSource(type); setUrlInput(''); setMediaItem(undefined); setCustomThumbnail(undefined); }}
            className={`flex-1 flex items-center justify-center p-3 text-sm font-medium border-b-2 transition-colors ${
                activeSource === type
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-text-secondary hover:bg-background-tertiary'
            }`}
        >
            {icon}
            <span className="ml-2">{label}</span>
        </button>
    );

    const renderPreview = () => {
        if (!mediaItem) return null;

        if (activeSource === 'youtube' && mediaItem.type === 'youtube') {
            const videoId = getYoutubeId(mediaItem.url);
            const displayThumbnail = customThumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '');

            if (videoId) {
                return (
                    <div className="mt-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-text-primary mb-2">{t('videoManager.preview')}:</p>
                                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-md relative group">
                                     <img 
                                        src={displayThumbnail} 
                                        alt="Thumbnail" 
                                        className="w-full h-full object-cover opacity-80"
                                        onError={(e) => {
                                            // Fallback to high quality if maxres doesn't exist
                                            if (videoId && (e.target as HTMLImageElement).src.includes('maxresdefault')) {
                                                 (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                            }
                                        }}
                                     />
                                     <div className="absolute inset-0 flex items-center justify-center">
                                         <button 
                                            className="bg-red-600 text-white rounded-full p-3 flex items-center shadow-lg hover:scale-110 transition-transform"
                                            onClick={() => window.open(mediaItem.url, '_blank')}
                                            title={t('videoManager.watchOnYoutube')}
                                         >
                                            <YoutubeIcon className="w-8 h-8" />
                                         </button>
                                     </div>
                                </div>
                            </div>
                            
                            <div className="w-full sm:w-1/3 space-y-3">
                                <p className="text-sm font-medium text-text-primary">{t('videoManager.customThumbnail')}:</p>
                                <input
                                    type="file"
                                    ref={thumbnailInputRef}
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => thumbnailInputRef.current?.click()}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-background-tertiary text-text-primary rounded-md hover:bg-background-tertiary-hover border border-border-primary text-sm"
                                >
                                    <CameraIcon className="w-4 h-4 mr-2" />
                                    {t('videoManager.uploadThumbnail')}
                                </button>
                                {customThumbnail && (
                                     <button
                                        onClick={handleResetThumbnail}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 border border-transparent text-sm"
                                    >
                                        {t('videoManager.useDefaultThumbnail')}
                                    </button>
                                )}
                                <p className="text-xs text-text-secondary">
                                    Bạn có thể tải lên một hình ảnh khác để làm nền cho video này.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        
        // Basic feedback for Web URL
        if (activeSource === 'web' && mediaItem.type === 'web') {
             return (
                <div className="mt-4 p-4 bg-background-tertiary rounded-lg border border-border-primary">
                    <p className="text-sm font-medium text-text-primary mb-1">Đã nhận liên kết:</p>
                    <a href={mediaItem.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline break-all text-sm flex items-center">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        {mediaItem.url}
                    </a>
                </div>
            );
        }

        return null;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('videoManager.title')}>
            <div className="p-6 space-y-6">
                <div className="border-b border-border-primary flex">
                    <SourceButton type="youtube" label="YouTube" icon={<YoutubeIcon className="w-5 h-5" />} />
                    <SourceButton type="web" label="Web URL" icon={<LinkIcon className="w-5 h-5" />} />
                    <SourceButton type="upload" label={t('videoManager.upload')} icon={<ArrowUpTrayIcon className="w-5 h-5" />} />
                </div>
                
                <div>
                    {activeSource === 'youtube' && (
                         <input
                            type="text"
                            value={urlInput}
                            onChange={handleUrlChange}
                            className="w-full px-3 py-2 bg-white text-gray-900 border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder={t('videoManager.youtubeUrl')}
                            autoFocus
                        />
                    )}
                     {activeSource === 'web' && (
                         <input
                            type="text"
                            value={urlInput}
                            onChange={handleUrlChange}
                            className="w-full px-3 py-2 bg-white text-gray-900 border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder={t('videoManager.webUrl')}
                            autoFocus
                        />
                    )}
                    {activeSource === 'upload' && (
                        <div>
                            <input
                                type="file"
                                id="video-upload"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="video-upload" className="w-full flex items-center justify-center px-4 py-3 bg-background-tertiary text-text-primary rounded-md hover:bg-background-tertiary-hover border border-border-primary cursor-pointer">
                                <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                                {mediaItem?.title || t('videoManager.upload')}
                            </label>
                        </div>
                    )}

                    {renderPreview()}
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-border-primary">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-background-tertiary text-text-primary rounded-md hover:bg-background-tertiary-hover">
                        {t('form.cancel')}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSave} 
                        className="px-4 py-2 bg-primary-600 text-text-accent rounded-md hover:bg-primary-700"
                    >
                        {t('videoManager.save')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
