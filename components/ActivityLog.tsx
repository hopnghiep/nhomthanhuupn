import React from 'react';
import { Activity } from '../types';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ClockIcon } from './icons/ClockIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';

interface ActivityLogProps {
  activities: Activity[];
}

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} năm trước`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} tháng trước`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} ngày trước`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} giờ trước`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} phút trước`;
  return "Vài giây trước";
};

const ActivityIcon: React.FC<{ type: Activity['type'] }> = ({ type }) => {
  const baseClasses = "w-6 h-6 mr-4 flex-shrink-0";
  switch (type) {
    case 'MEMBER_ADDED':
      return <UserPlusIcon className={`${baseClasses} text-green-500`} />;
    case 'EVENT_CREATED':
      return <CalendarIcon className={`${baseClasses} text-sky-500`} />;
    case 'MEMBER_UPDATED':
    case 'EVENT_UPDATED':
      return <PencilIcon className={`${baseClasses} text-yellow-500`} />;
    case 'MEMBER_DELETED':
    case 'EVENT_DELETED':
      return <TrashIcon className={`${baseClasses} text-red-500`} />;
    case 'BROADCAST_SENT':
        return <MegaphoneIcon className={`${baseClasses} text-purple-500`} />;
    default:
      return null;
  }
};

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-background-tertiary rounded-lg">
        <p className="text-text-secondary">Chưa có hoạt động nào gần đây.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start p-4 bg-background-tertiary rounded-lg">
          <ActivityIcon type={activity.type} />
          <div className="flex-grow">
            <p className="text-text-primary">{activity.description}</p>
            <div className="flex items-center text-xs text-text-secondary mt-1">
                <ClockIcon className="w-3 h-3 mr-1.5" />
                <span>{formatTimeAgo(activity.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};