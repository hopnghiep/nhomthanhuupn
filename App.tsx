
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { MemberList } from './components/MemberList';
import { EventList } from './components/EventList';
import { Member, Event, GroupInfo, Activity, MediaItem, MediaType } from './types';
import { 
  members as initialMembers, 
  guests as initialGuests, 
  events as initialEvents, 
  groupInfo as initialGroupInfo 
} from './data/mockData';
import Modal from './components/Modal';
import SlideOver from './components/SlideOver';
import { generateEventSummary } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import { PencilIcon } from './components/icons/PencilIcon';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { EnvelopeIcon } from './components/icons/EnvelopeIcon';
import { MapPinIcon } from './components/icons/MapPinIcon';
import { PhoneIcon } from './components/icons/PhoneIcon';
import { useTheme } from './contexts/ThemeContext';
import { SettingsPanel } from './components/SettingsPanel';
import { CameraIcon } from './components/icons/CameraIcon';
import { TrashIcon } from './components/icons/TrashIcon';
import { useNotifications } from './hooks/useNotifications';
import { BroadcastModal } from './components/BroadcastModal';
import { BulkAddMemberModal } from './components/BulkAddMemberModal';
import { VideoCameraIcon } from './components/icons/VideoCameraIcon';
import { MusicalNoteIcon } from './components/icons/MusicalNoteIcon';
import { HeroImageManagerModal } from './components/HeroImageManagerModal';
import { Footer } from './components/Footer';
import { SocialLinksManagerModal } from './components/SocialLinksManagerModal';
import { LoginModal } from './components/LoginModal';
import { ArrowPathIcon } from './components/icons/ArrowPathIcon';
import { ClipboardDocumentIcon } from './components/icons/ClipboardDocumentIcon';
import { CheckIcon } from './components/icons/CheckIcon';
import { VideoManagerModal } from './components/VideoManagerModal';
import { PlusIcon } from './components/icons/PlusIcon';
import { YoutubeIcon } from './components/icons/YoutubeIcon';
import { XCircleIcon } from './components/icons/XCircleIcon';
import { useLanguage } from './contexts/LanguageContext';
import { LinkIcon } from './components/icons/LinkIcon';
import { ArrowTopRightOnSquareIcon } from './components/icons/ArrowTopRightOnSquareIcon';
import { ChatBot } from './components/ChatBot';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CalendarIcon } from './components/icons/CalendarIcon';
import { ClipboardCopyButton } from './components/ClipboardCopyButton';
import { GuideModal } from './components/GuideModal';
import { DirectMessagingModal } from './components/DirectMessagingModal';
import { MagnifyingGlassIcon } from './components/icons/MagnifyingGlassIcon';
import { XMarkIcon } from './components/icons/XMarkIcon';
import { KeyEventsManagerModal } from './components/KeyEventsManagerModal';
import { ViberIcon } from './components/icons/ViberIcon';
import { ChatBubbleIcon } from './components/icons/ChatBubbleIcon';
import { ArrowDownTrayIcon } from './components/icons/ArrowDownTrayIcon';
import { fileToBase64, compressImage } from './utils/imageUtils';


type View = 'home' | 'members' | 'guests' | 'events';
type MediaTab = 'images' | 'videos' | 'audios';
type LoginMode = 'user_login' | 'admin_login' | 'admin_setup' | 'admin_change';

interface DataSnapshot {
    members: Member[];
    guests: Member[];
    events: Event[];
    groupInfo: GroupInfo;
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

interface ClearableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    onClear: () => void;
}

const ClearableInput: React.FC<ClearableInputProps> = ({ label, onClear, className, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-text-primary">{label}</label>
        <div className="relative mt-1">
            <input
                className={`block w-full px-3 py-2 pr-10 bg-white text-gray-900 border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${className || ''}`}
                {...props}
            />
            {props.value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
                    tabIndex={-1}
                >
                    <XCircleIcon className="w-5 h-5" />
                </button>
            )}
        </div>
    </div>
);


