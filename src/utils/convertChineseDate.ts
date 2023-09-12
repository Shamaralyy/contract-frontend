export function convertChineseDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const yearText = String(year).split('').map(digitToChinese).join('');
    const monthText = monthArr[month - 1];
    
    return `${yearText}年${monthText}`;
  }
  
  function digitToChinese(digit) {
    const digitText = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return digitText[parseInt(digit)];
  }