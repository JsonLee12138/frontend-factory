import _camelCase from 'lodash-es/camelCase';

/**
 * Converts a string to camelCase format, with an option to capitalize the first letter.
 * 将字符串转换为驼峰格式，并可以选择将首字母大写。
 *
 * @param {string} str - The string to convert.
 * @param {string} str - 要转换的字符串。
 *
 * @param {boolean} [upper=false] - Whether to capitalize the first letter of the resulting string.
 * @param {boolean} [upper=false] - 是否将结果字符串的首字母大写。
 *
 * @returns {string} The camelCase formatted string, optionally with a capitalized first letter.
 * @returns {string} 返回驼峰格式的字符串，可选择首字母大写。
 */
export const camelCase = (str: string, upper: boolean = false) => {
  const res = _camelCase(str);
  return upper ? res.charAt(0).toUpperCase() + res.slice(1) : res;
};
