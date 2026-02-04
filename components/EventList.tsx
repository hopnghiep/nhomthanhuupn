
import React, { useState, useMemo } from 'react';
import { Event } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { CalendarView } from './CalendarView';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { MusicalNoteIcon } from './icons/MusicalNoteIcon';
import { ClipboardCopyButton } from './ClipboardCopyButton';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { ArrowsUpDownIcon } from './icons/ArrowsUpDownIcon';
import { useLanguage } from '../contexts/LanguageContext';


interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
  onEdit: (event: Event) => void;
  isAdminMode: boolean;
  onDelete: (event: Event) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, id: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetId: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSelect, onEdit, isAdminMode, onDelete, draggable, onDragStart, onDragOver, onDrop }) => {
  const firstImage = useMemo(() => event.media.find(m => m.type === 'image')?.url, [event.media]);
  const hasYoutube = useMemo(() => event.media.some(m => m.type === 'youtube'), [event.media]);
  const hasVideo = useMemo(() => event.media.some(m => m.type === 'video'), [event.media]);
  const hasAudio = useMemo(() => event.media.some(m => m.type === 'audio'), [event.media]);
  const otherImages = useMemo(() => event.media.filter(m => m.type === 'image').slice(1, 4), [event.media]);


  return (
  <div 
    className={`bg-background-secondary rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 ease-in-out hover:shadow-2xl relative group/card ${draggable ? 'cursor-move' : 'hover:scale-[1.03]'}`}
    draggable={draggable}
    onDragStart={(e) => onDragStart && onDragStart(e, event.id)}
    onDragOver={onDragOver}
    onDrop={(e) => onDrop && onDrop(e, event.id)}
  >
    {isAdminMode && (
        <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(event); }}
                className="p-2 rounded-full bg-background-secondary bg-opacity-70 text-primary-600 hover:bg-primary-50 shadow-md"
                aria-label={`Sửa sự kiện ${event.name}`}
            >
                <PencilIcon className="w-5 h-5" />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(event); }}
                className="p-2 rounded-full bg-background-secondary bg-opacity-70 text-red-500 hover:bg-red-50 shadow-md"
                aria-label={`Xóa sự kiện ${event.name}`}
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    )}
    <div className="relative">
      <img className="w-full h-48 object-cover pointer-events-none" src={firstImage || 'https://picsum.photos/seed/placeholder/400/300'} alt={event.name} />
      <div className="absolute bottom-2 right-2 flex items-center space-x-2">
        {hasYoutube && (
          <div className="bg-red-600 bg-opacity-80 text-white rounded-full p-1.5 flex items-center" title="Có video YouTube">
            <YoutubeIcon className="w-4 h-4" />
          </div>
        )}
        {hasVideo && (
          <div className="bg-black bg-opacity-60 text-white rounded-full p-1.5 flex items-center" title="Có video">
            <VideoCameraIcon className="w-4 h-4" />
          </div>
        )}
        {hasAudio && (
          <div className="bg-black bg-opacity-60 text-white rounded-full p-1.5 flex items-center" title="Có audio">
            <MusicalNoteIcon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-text-primary leading-tight min-h-[3rem] mb-1">{event.name}</h3>
      <p className="text-text-secondary text-sm mb-1">{event.date}</p>
      <div className="flex items-center text-text-secondary text-sm mb-4">
        <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="truncate">{event.location}</span>
      </div>
      
      <div className="border-t border-border-primary pt-4 mt-2 mb-4 space-y-4">
        <div>
            <h4 className="text-xs font-bold uppercase text-text-secondary mb-2">Mô tả chi tiết</h4>
            <p className="text-text-primary whitespace-pre-wrap text-sm leading-relaxed line-clamp-3">{event.description}</p>
        </div>
      
        {otherImages.length > 0 && (
          <div>
              <h4 className="text-xs font-bold uppercase text-text-secondary mb-2">Hình ảnh khác</h4>
              <div className="grid grid-cols-3 gap-2">
                  {otherImages.map((img) => (
                      <img key={img.id} src={img.url} alt={`${event.name} thumbnail`} className="w-full h-20 object-cover rounded-md shadow-sm pointer-events-none" />
                  ))}
              </div>
          </div>
        )}
      </div>


      <button 
        onClick={() => onSelect(event)}
        className="mt-auto w-full px-4 py-2 bg-primary-600 text-text-accent font-semibold rounded-md hover:bg-primary-700 transition-colors"
      >
        Xem chi tiết & Tóm tắt AI
      </button>
    </div>
  </div>
  );
}

interface EventListProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  isAdminMode: boolean;
  onAddNew: (initialDate?: Date) => void;
  onDeleteEvent: (event: Event) => void;
  onReorder: (events: Event[]) => void;
  onEditEvent: (event: Event) => void;
  isWideMode?: boolean;
}

