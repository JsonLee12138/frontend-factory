import { get } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string | number | symbol, any>;

type KeyConfig = {
  source: string;
  target: string;
};

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
 * @param {AnyObject} format - The mapping object that defines the key transformation from source to target.
 * The keys represent the target object's keys, and the values represent the corresponding keys in the source object.
 * @param {AnyObject} format - 定义从源到目标的键转换的映射对象。
 * 键表示目标对象的键名，值表示源对象中对应的键名。
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
  format: AnyObject,
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
          continue;
        }
        const value = get(item, sourceKey);
        if (deep && sourceKey === childrenKey.source && value && value.length) {
          resItem[childrenKey.target] = arrTransform<S, T>(
            value,
            format,
            deep,
            childrenKey,
          );
          continue;
        }
        resItem[targetKey] = value;
      }
    }
    return resItem as T;
  });
};

export const arrPick = <T extends Record<string, unknown>>(
  data: T[],
  keys: string[],
) => {
  return data.map((item) => {
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      result[key] = item[key];
    }
    return result;
  });
};

export const arrOmit = <T extends Record<string, unknown>>(
  data: T[],
  keys: string[],
) => {
  return data.map((item) => {
    const result: Record<string, unknown> = {};
    for (const key in item) {
      if (!keys.includes(key)) {
        result[key] = item[key];
      }
    }
    return result;
  });
};

export const arrFlatten = <T>(arr: T[], options = {}): T[] => {
  const { childrenKey = 'children', keepChildren = true } = options;
  if (!Array.isArray(arr)) {
    return [arr];
  }
  return arr.flatMap((item) => {
    if (Array.isArray(item)) {
      return arrFlatten(item);
    }
    if (
      item[childrenKey] &&
      Array.isArray(item.children) &&
      item.children.length
    ) {
      const { children, ...rest } = item;
      return [
        keepChildren ? item : rest,
        ...arrFlatten(item.children, options),
      ];
    }
    return item;
  });
};
