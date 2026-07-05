import { useRef } from "react";
import {
  X, MapPin, Clock, Users, Wallet, Calendar, Star,
  FileDown, Trash2, Sparkles, ChevronRight,
} from "lucide-react";
import type { SavedItinerary } from "../../hooks/useSavedItineraries";

interface Props {
  itinerary: SavedItinerary;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function ItineraryDetailModal({ itinerary, onClose, onDelete }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  // Guard against old localStorage entries missing these fields
  const days = itinerary.days ?? [];
  const budgetBreakdown = itinerary.budgetBreakdown ?? [];

  // ── PDF via browser print ──
  const handleDownloadPDF = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const printWindow = iframe.contentWindow;
    if (!printWindow) {
      document.body.removeChild(iframe);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <title>Lịch Trình – ${itinerary.destination}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #1f2937; background: #fff; padding: 32px; }
          .header { background: linear-gradient(135deg,#ff3131,#ff914d); color: #fff; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
          .header h1 { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
          .header .meta { display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; opacity: .9; }
          .section-title { font-size: 15px; font-weight: 700; color: #111827; margin: 20px 0 12px; display: flex; align-items: center; gap: 6px; }
          .day-card { border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 12px; overflow: hidden; }
          .day-header { background: #fff5f3; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; }
          .day-num { font-size: 11px; font-weight: 700; color: #ff3131; text-transform: uppercase; }
          .day-title { font-size: 14px; font-weight: 700; color: #111827; }
          .day-budget { font-size: 13px; font-weight: 700; color: #ff3131; }
          .day-body { padding: 10px 16px; }
          .day-body ul { list-style: none; }
          .day-body li { font-size: 13px; color: #374151; padding: 3px 0; padding-left: 14px; position: relative; }
          .day-body li::before { content: "•"; position: absolute; left: 0; color: #ff914d; }
          .budget-table { width: 100%; border-collapse: collapse; font-size: 13px; }
          .budget-table td { padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
          .budget-table td:last-child { text-align: right; font-weight: 600; }
          .budget-total { font-weight: 800; font-size: 15px; color: #ff3131; }
          .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
          .tag { background: #fff5f3; color: #ff3131; border-radius: 999px; padding: 3px 10px; font-size: 12px; font-weight: 600; }
          .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
          .emoji { margin-right: 4px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✈️ Lịch Trình ${itinerary.destination}</h1>
          <p style="font-size:13px;opacity:.8;margin-bottom:10px">${itinerary.destinationRegion}</p>
          <div class="meta">
            <span>📅 ${itinerary.duration}</span>
            <span>👥 ${itinerary.groupSize}</span>
            <span>💳 Ngân sách ${itinerary.budget}</span>
            <span>⭐ Phù hợp 96%</span>
          </div>
        </div>

        <div class="section-title">📅 Lịch trình từng ngày</div>
        ${days.map((day) => `
          <div class="day-card">
            <div class="day-header">
              <div>
                <div class="day-num">Ngày ${day.day}</div>
                <div class="day-title"><span class="emoji">${day.emoji}</span>${day.title}</div>
              </div>
              <div class="day-budget">~${day.budget}</div>
            </div>
            <div class="day-body">
              <ul>
                ${day.activities.map((a) => `<li>${a}</li>`).join("")}
              </ul>
            </div>
          </div>
        `).join("")}

        <div class="section-title">💰 Ước tính chi phí</div>
        <table class="budget-table">
          ${budgetBreakdown.map((b) => `
            <tr><td>${b.label}</td><td>${b.amount}</td></tr>
          `).join("")}
          <tr>
            <td class="budget-total">Tổng ước tính</td>
            <td class="budget-total">${itinerary.estimatedTotal}</td>
          </tr>
        </table>

        ${itinerary.interests.length > 0 ? `
          <div class="section-title">🎯 Sở thích</div>
          <div class="tags">
            ${itinerary.interests.map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
        ` : ""}

        <div class="footer">
          Tạo bởi WanderLab AI · wanderlab.vn · Lưu lúc ${itinerary.savedAt}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 400);
  };

  const handleDelete = () => {
    onDelete(itinerary.id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        {/* Panel */}
        <div
          className="relative bg-white w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Hero image header ── */}
          <div className="relative h-44 sm:h-52 flex-shrink-0 overflow-hidden">
            <img
              src={itinerary.destinationImage}
              alt={itinerary.destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Close btn */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all"
            >
              <X size={18} />
            </button>

            {/* AI badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles size={12} /> AI Generated · Phù hợp 96%
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
              <h2 className="text-white font-extrabold text-xl sm:text-2xl leading-tight drop-shadow">
                {itinerary.destination}
              </h2>
              <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                <MapPin size={13} /> {itinerary.destinationRegion}
              </p>
            </div>
          </div>

          {/* ── Meta chips ── */}
          <div className="flex gap-2 px-5 py-3 bg-[#FFF5F3] border-b border-red-100 flex-wrap flex-shrink-0">
            {[
              { icon: <Clock size={13} />, label: itinerary.duration },
              { icon: <Users size={13} />, label: itinerary.groupSize },
              { icon: <Wallet size={13} />, label: `Ngân sách ${itinerary.budget}` },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-red-100 text-[#ff3131] text-xs font-semibold rounded-full"
              >
                {icon} {label}
              </span>
            ))}
            {itinerary.interests.slice(0, 2).map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6" ref={printRef}>
            {/* Day-by-day */}
            <section>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-[#ff3131]" /> Lịch trình từng ngày
              </h3>
              <div className="space-y-3">
                {days.map((day) => (
                  <div
                    key={day.day}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-[#ff3131]/10 to-[#ff914d]/10 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{day.emoji}</span>
                        <div>
                          <span className="text-xs font-bold text-[#ff3131] uppercase tracking-wide">
                            Ngày {day.day}
                          </span>
                          <p className="font-bold text-gray-900 text-sm leading-tight">{day.title}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#ff3131] bg-white px-2.5 py-1 rounded-xl shadow-sm flex-shrink-0">
                        ~{day.budget}
                      </span>
                    </div>
                    <ul className="px-4 py-3 space-y-1.5">
                      {day.activities.map((act, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <ChevronRight size={14} className="text-[#ff914d] mt-0.5 flex-shrink-0" />
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Budget breakdown */}
            <section>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                <Wallet size={16} className="text-[#ff3131]" /> Ước tính chi phí
              </h3>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2.5">
                {budgetBreakdown.map(({ label, amount }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">{amount}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-gray-200 pt-2.5 flex justify-between">
                  <span className="font-bold text-gray-900">Tổng ước tính</span>
                  <span className="font-extrabold text-[#ff3131] text-base">{itinerary.estimatedTotal}</span>
                </div>
              </div>
            </section>

            {/* Interests */}
            {itinerary.interests.length > 0 && (
              <section>
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <Star size={16} className="text-[#ff3131]" /> Sở thích đã chọn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {itinerary.interests.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-[#FFF5F3] border border-red-100 text-[#ff3131] text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Saved date */}
            <p className="text-xs text-gray-400 text-center pb-2">
              Đã lưu {itinerary.savedAt} · Tạo bởi WanderLab AI
            </p>
          </div>

          {/* ── Action footer ── */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 py-4 flex gap-3">
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-red-200 text-red-500 font-semibold hover:bg-red-50 hover:border-red-400 transition-all flex-shrink-0"
              title="Xóa lịch trình"
            >
              <Trash2 size={17} />
              <span className="hidden sm:inline">Xóa</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white font-bold hover:shadow-lg transition-all"
            >
              <FileDown size={18} /> Tải PDF
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-400 transition-all flex-shrink-0"
            >
              <X size={17} />
              <span className="hidden sm:inline">Đóng</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}