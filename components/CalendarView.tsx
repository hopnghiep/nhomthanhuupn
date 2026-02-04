
import React, { useState, useMemo } from 'react';
import { Event } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PlusIcon } from './icons/PlusIcon';

interface CalendarViewProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  isAdminMode: boolean;
  onDayClick: (date: Date) => void;
}

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent, isAdminMode, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach(event => {
      const eventDate = new Date(event.date);
      if (!isNaN(eventDate.getTime())) {
          const dateString = eventDate.toISOString().split('T')[0];
          if (!map.has(dateString)) {
            map.set(dateString, []);
          }
          map.get(dateString)!.push(event);
      }
    });
    return map;
  }, [events]);

  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for days before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ key: `pad-start-${i}`, type: 'padding' });
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      days.push({
        key: `day-${day}`,
        type: 'day',
        date,
        dayNumber: day,
        isToday: isSameDay(date, new Date()),
        events: eventsByDate.get(dateString) || [],
      });
    }

    // Padding for days after the end of the month
    const totalCells = days.length;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
        for (let i = 0; i < remainingCells; i++) {
            days.push({ key: `pad-end-${i}`, type: 'padding' });
        }
    }
    
    return days;
  }, [currentDate, eventsByDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  return (
    <div className="bg-background-secondary p-4 sm:p-6 rounded-xl shadow-xl border border-border-primary">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
            <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-background-tertiary transition-colors border border-border-primary" aria-label="Tháng trước">
                <ChevronLeftIcon className="w-5 h-5 text-text-primary" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary min-w-[150px] text-center">
                {new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(currentDate)}
            </h2>
            <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-background-tertiary transition-colors border border-border-primary" aria-label="Tháng sau">
                <ChevronRightIcon className="w-5 h-5 text-text-primary" />
            </button>
        </div>

        <button 
            onClick={goToToday}
            className="px-4 py-1.5 bg-background-tertiary text-text-primary text-sm font-semibold rounded-full hover:bg-background-tertiary-hover border border-border-primary transition-all"
        >
            Hôm nay
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border-primary border border-border-primary rounded-lg overflow-hidden">
        {WEEKDAYS.map(day => (
            <div key={day} className="bg-background-tertiary py-3 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                {day}
            </div>
        ))}
        
        {calendarGrid.map(cell => {
          if (cell.type === 'padding') {
            return <div key={cell.key} className="bg-background-primary opacity-30 h-24 sm:h-36"></div>;
          }
          
          const { key, date, dayNumber, isToday, events } = cell;
          
          return (
            <div
              key={key}
              className={`h-24 sm:h-36 bg-background-secondary p-1 flex flex-col transition-colors ${
                  isAdminMode ? 'cursor-pointer hover:bg-primary-50' : ''
              }`}
              onClick={() => isAdminMode && onDayClick(date)}
            >
              <div className="flex justify-end mb-1">
                <span className={`flex items-center justify-center text-sm font-bold w-7 h-7 rounded-full ${
                    isToday ? 'bg-primary-600 text-text-accent shadow-sm' : 'text-text-secondary'
                }`}>
                    {dayNumber}
                </span>
              </div>
              
              <div className="flex-grow space-y-1 overflow-y-auto custom-scrollbar">
                {events.map(event => (
                  <button
                    key={event.id}
                    onClick={(e) => { e.stopPropagation(); onSelectEvent(event); }}
                    className="w-full text-left text-[10px] sm:text-xs bg-primary-50 text-primary-700 p-1 rounded-md border border-primary-100 hover:bg-primary-100 transition-colors truncate font-medium flex items-center shadow-sm"
                    title={event.name}
                  >
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-1.5 flex-shrink-0"></div>
                    {event.name}
                  </button>
                ))}
                {isAdminMode && events.length === 0 && (
                    <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <PlusIcon className="w-6 h-6 text-primary-300" />
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
          .custom-scrollbar::-webkit-scrollbar {
              width: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
              background: var(--color-primary-200);
              border-radius: 10px;
          }
      `}</style>
    </div>
  );
};
