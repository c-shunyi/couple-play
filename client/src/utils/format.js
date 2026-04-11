/**
 * 通用格式化工具（占位）。后续业务可按需补充日期、金额、文本脱敏等函数。
 */

/**
 * 将 Date 或 ISO 字符串格式化为 YYYY-MM-DD HH:mm:ss。
 * @param {Date|string|number} input 时间输入
 * @returns {string}
 */
export function formatDateTime(input) {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
