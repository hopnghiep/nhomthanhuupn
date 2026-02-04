
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Member } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ShareIcon } from './icons/ShareIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ClipboardCopyButton } from './ClipboardCopyButton';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ArrowsUpDownIcon } from './icons/ArrowsUpDownIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { ViberIcon } from './icons/ViberIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface MemberCardProps {
  member: Member;
  onSelect: (member: Member) => void;
  isAdminMode: boolean;
  onDelete: (member: Member) => void;
  websiteUrl?: string;
  currentUser: Member | null;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, id: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetId: number) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onSelect, isAdminMode, onDelete, websiteUrl, currentUser, draggable, onDragStart, onDragOver, onDrop }) => {
  const { t } = useLanguage();
  const isShareSupported = typeof navigator.share === 'function';
  const isCurrentUser = currentUser?.id === member.id;

  const cleanPhoneNumber = member.phoneNumber?.replace(/\s+/g, '') || '';

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isShareSupported) {
      try {
        const shareData: { title: string; text: string; url?: string } = {
          title: 'Giới thiệu thành viên Nhóm Thân Hữu Phú Nhuận',
          text: `Gặp gỡ ${member.name}, ${member.role} của Nhóm Thân Hữu Phú Nhuận.`,
        };
        
        if (websiteUrl) {
            shareData.url = websiteUrl;
        }

        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (member.phoneNumber) {
        window.location.href = `tel:${cleanPhoneNumber}`;
    } else {
        alert("Thành viên này chưa cập nhật số điện thoại.");
    }
  };

  const handleZalo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (member.phoneNumber) {
        window.open(`https://zalo.me/${cleanPhoneNumber}`, '_blank');
    } else {
        alert("Thành viên này chưa cập nhật số điện thoại.");
    }
  };

  const handleViber = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (member.phoneNumber) {
        const viberNumber = cleanPhoneNumber.startsWith('0') ? '84' + cleanPhoneNumber.substring(1) : cleanPhoneNumber;
        window.location.href = `viber://chat?number=${viberNumber}`;
    } else {
        alert("Thành viên này chưa cập nhật số điện thoại.");
    }
  };
  
  const actionButtonClasses = isCurrentUser
    ? "flex-grow px-4 py-2 bg-primary-600 text-text-accent font-black rounded-full text-sm hover:bg-primary-700 transition-colors uppercase tracking-tight shadow-md"
    : "flex-grow px-4 py-2 bg-primary-100 text-primary-700 font-black rounded-full text-sm hover:bg-primary-200 transition-colors uppercase tracking-tight shadow-sm";

  return (
    <div 
        className={`bg-background-secondary rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 flex flex-col relative group/card ${draggable ? 'cursor-move hover:shadow-xl' : 'hover:-translate-y-1 hover:shadow-2xl'}`}
        draggable={draggable}
        onDragStart={(e) => onDragStart && onDragStart(e, member.id)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop && onDrop(e, member.id)}
    >
      {isAdminMode && (
          <button
              onClick={(e) => { e.stopPropagation(); onDelete(member); }}
              className="absolute top-2 right-2 p-2 rounded-full bg-background-secondary bg-opacity-50 text-red-500 hover:bg-red-100 opacity-0 group-hover/card:opacity-100 transition-opacity z-10"
              aria-label={`Xóa ${member.name}`}
          >
              <TrashIcon className="w-5 h-5" />
          </button>
      )}
      <div className="p-6 flex flex-col items-center text-center flex-grow">
        <div className="flex-grow w-full">
          {/* Ảnh có thể click để xem chi tiết */}
          <div 
            className="relative group/avatar cursor-pointer mb-4 inline-block"
            onClick={() => onSelect(member)}
            title="Nhấn để xem chi tiết & phóng lớn ảnh"
          >
            <img 
              className="w-28 h-28 rounded-full object-cover border-4 border-background-tertiary mx-auto shadow-md transition-transform duration-300 group-hover/avatar:scale-105 group-hover/avatar:border-primary-500" 
              src={member.avatarUrl} 
              alt={member.name} 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/avatar:bg-opacity-10 rounded-full transition-all flex items-center justify-center">
                <MagnifyingGlassIcon className="w-6 h-6 text-white opacity-0 group-hover/avatar:opacity-100" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-text-primary uppercase tracking-tight leading-tight">{member.name}</h3>
          <p className="text-primary-600 font-bold text-sm mb-2">{member.role}</p>
          <p className="text-text-secondary text-sm mt-2 line-clamp-2 italic">"{member.description}"</p>
        </div>
        
        <div className="w-full border-t border-border-primary pt-4 mt-4 text-left text-sm text-text-secondary space-y-2">
          <div className="flex items-center">
            <BriefcaseIcon className="w-4 h-4 mr-2 text-text-secondary opacity-75 flex-shrink-0" />
            <span className="font-medium">{member.profession}</span>
          </div>
          <div className="flex items-center">
            <EnvelopeIcon className="w-4 h-4 mr-2 text-text-secondary opacity-75 flex-shrink-0" />
            <a href={`mailto:${member.email}`} className="truncate hover:underline text-text-link" title={member.email}>{member.email}</a>
          </div>
          {member.phoneNumber && (
             <div className="flex items-center text-primary-600 font-bold">
                <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{member.phoneNumber}</span>
              </div>
          )}
          <div className="flex items-start">
            <MapPinIcon className="w-4 h-4 mr-2 text-text-secondary opacity-75 flex-shrink-0 mt-0.5" />
            <span className="truncate" title={member.address}>{member.address}</span>
          </div>
        </div>
        
        <div className="w-full pt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onSelect(member)}
              className={actionButtonClasses}
            >
              {isCurrentUser ? "Sửa hồ sơ" : "Xem Chi tiết"}
            </button>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <button
                onClick={handleCall}
                className="p-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-lg hover:scale-110 active:scale-95"
                aria-label={`Gọi cho ${member.name}`}
                title="GỌI ĐIỆN"
            >
                <PhoneIcon className="w-5 h-5" />
            </button>

            <button
                onClick={handleZalo}
                className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-lg hover:scale-110 active:scale-95"
                aria-label={`Zalo ${member.name}`}
                title="ZALO"
            >
                <ChatBubbleIcon className="w-5 h-5" />
            </button>

            <button
                onClick={handleViber}
                className="p-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-lg hover:scale-110 active:scale-95"
                aria-label={`Viber ${member.name}`}
                title="VIBER"
            >
                <ViberIcon className="w-5 h-5" />
            </button>

            {isShareSupported && (
              <button
                  onClick={handleShare}
                  className="p-2.5 bg-background-tertiary text-text-secondary rounded-full hover:bg-background-tertiary-hover transition-all shadow-sm hover:scale-110 active:scale-95"
                  aria-label={`Chia sẻ hồ sơ của ${member.name}`}
                  title="Chia sẻ"
              >
                  <ShareIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MemberListProps {
  title: string;
  members: Member[];
  onSelectMember: (member: Member) => void;
  isAdminMode: boolean;
  onAddNew: () => void;
  onDeleteMember: (member: Member) => void;
  websiteUrl?: string;
  currentUser: Member | null;
  onReorder: (members: Member[]) => void;
  onLoginClick?: () => void;
  isWideMode?: boolean;
}

type SortOption = 'manual' | 'nameAsc' | 'nameDesc' | 'role' | 'joinedDateNewest' | 'joinedDateOldest';

export const MemberList: React.FC<MemberListProps> = ({ title, members, onSelectMember, isAdminMode, onAddNew, onDeleteMember, websiteUrl, currentUser, onReorder, onLoginClick, isWideMode }) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const MEMBERS_PER_PAGE = isWideMode ? 12 : 8;
  
  const isGuestView = title === "Khách mời & Cộng tác viên" || title.includes("Guest");
  const copyableContent = `${title.toUpperCase()}\n--------------------\n` + members.map(m => `- ${m.name} (${m.role})`).join('\n');

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
  }, [members.length, title, isWideMode]);

  const filteredMembers = useMemo(() => {
      if (!searchQuery) return members;
      const lowerQuery = searchQuery.toLowerCase();
      return members.filter(member => 
          member.name.toLowerCase().includes(lowerQuery) || 
          member.profession.toLowerCase().includes(lowerQuery)
      );
  }, [members, searchQuery]);

  const getRoleRank = (role: string) => {
      const r = role.toLowerCase();
      if (r.includes('trưởng') || r.includes('leader') || r.includes('chủ tịch') || r.includes('president')) return 1;
      if (r.includes('phó') || r.includes('deputy') || r.includes('vice')) return 2;
      if (r.includes('thư ký') || r.includes('secretary')) return 3;
      if (r.includes('thủ quỹ') || r.includes('treasurer')) return 3;
      if (r.includes('uỷ viên') || r.includes('member')) return 4;
      return 10;
  };

  const sortedMembers = useMemo(() => {
    let sorted = [...filteredMembers];
    switch (sortOption) {
        case 'nameAsc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nameDesc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'role':
            sorted.sort((a, b) => {
                const rankA = getRoleRank(a.role);
                const rankB = getRoleRank(b.role);
                if (rankA !== rankB) {
                    return rankA - rankB;
                }
                return a.name.localeCompare(b.name);
            });
            break;
        case 'joinedDateNewest':
            sorted.sort((a, b) => {
                const dateA = a.joinedDate ? new Date(a.joinedDate).getTime() : 0;
                const dateB = b.joinedDate ? new Date(b.joinedDate).getTime() : 0;
                return dateB - dateA;
            });
            break;
        case 'joinedDateOldest':
            sorted.sort((a, b) => {
                const dateA = a.joinedDate ? new Date(a.joinedDate).getTime() : 0;
                const dateB = b.joinedDate ? new Date(b.joinedDate).getTime() : 0;
                if (dateA === 0 && dateB !== 0) return 1;
                if (dateA !== 0 && dateB === 0) return -1;
                return dateA - dateB;
            });
            break;
        case 'manual':
        default:
            break;
    }
    return sorted;
  }, [filteredMembers, sortOption]);

  const { currentMembers, totalPages } = useMemo(() => {
    const total = sortedMembers.length;
    const pages = Math.ceil(total / MEMBERS_PER_PAGE);
    const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE;
    
    return {
      currentMembers: sortedMembers.slice(startIndex, startIndex + MEMBERS_PER_PAGE),
      totalPages: pages,
    };
  }, [sortedMembers, currentPage, MEMBERS_PER_PAGE]);
  
  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
  };

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

      const sourceIndex = members.findIndex(m => m.id === sourceId);
      const targetIndex = members.findIndex(m => m.id === targetId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
          const newMembers = [...members];
          const [movedMember] = newMembers.splice(sourceIndex, 1);
          newMembers.splice(targetIndex, 0, movedMember);
          onReorder(newMembers);
      }
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
        <nav className="mt-12 flex items-center justify-center space-x-2" aria-label="Pagination">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-tertiary transition-colors"
                aria-label="Trang trước"
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                        ? 'bg-primary-600 text-text-accent shadow'
                        : 'text-text-primary hover:bg-background-tertiary'
                    }`}
                >
                    {pageNumber}
                </button>
            ))}
            
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-tertiary transition-colors"
                aria-label="Trang sau"
            >
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </nav>
    );
  };

  return (
    <div className={`${isWideMode ? 'max-w-none' : 'max-w-6xl'} mx-auto`}>
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 border-b border-border-primary pb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-black text-text-primary uppercase tracking-tighter">{title}</h1>
          <ClipboardCopyButton contentToCopy={copyableContent} />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
             <div className="relative flex-grow md:flex-grow-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-3 py-2 border border-border-primary rounded-md leading-5 bg-white text-gray-900 placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
                    placeholder={t('search.placeholder')}
                />
             </div>

            <div className="flex items-center bg-background-tertiary border border-border-primary rounded-md px-3 py-2 shadow-sm">
                <ArrowsUpDownIcon className="w-4 h-4 text-text-secondary mr-2" />
                <span className="text-xs font-bold text-text-secondary mr-2 hidden sm:inline uppercase">{t('sort.sortBy')}</span>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="bg-transparent text-sm font-bold text-text-primary focus:outline-none cursor-pointer"
                >
                    <option value="manual">{t('sort.manual')}</option>
                    <option value="nameAsc">{t('sort.nameAsc')}</option>
                    <option value="nameDesc">{t('sort.nameDesc')}</option>
                    <option value="role">{t('sort.role')}</option>
                    <option value="joinedDateNewest">{t('sort.joinedDateNewest')}</option>
                    <option value="joinedDateOldest">{t('sort.joinedDateOldest')}</option>
                </select>
            </div>

            {!currentUser && onLoginClick && (
                 <button 
                    onClick={onLoginClick} 
                    className="flex items-center px-4 py-2 bg-primary-100 text-primary-700 font-black rounded-md hover:bg-primary-200 transition-colors duration-200 uppercase text-xs border border-primary-200"
                >
                    {t('login.cta')}
                 </button>
            )}

            {isAdminMode && (
                <button
                    onClick={onAddNew}
                    className="flex items-center px-4 py-2 bg-primary-600 text-text-accent font-black rounded-md hover:bg-primary-700 transition-colors duration-200 ml-auto uppercase text-xs shadow-md"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {isGuestView ? t('add.guest') : t('add.member')}
                </button>
            )}
        </div>
      </div>
      
      {currentMembers.length > 0 ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isWideMode ? 'md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' : 'md:grid-cols-3 lg:grid-cols-4'} gap-8`}>
            {currentMembers.map(member => (
              <MemberCard 
                key={member.id} 
                member={member} 
                onSelect={onSelectMember} 
                isAdminMode={isAdminMode} 
                onDelete={onDeleteMember} 
                websiteUrl={websiteUrl} 
                currentUser={currentUser}
                draggable={isAdminMode && sortOption === 'manual' && !searchQuery}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
      ) : (
          <div className="text-center py-20 bg-background-tertiary rounded-2xl border-2 border-dashed border-border-primary">
              <p className="text-text-secondary text-xl font-black italic uppercase opacity-50 tracking-widest">Không tìm thấy kết quả phù hợp</p>
          </div>
      )}
      <Pagination />
    </div>
  );
};
