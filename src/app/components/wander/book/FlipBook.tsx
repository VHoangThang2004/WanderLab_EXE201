import React, { forwardRef, useMemo } from 'react';
// @ts-ignore - react-pageflip lacks proper TS definitions for latest React
import HTMLFlipBook from 'react-pageflip';
import { Calendar, MapPin, Clock, Users, BookOpen } from 'lucide-react';

interface PageProps {
  children: React.ReactNode;
  number: number;
  isCover?: boolean;
}

// Mỗi trang sách (phải dùng forwardRef theo yêu cầu của react-pageflip)
const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  if (props.isCover) {
    return (
      <div className="page bg-slate-900 border-2 border-slate-800 shadow-2xl overflow-hidden relative rounded-r-lg" ref={ref}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-slate-900/90 pointer-events-none z-10" />
        <div className="page-content h-full w-full flex flex-col relative z-20">
          {props.children}
        </div>
      </div>
    );
  }

  return (
    <div className="page bg-[#fdfaf6] border-r border-[#e0d6c8] shadow-[inset_-20px_0_40px_rgba(0,0,0,0.05)] p-8 overflow-hidden relative text-slate-800" ref={ref}>
      <div className="page-content h-full w-full flex flex-col">
        {props.children}
      </div>
      <div className="page-footer absolute bottom-4 left-0 w-full text-center text-slate-400 text-sm font-sans">
        {props.number}
      </div>
    </div>
  );
});

