import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DiaryAuthor {
  name: string;
  avatar: string;
}

export interface Diary {
  id: string;
  author: DiaryAuthor;
  image: string;
  location: string;
  date: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  groupSize: string;
}

interface DiaryState {
  diaries: Diary[];
  addDiary: (diary: Omit<Diary, 'id' | 'date' | 'likes' | 'comments' | 'isLiked' | 'isSaved'>) => void;
  removeDiary: (id: string) => void;
  toggleLike: (id: string) => void;
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set) => ({
      diaries: [
        {
          id: "1",
          author: {
            name: "Phan Văn Minh",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
          },
          image: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          location: "Vịnh Hạ Long, Quảng Ninh",
          date: "20 tháng 6, 2026",
          caption: "5 ngày trên vịnh Hạ Long thật không thể quên! Sáng sớm nhìn mặt trời mọc từ boong tàu, không khí trong lành và cảnh đẹp như tranh vẽ. Chèo kayak qua những hang động nhỏ, tắm biển ở đảo Ti Tốp, và ngắm hoàng hôn lãng mạn. 🌅⛵",
          likes: 324,
          comments: 47,
          isLiked: false,
          isSaved: false,
          groupSize: "2 người",
        },
        {
          id: "3",
          author: {
            name: "Phan Văn Minh",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
          },
          image: "https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          location: "Sa Pa, Lào Cai",
          date: "18 tháng 9, 2026",
          caption: "Tháng 9 đến Sa Pa chính là thời điểm vàng! Ruộng bậc thang chuyển màu vàng óng tuyệt đẹp như tranh. Trek qua các bản làng H'Mông, gặp những nụ cười thật thà và chân thành. Chinh phục Fansipan 3143m - cảm giác đứng trên nóc nhà Đông Dương thật tuyệt vời! 🌾⛰️",
          likes: 412,
          comments: 62,
          isLiked: false,
          isSaved: false,
          groupSize: "3 người",
        },
        {
          id: "4",
          author: {
            name: "Phan Văn Minh",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
          },
          image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          location: "Hội An, Quảng Nam",
          date: "14 tháng 4, 2026",
          caption: "Đêm rằm Hội An lung linh huyền ảo với hàng ngàn chiếc đèn lồng! Dạo phố cổ, học làm cao lầu và mì Quảng, thả hoa đăng trên sông Hoài. Cảm giác như lạc vào thế giới cổ tích. 🏮✨",
          likes: 389,
          comments: 51,
          isLiked: true,
          isSaved: false,
          groupSize: "2 người",
        },
      ],
      addDiary: (diary) => set((state) => ({
        diaries: [
          {
            ...diary,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
            likes: 0,
            comments: 0,
            isLiked: false,
            isSaved: false,
          },
          ...state.diaries
        ]
      })),
      removeDiary: (id) => set((state) => ({
        diaries: state.diaries.filter((d) => d.id !== id)
      })),
      toggleLike: (id) => set((state) => ({
        diaries: state.diaries.map(d => 
          d.id === id ? { ...d, isLiked: !d.isLiked, likes: d.isLiked ? d.likes - 1 : d.likes + 1 } : d
        )
      })),
    }),
    {
      name: 'wanderlab-diaries',
    }
  )
);
