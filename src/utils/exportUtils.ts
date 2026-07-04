import html2pdf from 'html2pdf.js';

/**
 * Hàm xuất một element HTML thành file PDF
 * @param elementId ID của HTML element cần xuất
 * @param filename Tên file không có đuôi .pdf
 */
export const exportToPDF = async (elementId: string, filename: string): Promise<{ success: boolean; error?: string }> => {
  const element = document.getElementById(elementId);
  if (!element) return { success: false, error: "Element not found" };
  
  const opt = {
    margin:       10,
    filename:     `${filename}.pdf`,
    image:        { type: 'jpeg' as const, quality: 0.98 },
    html2canvas:  { 
      scale: 2, 
      useCORS: true, 
      letterRendering: true,
      onclone: (document) => {
        const el = document.getElementById(elementId);
        if (el && el.parentElement) {
          el.parentElement.classList.remove('hidden');
          el.style.display = 'block';
        }
      },
      ignoreElements: (element) => {
        // Ignore style and link tags to prevent html2canvas from parsing Tailwind v4's oklch colors and crashing
        if (element.tagName === 'STYLE' || (element.tagName === 'LINK' && element.getAttribute('rel') === 'stylesheet')) {
          return true;
        }
        return false;
      }
    },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
  };
  
  try {
    await html2pdf().set(opt).from(element).save();
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi xuất PDF:", error);
    return { success: false, error: error?.message || String(error) };
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