export function FlipBook({ diaries, user }: { diaries: any[], user: any }) {
  
  // Tổng hợp tất cả các trang
  const pages = useMemo(() => {
    let p = [];
    let pageNum = 1;

    // 1. Cover Page
    p.push(
      <Page key="cover" number={pageNum++} isCover>
        <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
          <img src="https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&q=80&w=600" className="w-48 h-48 rounded-full object-cover mb-8 shadow-xl border-4 border-slate-800/50" alt="Wander" />
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mb-4 leading-tight tracking-wide">
            Hành Trình<br/><span className="text-orange-500">Thanh Xuân</span>
          </h1>
          <p className="text-slate-400 text-lg uppercase tracking-widest mt-4">
            Tác giả: {user?.full_name || 'Kẻ Lữ Hành'}
          </p>
          <div className="mt-12 text-slate-500 text-sm">
            WanderLab © {new Date().getFullYear()}
          </div>
        </div>
      </Page>
    );

    // 2. Table of Contents
    p.push(
      <Page key="toc" number={pageNum++}>
        <div className="pt-8">
          <h2 className="text-3xl font-sans font-bold text-slate-800 border-b-2 border-orange-200 pb-4 mb-8">Mục Lục</h2>
          <div className="space-y-6">
            {diaries.map((d, i) => (
              <div key={d.id} className="flex items-end group">
                <div className="text-orange-600 font-bold w-12 shrink-0">Ch. {i + 1}</div>
                <div className="font-medium text-slate-700 truncate pr-4">{d.title}</div>
                <div className="flex-1 border-b-2 border-dotted border-slate-300 mb-1 mx-2 relative group-hover:border-orange-300 transition-colors"></div>
                <div className="text-slate-500 text-sm">{d.location}</div>
              </div>
            ))}
          </div>
        </div>
      </Page>
    );

    // 3. Diary Chapters
    diaries.forEach((diary, idx) => {
      // First page of chapter (Title + Image)
      p.push(
        <Page key={`diary-${diary.id}-p1`} number={pageNum++}>
          <div className="h-full flex flex-col pt-4">
            <div className="text-orange-600 font-sans font-bold tracking-widest uppercase text-sm mb-2">Chương {idx + 1}</div>
            <h2 className="text-3xl font-sans font-bold text-slate-900 leading-tight mb-6">{diary.title}</h2>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4 font-medium">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{diary.location}</span>
              {diary.dates && <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{diary.dates}</span>}
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{diary.duration}</span>
              {diary.groupSize && <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{diary.groupSize}</span>}
            </div>

            {diary.totalBudget && (
              <div className="mb-6 inline-block bg-orange-100 text-orange-800 font-bold px-4 py-1.5 rounded-full text-sm self-start border border-orange-200 shadow-sm">
                Ngân sách: {diary.totalBudget}
              </div>
            )}

            {diary.image && (
              <div className="rounded-xl overflow-hidden shadow-md mb-6 bg-slate-200 h-64 shrink-0">
                <img src={diary.image} alt={diary.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="text-slate-700 leading-relaxed text-justify line-clamp-[8] font-sans">
              {diary.description}
            </div>
          </div>
        </Page>
      );

      // Subsequent pages of chapter (Timeline)
      if (diary.timeline && diary.timeline.length > 0) {
        diary.timeline.forEach((day: any, dayIdx: number) => {
          p.push(
            <Page key={`diary-${diary.id}-day-${day.day}`} number={pageNum++}>
               <div className="pt-8 h-full flex flex-col">
                <h3 className="text-xl font-sans font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6">
                  Lịch trình {diary.timeline.length > 1 ? `- Trang ${dayIdx + 1}` : 'chi tiết'}
                </h3>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="font-bold text-orange-600 mb-4 font-sans text-lg">Ngày {day.day}: {day.title}</div>
                  <div className="pl-4 border-l-2 border-orange-200 space-y-5">
                    {day.activities?.map((act: any, i: number) => {
                      if (typeof act === 'string') {
                        return (
                          <div key={i} className="text-sm flex items-start">
                            <span className="mr-2 text-orange-400">•</span>
                            <span className="text-slate-800 font-medium">{act}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={i} className="text-sm">
                          <div className="flex items-start">
                            <span className="font-bold text-slate-700 w-12 shrink-0">{act.time}</span>
                            <span className="mx-2 text-slate-400">•</span>
                            <span className="text-slate-800 font-medium">{act.title}</span>
                          </div>
                          {act.description && (
                            <div className="text-slate-500 mt-1 ml-16 text-xs leading-relaxed text-justify">
                              {act.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {(!day.activities || day.activities.length === 0) && (
                      <div className="text-sm text-slate-400 italic">Không có hoạt động nào được ghi lại.</div>
                    )}
                  </div>
                </div>
              </div>
            </Page>
          );
        });
      }
      
      // Budget Breakdown page
      if (diary.budgetBreakdown && diary.budgetBreakdown.length > 0) {
        p.push(
          <Page key={`diary-${diary.id}-budget`} number={pageNum++}>
             <div className="pt-8 h-full flex flex-col">
              <h3 className="text-xl font-sans font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6">Chi Phí Chi Tiết</h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                  {diary.budgetBreakdown.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="font-medium text-slate-700">{item.category}</span>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">{item.amount}</div>
                        {item.percentage && <div className="text-xs text-slate-400">{item.percentage}% tổng chi phí</div>}
                      </div>
                    </div>
                  ))}
                  {diary.totalBudget && (
                    <div className="flex justify-between items-center pt-4 border-t-2 border-slate-200 mt-4">
                      <span className="font-bold text-slate-800 text-lg">Tổng cộng</span>
                      <span className="font-bold text-orange-600 text-xl">{diary.totalBudget}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Page>
        );
      }
      
      if (!diary.timeline || diary.timeline.length === 0) {
        // If no timeline, push a blank page to keep left/right book flow if needed, 
        // or just continue. We'll just push a quote page.
        p.push(
          <Page key={`diary-${diary.id}-p2`} number={pageNum++}>
             <div className="h-full flex items-center justify-center p-12 text-center">
               <div className="text-2xl font-sans italic text-slate-400">
                 "Đích đến không phải là một vùng đất, mà là một cách nhìn mới."
               </div>
             </div>
          </Page>
        )
      }
    });

    // Back cover
    p.push(
      <Page key="back-cover" number={pageNum++} isCover>
        <div className="h-full flex flex-col justify-center items-center p-8 bg-slate-900 rounded-l-lg">
          <BookOpen className="w-16 h-16 text-slate-700 mb-6" />
          <h2 className="text-2xl font-sans font-bold text-slate-500 mb-2">WanderLab</h2>
          <p className="text-slate-600 text-sm">Nền tảng lưu giữ thanh xuân</p>
        </div>
      </Page>
    );

    return p;
  }, [diaries, user]);

  return (
    <div className="flipbook-container flex justify-center pb-12 overflow-hidden w-full relative">
      {/* 
        react-pageflip requires width/height. 
        We use realistic book aspect ratio (e.g., A5 size approx: 1:1.41)
      */}
      <HTMLFlipBook 
        width={400} 
        height={565} 
        size="stretch"
        minWidth={315}
        maxWidth={500}
        minHeight={400}
        maxHeight={700}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="demo-book shadow-2xl mx-auto"
      >
        {pages}
      </HTMLFlipBook>
    </div>
  );
}
