import html2pdf from 'html2pdf.js';

/**
 * Hàm xuất một element HTML thành file PDF
 * @param elementId ID của HTML element cần xuất
 * @param filename Tên file không có đuôi .pdf
 */
export const exportToPDF = async (elementId: string, filename: string): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) return false;
  
  // Clone element để tránh ảnh hưởng đến UI gốc khi đang render PDF (tuỳ chọn)
  // Nhưng html2pdf có tuỳ chọn bỏ qua các class đặc biệt (như nút bấm) bằng html2canvas
  
  const opt = {
    margin:       10,
    filename:     `${filename}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error("Lỗi xuất PDF:", error);
    return false;
  }
};

/**
 * Hàm xuất HTML cơ bản sang định dạng MS Word (.doc)
 * @param elementId ID của HTML element cần xuất
 * @param filename Tên file không có đuôi .doc
 */
export const exportToWord = (elementId: string, filename: string): boolean => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  // Lấy nội dung HTML và bao bọc bằng tag Word
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
  const footer = "</body></html>";
  const sourceHTML = header + element.innerHTML + footer;
  
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `${filename}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
  
  return true;
};
