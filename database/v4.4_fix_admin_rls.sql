-- =========================================================================================
-- WANDERLAB - SCRIPT SỬA LỖI ROW-LEVEL SECURITY (RLS) CHO ADMIN DASHBOARD
-- Lỗi: Doanh thu và số lượng đơn hàng trên Admin Dashboard hiển thị 0 (không đúng thực tế).
-- Nguyên nhân: Admin chưa có quyền đọc bảng `payment_transactions` của các user khác do bị chặn bởi RLS.
-- Hướng dẫn: Chạy script này trong Supabase SQL Editor.
-- =========================================================================================

-- Thêm Policy cho phép tài khoản có role là 'admin' được xem toàn bộ giao dịch
DROP POLICY IF EXISTS "Admin đọc tất cả giao dịch" ON public.payment_transactions;

CREATE POLICY "Admin đọc tất cả giao dịch" ON public.payment_transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
