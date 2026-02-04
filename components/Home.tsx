
import React from 'react';
import { Activity, GroupInfo, MediaItem } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { CameraIcon } from './icons/CameraIcon';
import { ActivityLog } from './ActivityLog';
import { AnimatedHero } from './AnimatedHero';
import { ClipboardCopyButton } from './ClipboardCopyButton';
import { PlayCircleIcon } from './icons/PlayCircleIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { LinkIcon } from './icons/LinkIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
    groupInfo: GroupInfo;
    activityLog: Activity[];
    isAdminMode: boolean;
    onEdit: (field: 'history' | 'mission', currentValue: string, title: string) => void;
    onManageHeroImages: () => void;
    onBroadcast: () => void;
    onManageAnthem: () => void;
    onManageKeyEvents: () => void;
    isWideMode?: boolean;
}

const getYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|shorts\/|v\/)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const getYoutubeWatchUrl = (url: string): string | null => {
    const id = getYoutubeId(url);
    return id ? `https://www.youtube.com/watch?v=${id}` : null;
};


const MediaDisplay: React.FC<{ media: MediaItem }> = ({ media }) => {
    const { t } = useLanguage();
    
    if (media.type === 'youtube') {
        const videoId = getYoutubeId(media.url);
        const thumbnailUrl = media.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '');

        if (thumbnailUrl) {
            return (
                <div className="w-full h-full bg-black rounded-lg overflow-hidden relative group">
                    <img 
                        src={thumbnailUrl} 
                        alt={media.title || "YouTube video"} 
                        className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-70"
                        onError={(e) => {
                            if (videoId && (e.target as HTMLImageElement).src.includes('maxresdefault')) {
                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                            }
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                            onClick={() => {
                                const watchUrl = getYoutubeWatchUrl(media.url);
                                if(watchUrl) window.open(watchUrl, '_blank');
                            }}
                            className="bg-red-600 text-white rounded-full px-6 py-3 flex items-center font-bold shadow-lg transform transition-transform group-hover:scale-105"
                        >
                            <YoutubeIcon className="w-6 h-6 mr-2" />
                            {t('videoManager.watchOnYoutube')}
                        </button>
                    </div>
                </div>
            );
        }
    }

    if (media.type === 'video') {
        return (
            <video className="w-full h-full" controls src={media.url}>
                Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
        );
    }
    
     if (media.type === 'web') {
        return (
             <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
                <LinkIcon className="w-8 h-8 mr-3" />
                Xem video từ liên kết Web
            </a>
        );
    }

    return null;
};


export const Home: React.FC<HomeProps> = ({ groupInfo, activityLog, isAdminMode, onEdit, onManageHeroImages, onBroadcast, onManageAnthem, onManageKeyEvents, isWideMode }) => {
  const { t } = useLanguage();
  const copyableContent = `LỊCH SỬ HÌNH THÀNH - NHÓM THÂN HỮU PHÚ NHUẬN\n----------------------------------------\n${groupInfo.history}\n\nÝ NGHĨA & MỤC TIÊU\n--------------------\n${groupInfo.mission}`;
  
  return (
    <div className={`${isWideMode ? 'max-w-none' : 'max-w-5xl'} mx-auto`}>
      <div className="bg-background-secondary shadow-xl rounded-lg overflow-hidden">
        <div className="relative group">
          <AnimatedHero imageUrls={groupInfo.heroImageUrls} />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-10 flex flex-col items-center justify-end z-20 pointer-events-none">
            <div className="text-center">
                <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl uppercase tracking-tighter mb-2">
                    NHÓM THÂN HỬU PHÚ NHUẬN
                </h1>
                <p className="text-white text-base md:text-lg font-bold opacity-90 drop-shadow-md bg-black bg-opacity-20 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                    Gắn kết - Chia sẻ - Phát triển
                </p>
            </div>
          </div>
          
          {isAdminMode && (
            <>
              <button
                onClick={onManageHeroImages}
                className="absolute top-6 right-6 bg-black bg-opacity-60 text-white py-2.5 px-4 rounded-full flex items-center opacity-0 group-hover:opacity-100 transition-all hover:bg-opacity-80 shadow-lg backdrop-blur-sm z-30"
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                Thay đổi ảnh bìa
              </button>
            </>
          )}
        </div>
        <div className="p-8 space-y-12">
           <div className="flex justify-end">
                <ClipboardCopyButton contentToCopy={copyableContent} />
           </div>
          <section>
             <div className="flex justify-between items-center border-b-2 border-primary-500 pb-2 mb-6">
                <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight text-primary-700">Lịch sử Hình thành</h2>
                {isAdminMode && (
                    <button onClick={() => onEdit('history', groupInfo.history, 'Lịch sử Hình thành')} className="p-2 rounded-full hover:bg-background-tertiary transition-colors" aria-label="Chỉnh sửa">
                        <PencilIcon className="w-5 h-5 text-text-secondary" />
                    </button>
                )}
            </div>
            <p className="text-lg text-text-primary leading-relaxed whitespace-pre-wrap font-medium opacity-90">{groupInfo.history}</p>
          </section>
          
          <section>
            <div className="flex justify-between items-center border-b-2 border-primary-500 pb-2 mb-6">
                <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight text-primary-700">Ý nghĩa & Mục tiêu</h2>
                {isAdminMode && (
                    <button onClick={() => onEdit('mission', groupInfo.mission, 'Ý nghĩa & Mục tiêu')} className="p-2 rounded-full hover:bg-background-tertiary transition-colors" aria-label="Chỉnh sửa">
                        <PencilIcon className="w-5 h-5 text-text-secondary" />
                    </button>
                )}
            </div>
            <p className="text-lg text-text-primary leading-relaxed whitespace-pre-wrap font-medium opacity-90">{groupInfo.mission}</p>
          </section>

          <section>
            <div className="flex justify-between items-center border-b-2 border-primary-500 pb-2 mb-6">
                <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight text-primary-700">Các Sự kiện Quan trọng</h2>
                {isAdminMode && (
                    <button onClick={onManageKeyEvents} className="p-2 rounded-full hover:bg-background-tertiary transition-colors" aria-label="Quản lý sự kiện quan trọng">
                        <PencilIcon className="w-5 h-5 text-text-secondary" />
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groupInfo.keyEvents.map((event, index) => (
                <div key={index} className="bg-background-tertiary p-6 rounded-2xl border border-border-primary hover:border-primary-500 transition-all hover:shadow-md">
                  <h3 className="text-xl font-bold text-primary-700 mb-2">{event.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center border-b-2 border-primary-500 pb-2 mb-6">
                <h2 className="text-3xl font-black text-text-primary flex items-center uppercase tracking-tight text-primary-700">
                    <PlayCircleIcon className="w-8 h-8 mr-3 text-primary-600" />
                    Bài ca Nhóm Thân Hữu
                </h2>
                {isAdminMode && (
                    <button onClick={onManageAnthem} className="p-2 rounded-full hover:bg-background-tertiary transition-colors" aria-label="Chỉnh sửa video">
                        <PencilIcon className="w-5 h-5 text-text-secondary" />
                    </button>
                )}
            </div>
            <div className="aspect-video bg-background-tertiary rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border-4 border-white">
              {groupInfo.groupAnthemMedia ? (
                  <MediaDisplay media={groupInfo.groupAnthemMedia} />
              ) : (
                  <div className="text-center p-4">
                      <PlayCircleIcon className="w-16 h-16 text-text-secondary opacity-50 mb-4 mx-auto" />
                      <p className="text-text-secondary font-bold">Chưa có bài ca nhóm.</p>
                      {isAdminMode && <p className="text-sm text-text-secondary mt-2">Nhấn nút chỉnh sửa để thêm.</p>}
                  </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black text-text-primary border-b-2 border-primary-500 pb-2 mb-6 uppercase tracking-tight text-primary-700">Hoạt động gần đây</h2>
            <ActivityLog activities={activityLog} />
          </section>
        </div>
      </div>
    </div>
  );
};
