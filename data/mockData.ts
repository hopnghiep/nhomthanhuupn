
import { Member, Event, GroupInfo } from '../types';

export const groupInfo: GroupInfo = {
    history: "NHÓM THÂN HỬU PHÚ NHUẬN được thành lập vào năm 2010 bởi một nhóm bạn bè cùng chung chí hướng, mong muốn tạo ra một không gian kết nối, chia sẻ và hỗ trợ lẫn nhau trong cuộc sống và công việc tại quận Phú Nhuận. Trải qua hơn một thập kỷ, nhóm đã phát triển mạnh mẽ, trở thành một cộng đồng gắn kết với nhiều hoạt động ý nghĩa.",
    mission: "Mục tiêu của NHÓM THÂN HỬU PHÚ NHUẬN là xây dựng một cộng đồng thân hữu đoàn kết, vững mạnh, nơi mỗi thành viên đều có thể tìm thấy sự sẻ chia, học hỏi kinh nghiệm và cùng nhau phát triển. Chúng tôi hướng đến việc tổ chức các hoạt động văn hóa, xã hội, từ thiện, góp phần xây dựng một Phú Nhuận văn minh, hiện đại và giàu tình người.",
    keyEvents: [
        { 
            title: "Ngày Thầy thuốc Việt Nam 27/2",
            description: "Tổ chức tri ân các thành viên và thân hữu làm trong ngành y, tôn vinh những đóng góp thầm lặng của họ cho sức khỏe cộng đồng."
        },
        { 
            title: "Ngày Nhà giáo Việt Nam 20/11",
            description: "Vinh danh các thành viên là nhà giáo, những người cống hiến cho sự nghiệp trồng người."
        },
        { 
            title: "Chương trình từ thiện 'Xuân Yêu Thương'",
            description: "Hoạt động thường niên vào mỗi dịp Tết Nguyên Đán, mang những phần quà ý nghĩa đến với các hoàn cảnh khó khăn trong quận."
        }
    ],
    heroImageUrls: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop", // Ảnh đứng: Nhóm bạn vui vẻ
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop", // Ảnh đứng: Cộng đồng gắn kết
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop", // Ảnh đứng: Hoạt động tập thể
      "https://images.unsplash.com/photo-1461280360983-bd93eaa5051b?q=80&w=1000&auto=format&fit=crop"  // Ảnh đứng: Nghệ thuật/Hội họa thân hữu
    ],
    broadcastUrl: "https://zalo.me/g/ilzakd825",
    groupAnthemMedia: {
      id: 'anthem-yt-1',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=kgjrCFiGkOY',
      title: 'Bài ca NHÓM THÂN HỬU PHÚ NHUẬN'
    },
    socialLinks: {
        facebook: "https://facebook.com",
        zalo: "https://zalo.me",
        website: "https://example.com",
        viber: "https://viber.com"
    }
};

export const members: Member[] = [
  {
    id: 1,
    name: 'Trần Đại Quí',
    role: 'Trưởng nhóm',
    description: 'Người sáng lập và dẫn dắt nhóm từ những ngày đầu tiên. Luôn nhiệt huyết và tận tâm với các hoạt động chung.',
    profession: 'Kiến trúc sư',
    email: 'qui.tran@example.com',
    phoneNumber: '0901234567',
    address: '123 Phan Xich Long, P. 2, Q. Phu Nhuan, HCMC',
    avatarUrl: 'https://i.pravatar.cc/300?u=qui',
    activities: [
        'Tổ chức sự kiện 20/11',
        'Chuyến đi từ thiện 2023'
    ],
    loginCode: 'ANNGUYEN-A1B2',
    isAdmin: true,
    joinedDate: '2010-01-15'
  },
  {
    id: 2,
    name: 'Nguyễn Văn Bình',
    role: 'Phó nhóm',
    description: 'Chuyên gia hậu cần và kết nối các thành viên.',
    profession: 'Kỹ sư xây dựng',
    email: 'binh.nguyen@example.com',
    phoneNumber: '0912345678',
    address: '456 Lê Văn Sỹ, P. 10, Q. Phú Nhuận',
    avatarUrl: 'https://i.pravatar.cc/300?u=binh',
    activities: ['Quản lý quỹ nhóm', 'Tổ chức sinh nhật tháng'],
    loginCode: 'BINHNG-B2C3',
    joinedDate: '2012-05-20'
  }
];

export const guests: Member[] = [
  {
    id: 5,
    name: 'Hoàng Văn Em',
    role: 'Cộng tác viên',
    description: 'Nhiếp ảnh gia tài năng, đã giúp nhóm ghi lại những khoảnh khắc đẹp trong nhiều sự kiện.',
    profession: 'Nhiếp ảnh gia',
    email: 'em.hoang@example.com',
    phoneNumber: '0987654321',
    address: '333 Le Van Sy, P. 13, Q. 3, HCMC',
    avatarUrl: 'https://i.pravatar.cc/300?u=em',
    activities: [
        'Chụp ảnh sự kiện 20/11',
        'Chuyến đi từ thiện 2023'
    ],
    loginCode: 'EMHOANG-E5F6',
    joinedDate: '2023-01-10'
  },
];

export const events: Event[] = [
  {
    id: 1,
    name: 'Gala Dinner Chào Năm Mới 2024',
    date: 'December 31, 2023',
    location: 'Trung tâm Hội nghị White Palace, 194 Hoàng Văn Thụ, Q. Phú Nhuận',
    description: 'Buổi tiệc thân mật tổng kết một năm hoạt động và chào đón năm mới với nhiều hy vọng và dự định. Đây là dịp để các thành viên và gia đình cùng nhau giao lưu, chia sẻ.',
    media: [
      { id: 'evt1-img1', type: 'image', url: 'https://picsum.photos/seed/event1_1/400/300' },
      { id: 'evt1-img2', type: 'image', url: 'https://picsum.photos/seed/event1_2/400/300' },
      { id: 'evt1-img3', type: 'image', url: 'https://picsum.photos/seed/event1_3/400/300' },
      { id: 'evt1-yt1', type: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
];