type SortOption = 'manual' | 'dateNewest' | 'dateOldest' | 'nameAsc' | 'nameDesc';

export const EventList: React.FC<EventListProps> = ({ events, onSelectEvent, isAdminMode, onAddNew, onDeleteEvent, onReorder, onEditEvent, isWideMode }) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [sortOption, setSortOption] = useState<SortOption>('manual');

  const copyableContent = "DANH SÁCH SỰ KIỆN & HOẠT ĐỘNG\n---------------------------------\n" + 
    events.map(e => `Sự kiện: ${e.name}\nNgày: ${e.date}\nĐịa điểm: ${e.location}`).join('\n\n');

  const sortedEvents = useMemo(() => {
    let sorted = [...events];
    switch (sortOption) {
        case 'dateNewest':
            sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            break;
        case 'dateOldest':
            sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            break;
        case 'nameAsc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nameDesc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'manual':
        default:
            break;
    }
    return sorted;
  }, [events, sortOption]);

    // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
      e.dataTransfer.setData('text/plain', id.toString());
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
      e.preventDefault();
      const sourceId = parseInt(e.dataTransfer.getData('text/plain'), 10);
      
      if (sourceId === targetId) return;

      const sourceIndex = events.findIndex(e => e.id === sourceId);
      const targetIndex = events.findIndex(e => e.id === targetId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
          const newEvents = [...events];
          const [movedEvent] = newEvents.splice(sourceIndex, 1);
          newEvents.splice(targetIndex, 0, movedEvent);
          onReorder(newEvents);
      }
  };

  return (
    <div className={`${isWideMode ? 'max-w-none' : 'max-w-6xl'} mx-auto`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-text-primary">Sự kiện & Hoạt động</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             {/* Sort Dropdown - Only visible in List Mode */}
             {viewMode === 'list' && (
                <div className="flex items-center bg-background-tertiary rounded-md px-3 py-2 w-full sm:w-auto">
                    <ArrowsUpDownIcon className="w-5 h-5 text-text-secondary mr-2" />
                    <span className="text-sm text-text-secondary mr-2 hidden sm:inline">{t('sort.sortBy')}</span>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                        className="bg-transparent text-sm font-medium text-text-primary focus:outline-none cursor-pointer flex-grow"
                    >
                        <option value="manual">{t('sort.manual')}</option>
                        <option value="dateNewest">{t('sort.dateNewest')}</option>
                        <option value="dateOldest">{t('sort.dateOldest')}</option>
                        <option value="nameAsc">{t('sort.nameAsc')}</option>
                        <option value="nameDesc">{t('sort.nameDesc')}</option>
                    </select>
                </div>
             )}

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {viewMode === 'list' && <ClipboardCopyButton contentToCopy={copyableContent} />}
            <div className="bg-background-tertiary p-1 rounded-lg flex items-center">
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-background-secondary shadow-sm text-primary-600' : 'text-text-secondary'}`}
                    aria-label="List view"
                >
                    <ListBulletIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-background-secondary shadow-sm text-primary-600' : 'text-text-secondary'}`}
                    aria-label="Calendar view"
                >
                    <CalendarDaysIcon className="w-5 h-5" />
                </button>
            </div>
            {isAdminMode && (
                <button
                onClick={() => onAddNew()}
                className="flex items-center px-4 py-2 bg-primary-600 text-text-accent rounded-md hover:bg-primary-700 transition-colors duration-200 ml-2 whitespace-nowrap"
                >
                <PlusIcon className="w-5 h-5 mr-2" />
                Thêm mới
                </button>
            )}
          </div>
        </div>
      </div>

      <div className="transition-all duration-300">
        {viewMode === 'list' ? (
            <div className={`grid grid-cols-1 ${isWideMode ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8 animate-fade-in`}>
                {sortedEvents.map(event => (
                <EventCard 
                    key={event.id} 
                    event={event} 
                    onSelect={onSelectEvent} 
                    onEdit={onEditEvent}
                    isAdminMode={isAdminMode} 
                    onDelete={onDeleteEvent}
                    draggable={isAdminMode && sortOption === 'manual'}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                />
                ))}
            </div>
        ) : (
            <div className="animate-fade-in">
                <CalendarView 
                    events={events} 
                    onSelectEvent={onSelectEvent} 
                    isAdminMode={isAdminMode} 
                    onDayClick={onAddNew} 
                />
            </div>
        )}
      </div>
      <style>{`
          .animate-fade-in {
              animation: fadeIn 0.4s ease-out forwards;
          }
          @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
          }
      `}</style>
    </div>
  );
};
