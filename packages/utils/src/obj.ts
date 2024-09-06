import { AnyObject } from '@/types/global';

/**
 * Omits specified keys from an object and returns a new object without those keys.
 * 从对象中省略指定的键，并返回不包含这些键的新对象。
 *
 * @template T
 * @param {T} data - The object to omit keys from.
 * @param {T} data - 要从中省略键的对象。
 *
 * @param {(keyof T)[]} keys - Array of keys to omit from the object.
 * @param {(keyof T)[]} keys - 要从对象中省略的键数组。
 *
 * @returns {Omit<T, (typeof keys)[number]>} A new object excluding the specified keys.
 * @returns {Omit<T, (typeof keys)[number]>} 一个新的对象，不包含指定的键。
 */
export const objOmit = <T extends AnyObject>(
  data: T,
  keys: (keyof T)[],
): Omit<T, (typeof keys)[number]> => {
  const res: AnyObject = {};
  for (const sourceKey in data) {
    if (Object.prototype.hasOwnProperty.call(data, sourceKey)) {
      if (!keys.includes(sourceKey)) {
        res[sourceKey] = data[sourceKey];
      }
    }
  }
  return res as Omit<T, (typeof keys)[number]>;
};

/**
 * Picks specified keys from an object and returns a new object with only those keys.
 * 从对象中选择指定的键，并返回仅包含这些键的新对象。
 *
 * @template T
 * @param {T} data - The object to pick keys from.
 * @param {T} data - 要从中选择键的对象。
 *
 * @param {(keyof T)[]} keys - Array of keys to pick from the object.
 * @param {(keyof T)[]} keys - 要从对象中选择的键数组。
 *
 * @returns {Pick<T, (typeof keys)[number]>} A new object containing only the specified keys.
 * @returns {Pick<T, (typeof keys)[number]>} 一个新的对象，其中仅包含指定的键。
 */
export const objPick = <T extends AnyObject>(
  data: T,
  keys: (keyof T)[],
): Pick<T, (typeof keys)[number]> => {
  const res: AnyObject = {};
  for (const sourceKey in data) {
    if (Object.prototype.hasOwnProperty.call(data, sourceKey)) {
      if (keys.includes(sourceKey)) {
        res[sourceKey] = data[sourceKey];
      }
    }
  }
  return res as Pick<T, (typeof keys)[number]>;
};
