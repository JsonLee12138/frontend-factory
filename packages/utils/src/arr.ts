import { KeyConfig } from '@/types/arr';
import { AnyObject } from '@/types/global';
import get from 'lodash-es/get';

/**
 * Transforms an array of objects from one format to another based on a provided mapping.
 * 根据提供的映射，将一个对象数组从一种格式转换为另一种格式。
 *
 * @template S - The type of the source objects in the input array.
 * @template S - 输入数组中源对象的类型。
 *
 * @template T - The type of the transformed objects in the output array.
 * @template T - 输出数组中转换后的对象类型。
 *
 * @param {S[]} data - The array of source objects to be transformed.
 * @param {S[]} data - 要转换的源对象数组。
 *
 * @param {Record<string, string | function(T): any>} format - The mapping object that defines the key transformation from source to target.
 * The keys represent the target object's keys, and the values represent either a string (indicating the key in the source object)
 * or a function to transform the value.
 * @param {Record<string, string | function(T): any>} format - 定义从源到目标的键转换的映射对象。
 * 键表示目标对象的键名，值可以是一个字符串（表示源对象中的键名）或一个函数用于转换值。
 *
 * @param {boolean} [deep=false] - Whether to perform deep transformation on nested objects specified by the childrenKey.
 * @param {boolean} [deep=false] - 是否对由 childrenKey 指定的嵌套对象执行深度转换。
 *
 * @param {KeyConfig} [childrenKey={source: 'children', target: 'children'}] - The key configuration for handling nested objects.
 * @param {KeyConfig} [childrenKey={source: 'children', target: 'children'}] - 用于处理嵌套对象的键配置。
 *
 * @returns {T[]} - The transformed array of objects in the new format.
 * @returns {T[]} - 转换后的新格式的对象数组。
 */
export const arrTransform = <S extends AnyObject, T extends AnyObject>(
  data: S[],
  format: Record<string, string | ((item: T) => any)>,
  deep?: boolean,
  childrenKey: KeyConfig = {
    source: 'children',
    target: 'children',
  },
): T[] => {
  return data.map((item) => {
    const resItem: AnyObject = {};
    for (const targetKey in format) {
      if (Object.prototype.hasOwnProperty.call(format, targetKey)) {
        const sourceKey = format[targetKey];
        if (typeof sourceKey === 'function') {
          resItem[targetKey] = sourceKey(item);
        } else {
          const value = get(item, sourceKey);
          if (deep && sourceKey === childrenKey.source && value && value.length) {
            resItem[childrenKey.target] = arrTransform<S, T>(
              value,
              format,
              deep,
              childrenKey,
            );
          }else{
            resItem[targetKey] = value;
          }
        }
      }
    }
    return resItem as T;
  });
};

/**
 * Picks specified keys from an array of objects and returns a new array of objects with only those keys.
 * 从对象数组中选择指定的键，并返回仅包含这些键的新对象数组。
 *
 * @template T
 * @param {T[]} data - Array of objects to pick keys from.
 * @param {T[]} data - 要从中选择键的对象数组。
 *
 * @param {string[]} keys - Array of keys to pick from each object.
 * @param {string[]} keys - 要从每个对象中选择的键数组。
 *
 * @returns {Array<AnyObject>} A new array of objects containing only the specified keys.
 * @returns {Array<AnyObject>} 一个新的对象数组，其中仅包含指定的键。
 */
export const arrPick = <T extends AnyObject>(
  data: T[],
  keys: string[],
) => {
  return data.map((item) => {
    const result: AnyObject = {};
    for (const key of keys) {
      result[key] = item[key];
    }
    return result;
  });
};

/**
 * Omits specified keys from an array of objects and returns a new array of objects without those keys.
 * 从对象数组中省略指定的键，并返回不包含这些键的新对象数组。
 *
 * @template T
 * @param {T[]} data - Array of objects to omit keys from.
 * @param {T[]} data - 要从中省略键的对象数组。
 *
 * @param {string[]} keys - Array of keys to omit from each object.
 * @param {string[]} keys - 要从每个对象中省略的键数组。
 *
 * @returns {Array<AnyObject>} A new array of objects excluding the specified keys.
 * @returns {Array<AnyObject>} 一个新的对象数组，不包含指定的键。
 */
export const arrOmit = <T extends AnyObject>(
  data: T[],
  keys: string[],
) => {
  return data.map((item) => {
    const result: AnyObject = {};
    for (const key in item) {
      if (!keys.includes(key)) {
        result[key] = item[key];
      }
    }
    return result;
  });
};