const App: React.FC = () => {
  const { themeClassName, fontClassName, fontSizeClassName, modeClassName, setTheme } = useTheme();
  const { t } = useLanguage();

  const [currentView, setCurrentView] = useState<View>('home');
  const [isWideMode, setIsWideMode] = useState(() => localStorage.getItem('isWideMode') === 'true');
  
  const [groupInfo, setGroupInfo] = useState<GroupInfo>(() => {
    const saved = localStorage.getItem('phu_nhuan_group_info');
    return saved ? JSON.parse(saved) : initialGroupInfo;
  });
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('phu_nhuan_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });
  const [guests, setGuests] = useState<Member[]>(() => {
    const saved = localStorage.getItem('phu_nhuan_guests');
    return saved ? JSON.parse(saved) : initialGuests;
  });
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('phu_nhuan_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });
  const [activityLog, setActivityLog] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('phu_nhuan_activity_log');
    if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) }));
    }
    return [];
  });

  const [past, setPast] = useState<DataSnapshot[]>([]);
  const [future, setFuture] = useState<DataSnapshot[]>([]);
  const isUndoRedoAction = useRef(false);

  const saveToHistory = useCallback(() => {
      if (isUndoRedoAction.current) return;
      const snapshot: DataSnapshot = {
          members: [...members],
          guests: [...guests],
          events: [...events],
          groupInfo: { ...groupInfo }
      };
      setPast(prev => [...prev, snapshot].slice(-15));
      setFuture([]);
  }, [members, guests, events, groupInfo]);

  const handleUndo = () => {
      if (past.length === 0) return;
      isUndoRedoAction.current = true;
      
      const current: DataSnapshot = { members, guests, events, groupInfo };
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      setFuture(prev => [current, ...prev].slice(0, 15));
      setMembers(previous.members);
      setGuests(previous.guests);
      setEvents(previous.events);
      setGroupInfo(previous.groupInfo);
      setPast(newPast);

      setTimeout(() => { isUndoRedoAction.current = false; }, 0);
  };

  const handleRedo = () => {
      if (future.length === 0) return;
      isUndoRedoAction.current = true;

      const current: DataSnapshot = { members, guests, events, groupInfo };
      const next = future[0];
      const newFuture = future.slice(1);

      setPast(prev => [...prev, current].slice(-15));
      setMembers(next.members);
      setGuests(next.guests);
      setEvents(next.events);
      setGroupInfo(next.groupInfo);
      setFuture(newFuture);

      setTimeout(() => { isUndoRedoAction.current = false; }, 0);
  };

  const safeSetItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        if (e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
            console.error("LocalStorage Quota Exceeded!", e);
            alert("Bộ nhớ trình duyệt đã đầy do lưu quá nhiều ảnh chất lượng cao. Vui lòng xóa bớt một số thành viên hoặc ảnh cũ để tiếp tục.");
        } else {
            console.error("Error saving to LocalStorage", e);
        }
    }
  };

  useEffect(() => { safeSetItem('phu_nhuan_group_info', JSON.stringify(groupInfo)); }, [groupInfo]);
  useEffect(() => { safeSetItem('phu_nhuan_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { safeSetItem('phu_nhuan_guests', JSON.stringify(guests)); }, [guests]);
  useEffect(() => { safeSetItem('phu_nhuan_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { safeSetItem('phu_nhuan_activity_log', JSON.stringify(activityLog)); }, [activityLog]);
  useEffect(() => { safeSetItem('isWideMode', JSON.stringify(isWideMode)); }, [isWideMode]);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormData, setEditingFormData] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<{ title: string; field: 'history' | 'mission'; content: string; } | null>(null);
  const [isBulkAddingOpen, setIsBulkAddingOpen] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isDirectMessagingModalOpen, setIsDirectMessagingModalOpen] = useState(false);
  const [newEventInitialData, setNewEventInitialData] = useState({ name: '', date: '', location: '', description: '', media: [] });
  const [isHeroManagerOpen, setIsHeroManagerOpen] = useState(false);
  const [isSocialLinksManagerOpen, setIsSocialLinksManagerOpen] = useState(false);
  const [isAnthemManagerOpen, setIsAnthemManagerOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isKeyEventsManagerOpen, setIsKeyEventsManagerOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('admin_pwd') || '');
  const [loginMode, setLoginMode] = useState<LoginMode>('user_login');

  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [mediaFilter, setMediaFilter] = useState<string>('all');

  const allUsers = useMemo(() => [...members, ...guests], [members, guests]);

  const isEffectiveAdmin = useMemo(() => {
    return isAdminMode || (currentUser?.isAdmin === true);
  }, [isAdminMode, currentUser]);


  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleteEventConfirmOpen, setIsDeleteEventConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const { permission, requestPermission, showNotification } = useNotifications();
  
  const chatContext = useMemo(() => {
    return `
      Lịch sử nhóm: ${groupInfo.history}
      Sứ mệnh: ${groupInfo.mission}
      Số lượng thành viên: ${members.length}
      Số lượng khách mời: ${guests.length}
      Sự kiện tiêu biểu: ${groupInfo.keyEvents.map(e => e.title).join(', ')}
      Hoạt động gần đây: ${activityLog.map(a => a.description).join('; ')}
    `;
  }, [groupInfo, members, guests, activityLog]);

  useEffect(() => {
    document.documentElement.className = `${themeClassName} ${fontClassName} ${fontSizeClassName} ${modeClassName}`.trim();
  }, [themeClassName, fontClassName, fontSizeClassName, modeClassName]);

  useEffect(() => {
    if (!isEffectiveAdmin) {
      setIsEditing(false);
      setEditingContent(null);
      setIsBulkAddingOpen(false);
      setIsAddingEvent(false);
      setIsAdminDashboardOpen(false);
    }
  }, [isEffectiveAdmin]);

  useEffect(() => {
    if(selectedEvent) {
      setActiveMedia(selectedEvent.media.length > 0 ? selectedEvent.media[0] : null);
      setMediaFilter('all');
      if (!aiSummary || aiSummary === '') {
          handleGenerateSummary(selectedEvent);
      }
    } else {
      setActiveMedia(null);
      setAiSummary('');
    }
  }, [selectedEvent]);

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now(),
      timestamp: new Date(),
    };
    setActivityLog(prev => [newActivity, ...prev].slice(20));
  };
  
    const generateLoginCode = () => {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    const handleLogout = () => {
        if (currentUser) {
            addActivity({ type: 'MEMBER_UPDATED', description: `${currentUser.name} đã đăng xuất.` });
            setCurrentUser(null);
        }
    };

    const handleToggleAdminMode = () => {
        if (isAdminMode) {
            setIsAdminMode(false);
            addActivity({ type: 'MEMBER_UPDATED', description: `Chế độ Admin đã tắt.` });
        } else {
            if (!adminPassword) {
                setLoginMode('admin_setup');
                setIsLoginModalOpen(true);
            } else {
                setLoginMode('admin_login');
                setIsLoginModalOpen(true);
            }
        }
    };

    const handleLoginClick = () => {
        setLoginMode('user_login');
        setIsLoginModalOpen(true);
    }

    const handleLoginSubmit = (inputValue: string) => {
        if (loginMode === 'user_login') {
            const trimmedCode = inputValue.trim().toUpperCase();
            const member = allUsers.find(u => u.loginCode === trimmedCode);
            
            if (member) {
                setCurrentUser(member);
                setIsLoginModalOpen(false);
                showNotification(t('notifications.grantedTitle'));
                addActivity({ type: 'MEMBER_UPDATED', description: `${member.name} đã đăng nhập.` });
            } else {
                alert(t('login.invalidCode'));
            }
            return;
        }

        if (loginMode === 'admin_setup') {
            setAdminPassword(inputValue);
            localStorage.setItem('admin_pwd', inputValue);
            setIsAdminMode(true);
            setIsLoginModalOpen(false);
            showNotification(t('login.passwordCreated'));
            addActivity({ type: 'MEMBER_UPDATED', description: `Mật khẩu Admin đã được tạo và chế độ Admin đã bật.` });
        } else if (loginMode === 'admin_login') {
            if (inputValue === adminPassword) {
                setIsAdminMode(true);
                setIsLoginModalOpen(false);
                addActivity({ type: 'MEMBER_UPDATED', description: `Chế độ Admin đã bật.` });
            } else {
                alert(t('login.passwordWrong'));
            }
        } else if (loginMode === 'admin_change') {
            setAdminPassword(inputValue);
            localStorage.setItem('admin_pwd', inputValue);
            setIsAdminMode(true);
            setIsLoginModalOpen(false);
            showNotification(t('login.passwordChanged'));
            addActivity({ type: 'MEMBER_UPDATED', description: `Mật khẩu Admin đã được thay đổi.` });
        }
    };

    const handleChangePassword = () => {
        setLoginMode('admin_change');
        setIsAdminDashboardOpen(false);
        setIsLoginModalOpen(true);
    };

    const handleGenerateNewCode = (memberId: number) => {
        let newCode: string;
        do {
            newCode = generateLoginCode();
        } while (allUsers.some(u => u.loginCode === newCode));

        saveToHistory();
        const updater = (list: Member[]) => list.map(m => m.id === memberId ? { ...m, loginCode: newCode } : m);
        
        const isMember = members.some(m => m.id === memberId);
        if (isMember) {
            setMembers(updater);
        } else {
            setGuests(updater);
        }
        
        if (selectedMember && selectedMember.id === memberId) {
            setSelectedMember(prev => prev ? { ...prev, loginCode: newCode } : null);
        }
        addActivity({ type: 'MEMBER_UPDATED', description: `Admin đã tạo mã đăng nhập mới.` });
        showNotification(t('common.saveSuccess'));
    };

  const handleGenerateSummary = async (event: Event) => {
    setIsGenerating(true);
    setError('');
    setAiSummary('');
    try {
      const prompt = t('gemini.eventSummaryPrompt', { eventName: event.name, eventDescription: event.description });
      const summary = await generateEventSummary(prompt);
      setAiSummary(summary);
    } catch (err: any) {
      setError(t('error.summary'));
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleOpenContentEditor = (field: 'history' | 'mission', currentValue: string, title: string) => {
    setEditingContent({ field, content: currentValue, title: title });
  };
  
  const handleUpdateGroupInfo = () => {
    if (!editingContent) return;
    saveToHistory();
    setGroupInfo(prev => ({ ...prev, [editingContent.field]: editingContent.content }));
    setEditingContent(null);
    showNotification(t('common.saveSuccess'));
  };
  
  const handleUpdateHeroImages = (newImageUrls: string[]) => {
    saveToHistory();
    setGroupInfo(prev => ({ ...prev, heroImageUrls: newImageUrls }));
    addActivity({ type: 'MEMBER_UPDATED', description: 'Ảnh bìa trang chủ đã được cập nhật.' });
    showNotification(t('common.saveSuccess'));
  };

  const handleUpdateKeyEvents = (newEvents: { title: string; description: string }[]) => {
    saveToHistory();
    setGroupInfo(prev => ({ ...prev, keyEvents: newEvents }));
    addActivity({ type: 'EVENT_UPDATED', description: 'Danh sách các sự kiện quan trọng trang chủ đã được cập nhật.' });
    showNotification(t('common.saveSuccess'));
  };
  
  const handleUpdateSocialLinks = (newLinks: Required<GroupInfo>['socialLinks']) => {
      saveToHistory();
      setGroupInfo(prev => ({...prev, socialLinks: newLinks}));
      addActivity({ type: 'LINKS_UPDATED', description: 'Các liên kết mạng xã hội đã được cập nhật.' });
      showNotification(t('common.saveSuccess'));
  };
  
  const handleUpdateAnthem = (newMedia?: MediaItem) => {
    saveToHistory();
    setGroupInfo(prev => ({ ...prev, groupAnthemMedia: newMedia }));
    addActivity({ type: 'MEMBER_UPDATED', description: 'Bài ca của nhóm đã được cập nhật.' });
    showNotification(t('common.saveSuccess'));
  };

  const exportDataToJSON = (currentMembers: Member[], currentGuests: Member[], currentEvents: Event[], currentGroupInfo: GroupInfo, ownerName?: string) => {
    const themeSettings = JSON.parse(localStorage.getItem('app-theme') || '{}');
    
    // Yêu cầu: Admin xuất là nhomthanhuupn, Member xuất là Tên người sửa
    const finalName = ownerName ? ownerName.trim() : 'nhomthanhuupn';
    
    const fullData = {
        version: "2.5",
        appName: "NHÓM THÂN HỬU PHÚ NHUẬN",
        groupInfo: currentGroupInfo,
        members: currentMembers,
        guests: currentGuests,
        events: currentEvents,
        themeSettings,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    // Định dạng yêu cầu: Tên _ngày-tháng-năm _lúc_18h36.json
    const fileName = `${finalName} _${day}-${month}-${year} _lúc_${hours}h${minutes}.json`;
        
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return fileName;
  };

  const handleManualExport = () => {
    exportDataToJSON(members, guests, events, groupInfo);
    showNotification(t('common.saveSuccess'), { body: "Đã xuất tệp dữ liệu dự phòng." });
  };

  const handleImportTrigger = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                handleImportData(json);
            } catch (err) {
                alert("Lỗi: Tệp không đúng định dạng.");
            }
        };
        reader.readAsText(file);
    };
    input.click();
  };
  
  const handleUpdateMember = (updatedMember: Member) => {
    saveToHistory();
    
    let newMembers = [...members];
    let newGuests = [...guests];
    
    const isMemberInMembers = members.some(m => m.id === updatedMember.id);
    if (isMemberInMembers) {
        newMembers = members.map(m => m.id === updatedMember.id ? updatedMember : m);
        setMembers(newMembers);
    } else {
        newGuests = guests.map(g => g.id === updatedMember.id ? updatedMember : g);
        setGuests(newGuests);
    }

    if (!isAdminMode && currentUser?.id === updatedMember.id) {
        const savedFileName = exportDataToJSON(newMembers, newGuests, events, groupInfo, updatedMember.name);
        setCurrentUser(null);
        addActivity({ type: 'MEMBER_UPDATED', description: `${updatedMember.name} đã hoàn tất tự cập nhật và tải về tệp dữ liệu.` });
        alert(`Thông tin của ${updatedMember.name} đã được cập nhật thành công!\n\nHệ thống đã tự động tải về file: ${savedFileName}\n\nVui lòng gửi file này cho Trưởng nhóm để hoàn tất cập nhật chính thức.`);
    } else if (currentUser?.id === updatedMember.id) {
        setCurrentUser(updatedMember);
    }

    setSelectedMember(updatedMember);
    setIsEditing(false);
    
    if (isAdminMode || currentUser?.id !== updatedMember.id) {
        addActivity({ type: 'MEMBER_UPDATED', description: `Thông tin của ${updatedMember.name} đã được cập nhật.` });
    }
    
    showNotification(t('common.saveSuccess'));
  };

  const handleBulkCreateMembers = (images: string[]) => {
      saveToHistory();
      const isMembersView = currentView === 'members';
      const listName = isMembersView ? t('memberType.member') : t('memberType.guest');

      const newMembers: Member[] = images.map((base64Url, index) => ({
          id: Date.now() + index,
          name: `${listName} ${t('common.new')} ${index + 1}`,
          role: t('common.notUpdated'),
          profession: t('common.notUpdated'),
          description: t('common.updateNeeded'),
          email: `new-member-${Date.now() + index}@example.com`,
          address: t('common.notUpdated'),
          avatarUrl: base64Url,
          activities: [],
          loginCode: generateLoginCode(),
          joinedDate: new Date().toISOString().split('T')[0],
      }));

      if (isMembersView) {
          setMembers(prev => [...newMembers, ...prev]);
      } else {
          setGuests(prev => [...newMembers, ...prev]);
      }

      addActivity({ type: 'MEMBER_ADDED', description: `${t('activity.added')} ${images.length} ${listName} ${t('common.new')}.` });
      setIsBulkAddingOpen(false);
      showNotification(t('common.saveSuccess'));
  };

  const handleDeleteRequest = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!memberToDelete) return;

    saveToHistory();
    addActivity({ type: 'MEMBER_DELETED', description: `Thành viên ${memberToDelete.name} đã bị xóa.` });
    setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
    setGuests(prev => prev.filter(g => g.id !== memberToDelete.id));
    
    if (currentUser?.id === memberToDelete.id) {
        setCurrentUser(null);
    }

    setIsDeleteConfirmOpen(false);
    setMemberToDelete(null);
    setSelectedMember(null);
    showNotification(t('common.saveSuccess'));
  };
  
  const handleUpdateEvent = (updatedEvent: Event) => {
    saveToHistory();
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
    setIsEditing(false);
    addActivity({ type: 'EVENT_UPDATED', description: `Sự kiện "${updatedEvent.name}" đã được cập nhật.` });
    showNotification(t('common.saveSuccess'));
  };

  const handleDeleteEventRequest = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteEventConfirmOpen(true);
  };

  const handleConfirmEventDelete = () => {
    if (!eventToDelete) return;

    saveToHistory();
    addActivity({ type: 'EVENT_DELETED', description: `Sự kiện "${eventToDelete.name}" đã được xóa.` });
    setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));

    setIsDeleteEventConfirmOpen(false);
    setEventToDelete(null);
    setSelectedEvent(null);
    showNotification(t('common.saveSuccess'));
  };
  
  const handleOpenAddEventModal = (initialDate?: Date) => {
      const formattedDate = initialDate
        ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(initialDate)
        : '';
      setNewEventInitialData({ name: '', date: formattedDate, location: '', description: '', media: [] });
      setIsAddingEvent(true);
  };

  const handleCreateEvent = (newEventData: Omit<Event, 'id'>) => {
    saveToHistory();
    const newEvent: Event = {
        id: Date.now(),
        ...newEventData,
        media: newEventData.media.length > 0 ? newEventData.media : [{id: `evt-pl-${Date.now()}`, type: 'image', url: `https://picsum.photos/seed/event${Date.now()}/400/300`}]
    };
    setEvents(prev => [newEvent, ...prev]);
    setIsAddingEvent(false);
    addActivity({ type: 'EVENT_CREATED', description: `Sự kiện "${newEvent.name}" đã được tạo.` });
    showNotification(
        t('notifications.newEventTitle'),
        {
            body: t('notifications.newEventBody', { eventName: newEvent.name }),
            icon: '/logo.png' 
        }
    );
    showNotification(t('common.saveSuccess'));
  };

    const handleReorderMembers = (newMembers: Member[]) => {
        saveToHistory();
        setMembers(newMembers);
        showNotification(t('common.saveSuccess'));
    };

    const handleReorderGuests = (newGuests: Member[]) => {
        saveToHistory();
        setGuests(newGuests);
        showNotification(t('common.saveSuccess'));
    };

    const handleReorderEvents = (newEvents: Event[]) => {
        saveToHistory();
        setEvents(newEvents);
        showNotification(t('common.saveSuccess'));
    };
  
  const handleSendBroadcast = (title: string, message: string) => {
    showNotification(title, { body: message, icon: '/logo.png' });
    addActivity({ type: 'BROADCAST_SENT', description: `Admin đã gửi thông báo: "${title}"` });
    setIsBroadcastModalOpen(false);
  };

  const startEdit = (item: Member | Event) => {
    setEditingFormData({ ...item });
    setIsEditing(true);
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingFormData(null);
  };
  
  const handleFormSubmit = (formData: any, updateFunction: (item: any) => void) => {
    updateFunction(formData);
  }

  const handleImportData = (importedData: any) => {
    try {
        saveToHistory();
        if (importedData.members) setMembers(importedData.members);
        if (importedData.guests) setGuests(importedData.guests);
        if (importedData.events) setEvents(importedData.events);
        if (importedData.groupInfo) setGroupInfo(importedData.groupInfo);
        
        if (importedData.themeSettings) {
            setTheme(importedData.themeSettings);
        }
        
        addActivity({ type: 'MEMBER_UPDATED', description: 'Đã khôi phục toàn bộ dữ liệu & giao diện từ tệp dự phòng.' });
        setIsAdminDashboardOpen(false);
        showNotification(t('common.saveSuccess'), { body: "Tất cả dữ liệu và cấu hình đã được cập nhật." });
    } catch (e) {
        alert("Lỗi khi nhập dữ liệu. Tệp không đúng định dạng.");
    }
  };

  const handleDownloadZoomedImage = () => {
    if (!zoomedImageUrl) return;
    const link = document.createElement('a');
    link.href = zoomedImageUrl;
    link.download = `Hinh_Anh_NhomThanhHuuPN_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const MemberForm = ({ initialData, onSubmit, onCancel, isNew = false }: { initialData: any, onSubmit: (data: any) => void, onCancel: () => void, isNew?: boolean }) => {
    const [formData, setFormData] = useState<Member>({
        ...initialData,
        introImages: initialData.introImages || [],
        personalLinks: initialData.personalLinks || {},
        knowledgeSharing: initialData.knowledgeSharing || {}
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const introImagesInputRef = useRef<HTMLInputElement>(null);
    const [isDraggingImages, setIsDraggingImages] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNestedChange = (parent: 'personalLinks' | 'knowledgeSharing', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...((prev[parent] as any) || {}), [field]: value }
        }));
    };

    const handleClear = (name: string) => {
        setFormData({ ...formData, [name]: '' });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const base64 = await fileToBase64(file);
        const compressed = await compressImage(base64, 600, 0.5);
        setFormData({ ...formData, avatarUrl: compressed });
      }
    };

    const handleIntroImagesUpload = async (files: FileList | null) => {
        if (!files) return;
        const newImages = await Promise.all(Array.from(files).map(async (file) => {
            const b64 = await fileToBase64(file);
            return await compressImage(b64, 800, 0.4);
        }));
        setFormData(prev => ({ ...prev, introImages: [...(prev.introImages || []), ...newImages] }));
    };

    const handleRemoveIntroImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            introImages: (prev.introImages || []).filter((_, i) => i !== index)
        }));
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const b64 = await fileToBase64(blob);
                    const compressed = await compressImage(b64, 800, 0.4);
                    setFormData(prev => ({ ...prev, introImages: [...(prev.introImages || []), compressed] }));
                }
            }
        }
    };

    const handleActivityChange = (index: number, value: string) => {
        const newActivities = [...(formData.activities || [])];
        newActivities[index] = value;
        setFormData({ ...formData, activities: newActivities });
    };

    const handleAddActivity = () => {
        setFormData({ ...formData, activities: [...(formData.activities || []), ''] });
    };

    const handleRemoveActivity = (index: number) => {
        const newActivities = (formData.activities || []).filter((_: string, i: number) => i !== index);
        setFormData({ ...formData, activities: newActivities });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6" onPaste={handlePaste}>
        <div className="flex flex-col items-center space-y-4">
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          <div className="relative group">
            <img src={formData.avatarUrl || 'https://i.pravatar.cc/300?u=none'} alt="Avatar preview" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary-500 shadow-xl" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity">
              <CameraIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          <p className="text-[10px] sm:text-xs text-text-secondary italic">Nhấn vào ảnh để đổi chân dung chính</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ClearableInput name="name" label={t('form.name')} value={formData.name} onChange={handleChange} onClear={() => handleClear('name')} required />
            <ClearableInput name="role" label={t('form.role')} value={formData.role} onChange={handleChange} onClear={() => handleClear('role')} />
            <ClearableInput name="phoneNumber" label="Số điện thoại" value={formData.phoneNumber || ''} onChange={handleChange} onClear={() => handleClear('phoneNumber')} />
            <ClearableInput name="profession" label={t('form.profession')} value={formData.profession} onChange={handleChange} onClear={() => handleClear('profession')} />
            <ClearableInput name="email" label={t('form.email')} type="email" value={formData.email} onChange={handleChange} onClear={() => handleClear('email')} />
            <ClearableInput name="joinedDate" label={t('form.joinedDate')} type="date" value={formData.joinedDate || ''} onChange={handleChange} onClear={() => handleClear('joinedDate')} />
        </div>
        <ClearableInput name="address" label={t('form.address')} value={formData.address} onChange={handleChange} onClear={() => handleClear('address')} />

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-text-primary mb-1 uppercase tracking-tighter">Lời giới thiệu ngắn</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
        </div>

        <div className="border-t border-border-primary pt-4">
            <h4 className="text-sm font-black text-primary-700 uppercase tracking-tighter mb-4 flex items-center">
                <LinkIcon className="w-4 h-4 mr-2" />
                Liên kết hoạt động cá nhân
            </h4>
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">My Web / Blog</label>
                    <input type="text" value={formData.personalLinks?.web || ''} onChange={(e) => handleNestedChange('personalLinks', 'web', e.target.value)} className="w-full px-3 py-2 text-sm border border-border-primary rounded-md outline-none focus:ring-1 focus:ring-primary-500" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">Zalo cá nhân</label>
                    <input type="text" value={formData.personalLinks?.zalo || ''} onChange={(e) => handleNestedChange('personalLinks', 'zalo', e.target.value)} className="w-full px-3 py-2 text-sm border border-border-primary rounded-md outline-none focus:ring-1 focus:ring-primary-500" placeholder="Số ĐT hoặc link..." />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">Viber cá nhân</label>
                    <input type="text" value={formData.personalLinks?.viber || ''} onChange={(e) => handleNestedChange('personalLinks', 'viber', e.target.value)} className="w-full px-3 py-2 text-sm border border-border-primary rounded-md outline-none focus:ring-1 focus:ring-primary-500" placeholder="Số ĐT..." />
                </div>
            </div>
        </div>

        <div className="border-t border-border-primary pt-4">
            <h4 className="text-sm font-black text-primary-700 uppercase tracking-tighter mb-4 flex items-center">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Chia sẻ kiến thức & Hoạt động nhóm
            </h4>
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">Link đăng bài giới thiệu / Kiến thức</label>
                    <input type="text" value={formData.knowledgeSharing?.postLink || ''} onChange={(e) => handleNestedChange('knowledgeSharing', 'postLink', e.target.value)} className="w-full px-3 py-2 text-sm border border-border-primary rounded-md outline-none focus:ring-1 focus:ring-primary-500" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-text-secondary uppercase">Ý kiến cá nhân / Thông tin chia sẻ</label>
                    <textarea value={formData.knowledgeSharing?.opinion || ''} onChange={(e) => handleNestedChange('knowledgeSharing', 'opinion', e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-border-primary rounded-md outline-none focus:ring-1 focus:ring-primary-500" placeholder="Nhập kiến thức hoặc ý kiến bạn muốn chia sẻ với nhóm..." />
                </div>
            </div>
        </div>

        <div className="border-t border-border-primary pt-4">
            <h4 className="text-sm font-black text-primary-700 uppercase tracking-tighter mb-2 flex items-center">
                <CameraIcon className="w-4 h-4 mr-2" />
                Hình ảnh giới thiệu hoạt động (Nhiều ảnh)
            </h4>
            <div 
                onDragOver={(e) => { e.preventDefault(); setIsDraggingImages(true); }}
                onDragLeave={() => setIsDraggingImages(false)}
                onDrop={(e) => { e.preventDefault(); setIsDraggingImages(false); handleIntroImagesUpload(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-all ${isDraggingImages ? 'border-primary-500 bg-primary-50' : 'border-border-primary'}`}
            >
                <input type="file" multiple accept="image/*" onChange={(e) => handleIntroImagesUpload(e.target.files)} className="hidden" id="intro-upload" />
                <div className="flex flex-col items-center">
                    <div className="p-3 bg-primary-100 rounded-full mb-3">
                        <PlusIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="text-sm font-bold text-text-primary">Kéo thả ảnh hoặc DÁN (Paste)</p>
                    <button type="button" onClick={() => (document.getElementById('intro-upload') as HTMLInputElement).click()} className="mt-2 text-[10px] font-black text-primary-700 underline uppercase tracking-widest">Chọn tệp</button>
                </div>
            </div>

            {formData.introImages && formData.introImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {formData.introImages.map((src, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-background-tertiary border border-border-primary">
                            <img 
                                src={src} 
                                alt={`intro-${idx}`} 
                                className="w-full h-full object-cover cursor-pointer hover:opacity-90" 
                                onClick={() => setZoomedImageUrl(src)}
                                title="Click để mở rộng"
                            />
                            <button 
                                type="button" 
                                onClick={() => handleRemoveIntroImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="border-t border-border-primary pt-4 pb-10">
            <label className="block text-sm font-bold text-text-primary mb-2 uppercase tracking-tighter">Hoạt động đã tham gia với nhóm</label>
            <div className="space-y-2">
                {formData.activities && formData.activities.map((activity: string, index: number) => (
                    <div key={index} className="flex gap-2">
                         <input
                            type="text"
                            value={activity}
                            onChange={(e) => handleActivityChange(index, e.target.value)}
                            className="flex-grow px-3 py-2 text-sm border border-border-primary rounded-md outline-none"
                            placeholder="Tên sự kiện / hoạt động..."
                        />
                        <button type="button" onClick={() => handleRemoveActivity(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md flex-shrink-0"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                ))}
                <button type="button" onClick={handleAddActivity} className="flex items-center text-primary-600 hover:text-primary-700 text-xs font-black uppercase tracking-widest mt-2"><PlusIcon className="w-4 h-4 mr-1" />{t('form.addActivity')}</button>
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-border-primary sticky bottom-0 bg-background-secondary py-4 z-10 shadow-inner">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-background-tertiary text-text-primary rounded-full font-bold hover:bg-background-tertiary-hover uppercase text-[10px] sm:text-xs">HỦY BỎ</button>
          <button type="submit" className="px-6 py-2 bg-primary-600 text-text-accent rounded-full hover:bg-primary-700 font-black shadow-lg uppercase text-[10px] sm:text-xs tracking-widest">
            {isNew ? t('form.add') : t('form.updateProfile')}
          </button>
        </div>
      </form>
    );
  };


  const EventForm = ({ initialData, onSubmit, onCancel, isNew = false }: { initialData: any, onSubmit: (data: any) => void, onCancel: () => void, isNew?: boolean }) => {
    const [formData, setFormData] = useState(initialData);
    const [urlInput, setUrlInput] = useState('');
    const [urlError, setUrlError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClear = (name: string) => {
        setFormData({ ...formData, [name]: '' });
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newMedia = await Promise.all(files.map(async (file: File) => {
                const base64 = await fileToBase64(file);
                let type: MediaType = 'image';
                if (file.type.startsWith('video/')) type = 'video';
                if (file.type.startsWith('audio/')) type = 'audio';
                
                let processedUrl = base64;
                if (type === 'image') {
                    processedUrl = await compressImage(base64, 600, 0.4);
                }

                return { id: `media-${Date.now()}-${Math.random()}`, type, url: processedUrl };
            }));
            setFormData({ ...formData, media: [...(formData.media || []), ...newMedia] });
        }
    };

    const handleAddYoutube = () => {
         setUrlError('');
         if (!urlInput.trim()) return;
         const watchUrl = getYoutubeWatchUrl(urlInput);
         if (watchUrl) {
              const newMedia: MediaItem = { id: `yt-${Date.now()}`, type: 'youtube', url: watchUrl };
              setFormData({ ...formData, media: [...(formData.media || []), newMedia] });
              setUrlInput('');
         } else {
             setUrlError(t('form.youtubeInvalid'));
         }
    };
    
    const handleAddWebLink = () => {
         setUrlError('');
         if (!urlInput.trim()) return;
         try {
             new URL(urlInput);
             const newMedia: MediaItem = { id: `web-${Date.now()}`, type: 'web', url: urlInput };
             setFormData({ ...formData, media: [...(formData.media || []), newMedia] });
             setUrlInput('');
         } catch (e) {
             setUrlError(t('form.webInvalid'));
         }
    };

    const removeMedia = (id: string) => {
        setFormData({ ...formData, media: formData.media.filter((m: any) => m.id !== id) });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
             <ClearableInput name="name" label={t('form.eventName')} value={formData.name} onChange={handleChange} onClear={() => handleClear('name')} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ClearableInput name="date" label={t('form.eventDate')} value={formData.date} onChange={handleChange} onClear={() => handleClear('date')} />
                <ClearableInput name="location" label={t('form.location')} value={formData.location} onChange={handleChange} onClear={() => handleClear('location')} />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-primary">{t('form.description')}</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            </div>

            <div className="border-t border-border-primary pt-4">
                <h4 className="font-medium text-text-primary mb-2">{t('form.mediaManager')}</h4>
                
                <div className="flex flex-col gap-2 mb-1">
                    <input 
                        type="text" 
                        value={urlInput}
                        onChange={(e) => { setUrlInput(e.target.value); setUrlError(''); }}
                        placeholder="Link YouTube/Web..."
                        className={`w-full px-3 py-2 bg-white text-gray-900 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${urlError ? 'border-red-500' : 'border-border-primary'}`}
                    />
                    <div className="flex gap-2">
                        <button type="button" onClick={handleAddYoutube} className="flex-1 px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center text-xs font-bold">
                            <YoutubeIcon className="w-4 h-4 mr-1" />
                            YouTube
                        </button>
                         <button type="button" onClick={handleAddWebLink} className="flex-1 px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center text-xs font-bold">
                            <LinkIcon className="w-4 h-4 mr-1" />
                            Web
                        </button>
                    </div>
                </div>
                {urlError && <p className="text-red-500 text-xs mt-1 mb-4">{urlError}</p>}

                <div className="flex items-center mb-4 mt-2">
                    <label htmlFor="media-upload" className="cursor-pointer flex items-center px-4 py-2 bg-background-tertiary text-text-primary rounded-md hover:bg-background-tertiary-hover border border-border-primary text-xs">
                        <CameraIcon className="w-4 h-4 mr-2" />
                        Tải lên tệp
                    </label>
                    <input id="media-upload" type="file" multiple accept="image/*,video/*,audio/*" onChange={handleMediaUpload} className="hidden" />
                </div>

                {formData.media && formData.media.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border border-border-primary rounded-md">
                        {formData.media.map((item: any) => (
                            <div key={item.id} className="relative group aspect-square bg-black rounded-md overflow-hidden">
                                {item.type === 'image' && <img src={item.url} alt="media" className="w-full h-full object-cover" />}
                                {item.type === 'video' && <video src={item.url} className="w-full h-full object-cover" />}
                                {item.type === 'audio' && (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                                        <MusicalNoteIcon className="w-8 h-8" />
                                    </div>
                                )}
                                {item.type === 'youtube' && (
                                     <div className="w-full h-full flex items-center justify-center bg-red-900 text-white">
                                        <YoutubeIcon className="w-8 h-8" />
                                    </div>
                                )}
                                {item.type === 'web' && (
                                     <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white">
                                        <LinkIcon className="w-8 h-8" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeMedia(item.id)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XCircleIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-secondary text-[10px] italic">Chưa có media.</p>
                )}
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-border-primary">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-background-tertiary text-text-primary rounded-md hover:bg-background-tertiary-hover uppercase text-[10px] font-bold">BỎ QUA</button>
                <button type="submit" className="px-6 py-2 bg-primary-600 text-text-accent rounded-full hover:bg-primary-700 font-black shadow-lg uppercase text-[10px] tracking-widest">{isNew ? t('form.add') : t('form.save')}</button>
            </div>
        </form>
    );
  };
  
  const ActiveMediaDisplay: React.FC = () => {
    if (!activeMedia) return null;

    if (activeMedia.type === 'image') {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black relative group">
                <img src={activeMedia.url} alt="Active media" className="max-w-full max-h-[60vh] object-contain shadow-2xl" />
                <button 
                    onClick={() => setZoomedImageUrl(activeMedia.url)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                     <div className="bg-white text-black px-6 py-2 rounded-full font-black shadow-lg flex items-center transform scale-90 group-hover:scale-100 transition-transform uppercase text-xs tracking-widest">
                        <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                        PHÓNG LỚN
                    </div>
                </button>
            </div>
        );
    }
    
    if (activeMedia.type === 'video') {
         return (
            <div className="w-full h-full bg-black flex items-center justify-center relative">
                 <video controls src={activeMedia.url} className="max-w-full max-h-[60vh] shadow-2xl">
                     Trình duyệt của bạn không hỗ trợ thẻ video.
                 </video>
                 <a 
                    href={activeMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full transition-colors z-10"
                    title={t('common.openInNewTab')}
                 >
                     <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                 </a>
            </div>
         );
    }
    
    if (activeMedia.type === 'audio') {
        return (
            <div className="w-full h-64 bg-gray-900 flex flex-col items-center justify-center text-white p-8 rounded-xl shadow-inner">
                 <MusicalNoteIcon className="w-16 h-16 mb-4 text-primary-400 animate-pulse" />
                 <audio controls src={activeMedia.url} className="w-full max-w-md">
                     Trình duyệt của bạn không hỗ trợ thẻ audio.
                 </audio>
            </div>
        );
    }

    if (activeMedia.type === 'youtube') {
        const videoId = getYoutubeId(activeMedia.url);
        const thumbnailUrl = activeMedia.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '');

        return (
             <div className="w-full h-full bg-black flex flex-col items-center justify-center relative group overflow-hidden shadow-2xl">
                 <img 
                    src={thumbnailUrl} 
                    alt="YouTube Video Thumbnail" 
                    className="w-full h-full object-contain opacity-60 group-hover:opacity-50 transition-opacity"
                    onError={(e) => {
                        if (videoId && (e.target as HTMLImageElement).src.includes('maxresdefault')) {
                             (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }
                    }}
                 />
                 
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={() => {
                            const watchUrl = getYoutubeWatchUrl(activeMedia.url);
                            if (watchUrl) window.open(watchUrl, '_blank');
                        }}
                        className="flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    >
                        <div className="bg-red-600 text-white rounded-full p-4 shadow-2xl mb-4 transform group-hover:rotate-6 transition-transform">
                            <YoutubeIcon className="w-10 h-10" />
                        </div>
                        <span className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-full font-black border border-white border-opacity-30 backdrop-blur-md uppercase text-[10px] tracking-[0.2em]">
                            {t('eventDetails.watchOnYoutube')}
                        </span>
                    </button>
                 </div>
            </div>
        );
    }

    return null;
  };

  const copyLoginCode = () => {
      if (selectedMember) {
          navigator.clipboard.writeText(selectedMember.loginCode);
          setCopiedCodeId(selectedMember.id);
          setTimeout(() => setCopiedCodeId(null), 2000);
      }
  }

  const handleCallSelectedMember = () => {
      if (selectedMember?.phoneNumber) {
          window.location.href = `tel:${selectedMember.phoneNumber}`;
      } else {
          alert("Thành viên này chưa có số điện thoại.");
      }
  }

  return (
    <div className="min-h-screen bg-background-primary transition-colors duration-300">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isAdminMode={isAdminMode} 
        isEffectiveAdmin={isEffectiveAdmin}
        onToggleAdminMode={handleToggleAdminMode} 
        onToggleSettings={() => setIsSettingsOpen(true)}
        notificationPermission={permission}
        onNotificationRequest={requestPermission}
        currentUser={currentUser}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogout}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        isWideMode={isWideMode}
        onToggleWideMode={() => setIsWideMode(!isWideMode)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onExportData={handleManualExport}
        onImportData={handleImportTrigger}
      />

      <main className={`${isWideMode ? 'max-w-none w-full px-2 lg:px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} py-8`}>
        {currentView === 'home' && (
          <Home 
            groupInfo={groupInfo} 
            activityLog={activityLog} 
            isAdminMode={isEffectiveAdmin}
            onEdit={handleOpenContentEditor}
            onManageHeroImages={() => setIsHeroManagerOpen(true)}
            onBroadcast={() => setIsDirectMessagingModalOpen(true)}
            onManageAnthem={() => setIsAnthemManagerOpen(true)}
            onManageKeyEvents={() => setIsKeyEventsManagerOpen(true)}
            isWideMode={isWideMode}
          />
        )}
        
        {currentView === 'members' && (
          <MemberList 
            title={t('members.title')}
            members={members} 
            onSelectMember={setSelectedMember} 
            isAdminMode={isEffectiveAdmin}
            onAddNew={() => setIsBulkAddingOpen(true)}
            onDeleteMember={handleDeleteRequest}
            websiteUrl={groupInfo.socialLinks?.website}
            currentUser={currentUser}
            onReorder={handleReorderMembers}
            onLoginClick={handleLoginClick}
            isWideMode={isWideMode}
          />
        )}
        
        {currentView === 'guests' && (
          <MemberList 
            title={t('guests.title')}
            members={guests} 
            onSelectMember={setSelectedMember} 
            isAdminMode={isEffectiveAdmin}
            onAddNew={() => setIsBulkAddingOpen(true)}
            onDeleteMember={handleDeleteRequest}
            websiteUrl={groupInfo.socialLinks?.website}
            currentUser={currentUser}
            onReorder={handleReorderGuests}
            onLoginClick={handleLoginClick}
            isWideMode={isWideMode}
          />
        )}
        
        {currentView === 'events' && (
          <EventList 
            events={events} 
            onSelectEvent={setSelectedEvent} 
            onEditEvent={startEdit}
            isAdminMode={isEffectiveAdmin}
            onAddNew={handleOpenAddEventModal}
            onDeleteEvent={handleDeleteEventRequest}
            onReorder={handleReorderEvents}
            isWideMode={isWideMode}
          />
        )}
      </main>

      <Footer groupInfo={groupInfo} isAdminMode={isEffectiveAdmin} onManageSocialLinks={() => setIsSocialLinksManagerOpen(true)} />

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <ChatBot contextData={chatContext} />
      
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <AdminDashboardModal 
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        members={members}
        guests={guests}
        events={events}
        groupInfo={groupInfo}
        onChangePassword={handleChangePassword}
        onImportData={handleImportData}
      />
      
      <DirectMessagingModal 
        isOpen={isDirectMessagingModalOpen}
        onClose={() => setIsDirectMessagingModalOpen(false)}
        allMembers={allUsers}
      />
      
      <KeyEventsManagerModal
        isOpen={isKeyEventsManagerOpen}
        onClose={() => setIsKeyEventsManagerOpen(false)}
        events={groupInfo.keyEvents}
        onSave={handleUpdateKeyEvents}
      />
      
      {zoomedImageUrl && (
          <div 
            className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
            onClick={() => setZoomedImageUrl(null)}
          >
              <div className="absolute top-6 right-6 flex space-x-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownloadZoomedImage(); }}
                    className="p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full text-white transition-all shadow-xl flex items-center justify-center"
                    title="Tải ảnh này về máy"
                  >
                      <ArrowDownTrayIcon className="w-8 h-8" />
                  </button>
                  <button 
                    className="p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full text-white transition-all shadow-xl flex items-center justify-center"
                    onClick={() => setZoomedImageUrl(null)}
                  >
                      <XMarkIcon className="w-8 h-8" />
                  </button>
              </div>
              <img 
                src={zoomedImageUrl} 
                alt="Zoomed" 
                className="max-w-full max-h-full object-contain shadow-2xl animate-zoom-in"
              />
          </div>
      )}

      {selectedMember && (
        <SlideOver isOpen={!!selectedMember && !isEditing} onClose={() => setSelectedMember(null)} title={selectedMember.name}>
          <div className="p-4 sm:p-8 space-y-8 sm:space-y-10">
            <div 
                className="relative group/zoom cursor-zoom-in overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-background-tertiary mx-auto max-w-sm"
                onClick={() => setZoomedImageUrl(selectedMember.avatarUrl)}
                title="Nhấn để xem ảnh phóng lớn toàn màn hình"
            >
                <img 
                    className="w-full h-auto aspect-[3/4] object-cover transition-transform duration-500 group-hover/zoom:scale-110" 
                    src={selectedMember.avatarUrl} 
                    alt={selectedMember.name} 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/zoom:bg-opacity-20 transition-all flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 p-2 rounded-full shadow-lg opacity-0 group-hover/zoom:opacity-100 transition-all transform translate-y-4 group-hover/zoom:translate-y-0">
                        <MagnifyingGlassIcon className="w-6 h-6 text-primary-600" />
                    </div>
                </div>
            </div>

            <div className="text-center space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-4xl font-black text-text-primary uppercase tracking-tighter leading-tight sm:leading-none">{selectedMember.name}</h3>
                <div className="flex flex-wrap justify-center gap-2">
                    <span className="bg-primary-600 text-white text-[10px] sm:text-xs font-black px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">{selectedMember.role}</span>
                    {selectedMember.joinedDate && (
                        <span className="bg-background-tertiary text-text-secondary text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-widest border border-border-primary">
                            Ngày tham gia: {new Date(selectedMember.joinedDate).toLocaleDateString('vi-VN')}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <button
                    onClick={handleCallSelectedMember}
                    className="flex items-center justify-center px-6 py-3 sm:py-4 bg-green-600 text-white rounded-xl sm:rounded-2xl font-black hover:bg-green-700 transition-all shadow-lg animate-pulse uppercase tracking-widest text-xs sm:text-sm"
                >
                    <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                    GỌI ĐIỆN NGAY
                </button>
                
                <div className="flex justify-center gap-4">
                     {selectedMember.personalLinks?.web && (
                         <button onClick={() => window.open(selectedMember.personalLinks?.web, '_blank')} className="p-3 sm:p-4 bg-indigo-100 text-indigo-700 rounded-xl sm:rounded-2xl hover:bg-indigo-200 transition-all shadow-sm border border-indigo-200" title="Website cá nhân">
                            <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                         </button>
                     )}
                     {selectedMember.personalLinks?.zalo && (
                         <button onClick={() => {
                            const cleanZalo = selectedMember.personalLinks?.zalo?.replace(/\s+/g, '');
                            const url = cleanZalo?.startsWith('http') ? cleanZalo : `https://zalo.me/${cleanZalo}`;
                            window.open(url, '_blank');
                         }} className="p-3 sm:p-4 bg-blue-100 text-blue-700 rounded-xl sm:rounded-2xl hover:bg-blue-200 transition-all shadow-sm border border-blue-200" title="Zalo cá nhân">
                            <ChatBubbleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                         </button>
                     )}
                     {selectedMember.personalLinks?.viber && (
                         <button onClick={() => {
                            const cleanViber = selectedMember.personalLinks?.viber?.replace(/\s+/g, '');
                            const viberNumber = cleanViber?.startsWith('0') ? '84' + cleanViber.substring(1) : cleanViber;
                            window.location.href = `viber://chat?number=${viberNumber}`;
                         }} className="p-3 sm:p-4 bg-purple-100 text-purple-700 rounded-xl sm:rounded-2xl hover:bg-purple-200 transition-all shadow-sm border border-purple-200" title="Viber cá nhân">
                            <ViberIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                         </button>
                     )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-background-tertiary p-4 rounded-xl sm:rounded-2xl border border-border-primary shadow-sm">
                    <p className="text-[9px] sm:text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Nghề nghiệp</p>
                    <div className="flex items-center">
                        <BriefcaseIcon className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" />
                        <span className="font-bold text-sm sm:text-base text-text-primary break-words">{selectedMember.profession || t('common.notUpdated')}</span>
                    </div>
                </div>
                 <div className="bg-background-tertiary p-4 rounded-xl sm:rounded-2xl border border-border-primary shadow-sm overflow-hidden">
                    <p className="text-[9px] sm:text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Email liên hệ</p>
                    <div className="flex items-center overflow-hidden">
                        <EnvelopeIcon className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" />
                        <a href={`mailto:${selectedMember.email}`} className="font-bold text-sm sm:text-base text-text-primary hover:underline break-all leading-tight">{selectedMember.email}</a>
                    </div>
                </div>
            </div>

            {(selectedMember.knowledgeSharing?.postLink || selectedMember.knowledgeSharing?.opinion) && (
                <section className="bg-emerald-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-100 space-y-4">
                     <h4 className="text-xs sm:text-sm font-black text-emerald-800 uppercase tracking-widest flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-3 text-emerald-600" />
                        Chia sẻ từ thành viên
                    </h4>
                    {selectedMember.knowledgeSharing.opinion && (
                        <p className="text-emerald-900 text-base sm:text-lg font-medium leading-relaxed italic">"{selectedMember.knowledgeSharing.opinion}"</p>
                    )}
                    {selectedMember.knowledgeSharing.postLink && (
                        <button 
                            onClick={() => window.open(selectedMember.knowledgeSharing?.postLink, '_blank')}
                            className="w-full sm:w-auto flex items-center justify-center text-[10px] font-black text-white bg-emerald-600 px-6 py-2.5 rounded-full uppercase tracking-widest hover:bg-emerald-700 shadow-md"
                        >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                            XEM BÀI VIẾT
                        </button>
                    )}
                </section>
            )}
            
            <section className="bg-primary-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-primary-100 space-y-4">
                <h4 className="text-xs sm:text-sm font-black text-primary-800 uppercase tracking-widest flex items-center">
                    <InfoIcon className="w-5 h-5 mr-3 text-primary-600" />
                    Lời tự giới thiệu
                </h4>
                <p className="text-text-primary leading-relaxed whitespace-pre-line text-base sm:text-lg font-medium italic opacity-90">"{selectedMember.description}"</p>
            </section>

            {selectedMember.introImages && selectedMember.introImages.length > 0 && (
                <section className="space-y-4">
                     <h4 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest flex items-center">
                        <CameraIcon className="w-5 h-5 text-primary-600 mr-3" />
                        Hình ảnh hoạt động
                     </h4>
                     <div className="grid grid-cols-2 gap-3 sm:gap-4">
                         {selectedMember.introImages.map((src, idx) => (
                             <div key={idx} className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-md border-2 border-white cursor-pointer hover:shadow-xl transition-all" onClick={() => setZoomedImageUrl(src)}>
                                 <img src={src} alt={`Intro ${idx}`} className="w-full h-full object-cover" />
                             </div>
                         ))}
                     </div>
                </section>
            )}

            <section className="space-y-4">
                 <h4 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest flex items-center">
                    <CalendarIcon className="w-5 h-5 text-primary-600 mr-3" />
                    Hoạt động đồng hành
                 </h4>
                 {selectedMember.activities && selectedMember.activities.length > 0 ? (
                    <div className="flex flex-col space-y-2">
                        {selectedMember.activities.map((activity, index) => (
                            <div key={index} className="bg-white border border-border-primary p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold text-text-primary shadow-sm flex items-center">
                                <div className="w-2 h-2 bg-primary-500 rounded-full mr-4 flex-shrink-0"></div>
                                {activity}
                            </div>
                        ))}
                    </div>
                 ) : (
                     <p className="text-text-secondary italic text-xs sm:text-sm opacity-60">Chưa có thông tin hoạt động cụ thể.</p>
                 )}
            </section>

            {isEffectiveAdmin && (
                <section className="bg-background-tertiary p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border-primary space-y-4">
                    <h4 className="text-[10px] sm:text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Cài đặt bảo mật (Admin)</h4>
                    <div className="flex items-center justify-between bg-background-primary p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border-primary shadow-inner">
                        <div className="overflow-hidden">
                            <p className="text-[9px] sm:text-[10px] font-black text-text-secondary uppercase mb-1">Mã đăng nhập</p>
                            <code className="text-primary-600 font-mono text-lg sm:text-xl tracking-widest font-bold break-all">{selectedMember.loginCode}</code>
                        </div>
                        <button onClick={copyLoginCode} className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm hover:bg-primary-50 transition-colors text-primary-600 flex-shrink-0 ml-2" title={t('memberDetails.copyCode')}>
                            {copiedCodeId === selectedMember.id ? <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500"/> : <ClipboardDocumentIcon className="w-5 h-5 sm:w-6 sm:h-6"/>}
                        </button>
                    </div>
                    <button 
                        onClick={() => handleGenerateNewCode(selectedMember.id)}
                        className="w-full flex items-center justify-center text-[10px] font-black text-text-secondary hover:text-primary-600 transition-colors py-2 uppercase tracking-widest"
                    >
                        <ArrowPathIcon className="w-4 h-4 mr-2" />
                        {t('memberDetails.generateNewCode')}
                    </button>
                </section>
            )}
            
            {(isEffectiveAdmin || (currentUser?.id === selectedMember.id)) && (
              <div className="pt-6 sm:pt-10 flex flex-col sm:flex-row gap-3 border-t border-border-primary">
                  {isEffectiveAdmin && (
                    <button 
                      onClick={() => handleDeleteRequest(selectedMember)}
                      className="flex-1 py-3 sm:py-4 bg-red-50 text-red-600 rounded-xl sm:rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center font-black uppercase text-[10px] sm:text-xs tracking-widest border border-red-100"
                    >
                      <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                      Xóa thành viên
                    </button>
                  )}
                <button 
                  onClick={() => startEdit(selectedMember)}
                  className="flex-[2] py-3 sm:py-4 bg-primary-600 text-text-accent rounded-xl sm:rounded-2xl hover:bg-primary-700 transition-colors flex items-center justify-center shadow-xl font-black uppercase text-[10px] sm:text-xs tracking-[0.2em]"
                >
                  <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                  {currentUser?.id === selectedMember.id ? t('memberCard.editProfile') : t('edit')}
                </button>
              </div>
            )}
            <div className="h-10 sm:h-20"></div>
          </div>
        </SlideOver>
      )}

      {selectedEvent && (
        <Modal isOpen={!!selectedEvent && !isEditing} onClose={() => setSelectedEvent(null)} title={selectedEvent.name}>
            <div className="flex flex-col bg-background-primary min-h-full">
                <div className="relative h-56 sm:h-80 overflow-hidden">
                    <img 
                        src={selectedEvent.media.find(m => m.type === 'image')?.url || 'https://picsum.photos/seed/placeholder/800/400'} 
                        alt={selectedEvent.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-8">
                        <div className="flex flex-col space-y-2">
                             <div className="flex items-center space-x-2">
                                <span className="bg-primary-600 text-white text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">SỰ KIỆN</span>
                                <span className="bg-white/20 backdrop-blur-md text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full border border-white/30">{selectedEvent.date}</span>
                             </div>
                             <h3 className="text-xl sm:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-2xl leading-tight">
                                {selectedEvent.name}
                             </h3>
                             <div className="flex items-center text-white/90 text-xs sm:text-sm font-bold">
                                <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary-400" />
                                <span>{selectedEvent.location}</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-8 space-y-8 sm:space-y-10">
                    <div className="relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 shadow-2xl overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative z-10 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-between mb-4 sm:mb-6">
                                <h4 className="text-white text-xs sm:text-sm font-black uppercase tracking-[0.2em] flex items-center">
                                    <SparklesIcon className="w-5 h-5 mr-3 text-yellow-300 animate-bounce" />
                                    {t('eventDetails.aiSummaryTitle')}
                                </h4>
                            </div>

                            <div className="min-h-[80px] sm:min-h-[100px] flex items-center justify-center">
                                {isGenerating ? (
                                    <div className="space-y-3 w-full">
                                        <div className="h-3 bg-white/10 rounded-full w-3/4 animate-pulse mx-auto sm:mx-0"></div>
                                        <div className="h-3 bg-white/10 rounded-full w-full animate-pulse delay-75 mx-auto sm:mx-0"></div>
                                        <div className="h-3 bg-white/10 rounded-full w-5/6 animate-pulse delay-150 mx-auto sm:mx-0"></div>
                                    </div>
                                ) : aiSummary ? (
                                    <p className="text-white text-base sm:text-xl font-medium leading-relaxed italic drop-shadow-sm whitespace-pre-wrap animate-fade-in">
                                        "{aiSummary}"
                                    </p>
                                ) : error ? (
                                    <p className="text-red-200 text-xs sm:text-sm font-bold bg-red-900/30 p-3 rounded-xl border border-red-500/30 w-full text-center">{error}</p>
                                ) : (
                                    <button 
                                        onClick={() => handleGenerateSummary(selectedEvent)}
                                        className="bg-white text-primary-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-black shadow-xl hover:bg-primary-50 transition-all transform hover:scale-105 active:scale-95 uppercase text-[10px] sm:text-xs tracking-widest"
                                    >
                                        TẠO TÓM TẮT NGAY
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <section className="space-y-4">
                        <div className="flex items-center space-x-3 border-b-2 border-primary-500 pb-2 mb-2">
                            <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                            <h4 className="text-lg sm:text-xl font-black text-text-primary uppercase tracking-tighter">Mô tả Chi tiết</h4>
                        </div>
                        <p className="text-base sm:text-lg text-text-primary leading-relaxed whitespace-pre-line font-medium opacity-90 p-4 bg-background-tertiary rounded-xl sm:rounded-2xl border border-border-primary shadow-sm">
                            {selectedEvent.description}
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-primary-500 pb-2">
                             <div className="flex items-center space-x-3">
                                <VideoCameraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                                <h4 className="text-lg sm:text-xl font-black text-text-primary uppercase tracking-tighter">Media Hoạt động</h4>
                            </div>
                            
                            <div className="flex items-center bg-background-tertiary p-1 rounded-full border border-border-primary text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                {['all', 'image', 'video', 'youtube'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setMediaFilter(type)}
                                        className={`px-3 sm:px-4 py-1.5 rounded-full transition-all ${
                                            mediaFilter === type 
                                            ? 'bg-primary-600 text-white shadow-md' 
                                            : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                    >
                                        {type === 'all' ? 'Hết' : (type === 'image' ? 'Ảnh' : (type === 'video' ? 'Clip' : 'YT'))}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {selectedEvent.media
                                .filter(m => mediaFilter === 'all' || m.type === mediaFilter)
                                .map((media) => (
                                <div 
                                    key={media.id} 
                                    className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary-500"
                                    onClick={() => setActiveMedia(media)}
                                >
                                    {media.type === 'image' && (
                                        <img src={media.url} alt="Event" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    )}
                                    {media.type === 'video' && (
                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                            <VideoCameraIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white/50" />
                                        </div>
                                    )}
                                    {media.type === 'youtube' && (
                                        <div className="w-full h-full bg-red-900/20 relative">
                                            <img src={`https://img.youtube.com/vi/${getYoutubeId(media.url)}/hqdefault.jpg`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <YoutubeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                         <MagnifyingGlassIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-md" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {activeMedia && (
                             <div className="mt-8 p-1.5 sm:p-2 bg-background-tertiary rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white shadow-2xl overflow-hidden animate-zoom-in">
                                <div className="flex justify-between items-center p-3 sm:p-4 bg-background-secondary rounded-t-xl sm:rounded-t-2xl border-b border-border-primary">
                                    <h5 className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-primary-700">Đang xem</h5>
                                    <button onClick={() => setActiveMedia(null)} className="p-1 rounded-full hover:bg-background-tertiary text-text-secondary">
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="aspect-video">
                                    <ActiveMediaDisplay />
                                </div>
                             </div>
                        )}
                    </section>
                </div>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-border-primary flex flex-col sm:flex-row justify-end gap-3 bg-background-secondary sticky bottom-0 z-10">
                <button 
                  onClick={() => startEdit(selectedEvent)}
                  className="px-6 py-2 bg-background-tertiary text-text-primary rounded-full hover:bg-background-tertiary-hover transition-all font-bold uppercase text-[9px] sm:text-[10px] tracking-widest border border-border-primary w-full sm:w-auto"
                >
                  <PencilIcon className="w-4 h-4 mr-2 inline" />
                  Sửa nội dung
                </button>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="px-8 sm:px-10 py-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all shadow-lg font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em] transform active:scale-95 w-full sm:w-auto"
                >
                  ĐÓNG LẠI
                </button>
            </div>
        </Modal>
      )}

      <SlideOver isOpen={isEditing && currentView !== 'events'} onClose={cancelEdit} title={editingFormData?.id ? t('modal.edit', { name: editingFormData.name }) : (currentView === 'guests' ? t('modal.addGuest') : t('modal.addMember'))}>
          <MemberForm 
            initialData={editingFormData || { name: '', role: '', profession: '', description: '', email: '', phoneNumber: '', address: '', avatarUrl: '', activities: [], introImages: [], personalLinks: {}, knowledgeSharing: {} }} 
            onSubmit={(data) => handleFormSubmit(data, handleUpdateMember)} 
            onCancel={cancelEdit}
            isNew={!editingFormData?.id}
          />
      </SlideOver>

      <Modal isOpen={isEditing && currentView === 'events'} onClose={cancelEdit} title={t('modal.addEvent')}>
          <EventForm 
            initialData={editingFormData || newEventInitialData} 
            onSubmit={(data) => handleFormSubmit(data, editingFormData?.id ? handleUpdateEvent : handleCreateEvent)} 
            onCancel={cancelEdit} 
            isNew={!editingFormData?.id}
          />
      </Modal>
      
      <Modal isOpen={!!editingContent} onClose={() => setEditingContent(null)} title={t('modal.editContent', { title: editingContent?.title })}>
        <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-primary-50 p-3 rounded-lg border border-primary-200 mb-2">
                <p className="text-[10px] sm:text-xs text-primary-700 font-bold">💡 Bạn có thể nhấn Enter để xuống dòng. Nhấn nút OK khi hoàn tất nhập nội dung.</p>
            </div>
            <textarea
                value={editingContent?.content || ''}
                onChange={(e) => setEditingContent(prev => prev ? { ...prev, content: e.target.value } : null)}
                rows={10}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-border-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm sm:text-base"
                placeholder="Nhập nội dung tại đây..."
            />
            <div className="flex justify-end space-x-3 sm:space-x-4">
                <button onClick={() => setEditingContent(null)} className="px-5 sm:px-6 py-2 bg-background-tertiary text-text-primary rounded-full hover:bg-background-tertiary-hover uppercase text-[10px] sm:text-xs font-black">HỦY BỎ</button>
                <button onClick={handleUpdateGroupInfo} className="px-8 sm:px-10 py-2 bg-primary-600 text-text-accent rounded-full hover:bg-primary-700 uppercase text-[10px] sm:text-xs font-black shadow-lg">OK (XÁC NHẬN)</button>
            </div>
        </div>
      </Modal>

      <BulkAddMemberModal 
        isOpen={isBulkAddingOpen} 
        onClose={() => setIsBulkAddingOpen(false)} 
        onAdd={handleBulkCreateMembers}
        memberType={currentView === 'members' ? 'Thành viên' : 'Khách mời'}
      />
      
      <HeroImageManagerModal
        isOpen={isHeroManagerOpen}
        onClose={() => setIsHeroManagerOpen(false)}
        images={groupInfo.heroImageUrls}
        onSave={handleUpdateHeroImages}
      />
      
      <SocialLinksManagerModal
        isOpen={isSocialLinksManagerOpen}
        onClose={() => setIsSocialLinksManagerOpen(false)}
        links={groupInfo.socialLinks || {}}
        onSave={handleUpdateSocialLinks}
      />
      
      <VideoManagerModal
        isOpen={isAnthemManagerOpen}
        onClose={() => setIsAnthemManagerOpen(false)}
        initialMedia={groupInfo.groupAnthemMedia}
        onSave={handleUpdateAnthem}
      />

      <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title={t('confirm.deleteTitle')}>
        <div className="p-6 space-y-4">
            <p className="text-text-primary text-sm sm:text-base">{t('confirm.deleteMember', { name: memberToDelete?.name })}</p>
            <div className="flex justify-end space-x-4">
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 bg-background-tertiary text-text-primary rounded-md hover:bg-background-tertiary-hover font-bold text-xs sm:text-sm">Hủy</button>
                <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-bold text-xs sm:text-sm">Xác nhận Xóa</button>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteEventConfirmOpen} onClose={() => setIsDeleteEventConfirmOpen(false)} title={t('confirm.deleteEventTitle')}>
        <div className="p-6 space-y-4">
            <p className="text-text-primary text-sm sm:text-base">{t('confirm.deleteEvent', { name: eventToDelete?.name })}</p>
            <div className="flex justify-end space-x-4">
                <button onClick={() => setIsDeleteEventConfirmOpen(false)} className="px-4 py-2 bg-background-tertiary text-text-primary rounded-md hover:bg-background-tertiary-hover font-bold text-xs sm:text-sm">Hủy</button>
                <button onClick={handleConfirmEventDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-bold text-xs sm:text-sm">Xác nhận Xóa</button>
            </div>
        </div>
      </Modal>
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onPasswordSubmit={handleLoginSubmit}
        mode={loginMode}
      />
      
      {isAddingEvent && (
          <Modal isOpen={isAddingEvent} onClose={() => setIsAddingEvent(false)} title={t('modal.addEvent')}>
             <EventForm 
                initialData={newEventInitialData} 
                onSubmit={handleCreateEvent} 
                onCancel={() => setIsAddingEvent(false)} 
                isNew={true}
            />
          </Modal>
      )}
      
      <style>{`
          .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
          .animate-zoom-in { animation: zoomIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default App;
