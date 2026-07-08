import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Label } from '@/app/components/ui/label';
import { DiaryFeedItem } from '@/types/diary';
import { CreateDiaryBookPayload, DiaryBook } from '@/types/diaryBook';
import { Image, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateDiaryBookPayload, selectedDiaryIds: string[]) => Promise<void>;
  availableDiaries: DiaryFeedItem[];
  bookToEdit?: DiaryBook | null;
  initialSelectedIds?: string[];
  isLoading?: boolean;
}

export function CreateEditDiaryBookModal({ 
  isOpen, 
  onClose, 
  onSave, 
  availableDiaries, 
  bookToEdit, 
  initialSelectedIds = [],
  isLoading = false
}: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      if (bookToEdit) {
        setTitle(bookToEdit.title);
        setDescription(bookToEdit.description || '');
        setCoverImageUrl(bookToEdit.cover_image_url || '');
        setSelectedIds(initialSelectedIds || []);
      } else {
        setTitle('');
        setDescription('');
        setCoverImageUrl('');
        setSelectedIds([]);
      }
    }
  }, [isOpen, bookToEdit]);

  const handleToggleDiary = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title,
      description,
      cover_image_url: coverImageUrl
    }, selectedIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{bookToEdit ? 'Chỉnh sửa Cuốn Nhật Ký' : 'Tạo Cuốn Nhật Ký Mới'}</DialogTitle>
          <DialogDescription>
            Đóng gói những chuyến đi của bạn thành một cuốn sách kỹ thuật số tuyệt đẹp.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tên cuốn sách *</Label>
              <Input 
                id="title" 
                placeholder="Vd: Hành Trình Tuổi 20" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả ngắn</Label>
              <Textarea 
                id="description" 
                placeholder="Viết một vài dòng giới thiệu về cuốn sách này..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Ảnh bìa (URL)</Label>
              <div className="flex gap-2">
                <Input 
                  id="cover" 
                  placeholder="https://example.com/image.jpg" 
                  value={coverImageUrl} 
                  onChange={(e) => setCoverImageUrl(e.target.value)} 
                />
                {coverImageUrl && (
                  <Button variant="outline" size="icon" onClick={() => setCoverImageUrl('')}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {coverImageUrl ? (
                <div className="mt-2 h-32 w-full rounded-md overflow-hidden bg-slate-100 border relative">
                  <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="mt-2 h-20 w-full rounded-md bg-slate-50 border border-dashed flex items-center justify-center text-slate-400">
                  <Image className="w-6 h-6 mr-2" />
                  <span className="text-sm">Chưa có ảnh bìa</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <Label>Chọn các bài viết vào sách</Label>
              <span className="text-xs text-slate-500">Đã chọn: {selectedIds.length} bài</span>
            </div>
            
            <ScrollArea className="h-[250px] border rounded-md p-2">
              {availableDiaries.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  Bạn chưa có bài viết nhật ký nào.
                </div>
              ) : (
                <div className="space-y-2">
                  {availableDiaries.map((diary) => (
                    <div 
                      key={diary.id} 
                      className={`flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer border transition-colors ${selectedIds.includes(diary.id) ? 'border-orange-200 bg-orange-50/50' : 'border-transparent'}`}
                      onClick={() => handleToggleDiary(diary.id)}
                    >
                      <Checkbox 
                        checked={selectedIds.includes(diary.id)} 
                        onCheckedChange={() => handleToggleDiary(diary.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="w-12 h-12 rounded object-cover overflow-hidden shrink-0 bg-slate-200">
                        <img src={diary.image} alt={diary.title || diary.location} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {diary.title || diary.location}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {diary.date} • {diary.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Hủy</Button>
          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white" 
            onClick={handleSave} 
            disabled={!title.trim() || isLoading}
          >
            {isLoading ? 'Đang lưu...' : (bookToEdit ? 'Lưu thay đổi' : 'Tạo cuốn sách')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
