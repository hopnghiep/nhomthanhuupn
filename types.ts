
export type MediaType = 'youtube' | 'video' | 'audio' | 'image' | 'web';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  title?: string;
  thumbnailUrl?: string;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  description: string;
  profession: string;
  email: string;
  phoneNumber?: string;
  address: string;
  avatarUrl: string;
  activities: string[];
  loginCode: string;
  isAdmin?: boolean;
  joinedDate?: string;
  // Các trường mới được thêm vào
  introImages?: string[];
  personalLinks?: {
    web?: string;
    zalo?: string;
    viber?: string;
  };
  knowledgeSharing?: {
    postLink?: string;
    opinion?: string;
  };
}

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  media: MediaItem[];
}

export interface GroupInfo {
    history: string;
    mission: string;
    keyEvents: { title: string; description: string }[];
    heroImageUrls: string[];
    groupAnthemMedia?: MediaItem;
    broadcastUrl?: string;
    socialLinks?: {
        facebook?: string;
        zalo?: string;
        website?: string;
        viber?: string;
    };
}

export interface Activity {
  id: number;
  type: 'MEMBER_ADDED' | 'EVENT_CREATED' | 'MEMBER_UPDATED' | 'EVENT_UPDATED' | 'MEMBER_DELETED' | 'EVENT_DELETED' | 'BROADCAST_SENT' | 'LINKS_UPDATED';
  description: string;
  timestamp: Date;
}
