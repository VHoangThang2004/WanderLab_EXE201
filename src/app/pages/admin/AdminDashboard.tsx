import React, { useState, useEffect } from 'react';
import { Users, CreditCard, MessageSquare, DollarSign, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';
import { useNavigate } from 'react-router';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const [stats, setStats] = useState({
    users: 0,
    reviews: 0,
    revenue: 125000000, // Mock 125M VND
    transactions: 854 // Mock
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check access
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    async function fetchStats() {
      try {
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        // Fetch reviews count
        const { count: reviewsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true });

        // Fetch transactions for revenue and count
        const { data: transactions } = await supabase
          .from('payment_transactions')
          .select('amount, status');

        let totalRevenue = 0;
        let totalTransactions = 0;

        if (transactions) {
          totalTransactions = transactions.length;
          totalRevenue = transactions
            .filter(t => t.status === 'SUCCESS' || t.status === 'PAID')
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        }

        setStats(prev => ({
          ...prev,
          users: usersCount || 0,
          reviews: reviewsCount || 0,
          revenue: totalRevenue,
          transactions: totalTransactions
        }));
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-xl">
                W
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">Tổng quan hệ thống</h2>
          <p className="text-gray-500 text-sm mt-1">Cập nhật số liệu mới nhất ngày hôm nay</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tổng Doanh Thu</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</h3>
              </div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+12.5%</span>
              <span className="text-gray-400 ml-2">so với tháng trước</span>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tổng Người Dùng</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.users}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+8%</span>
              <span className="text-gray-400 ml-2">so với tháng trước</span>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tổng Giao Dịch</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.transactions}</h3>
              </div>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <CreditCard size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown size={16} className="text-red-500 mr-1" />
              <span className="text-red-500 font-medium">-2.1%</span>
              <span className="text-gray-400 ml-2">so với tháng trước</span>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Lượt Đánh Giá</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.reviews}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+15.4%</span>
              <span className="text-gray-400 ml-2">so với tháng trước</span>
            </div>
          </div>

        </div>

        {/* Placeholder for future charts or tables */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          <p>Khu vực biểu đồ và danh sách dữ liệu chi tiết sẽ được phát triển trong giai đoạn sau.</p>
        </div>
      </main>
    </div>
  );
}
