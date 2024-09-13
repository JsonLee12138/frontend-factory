import { ArrTransformFormat, FlatEachOptions, FlatFilterByChildrenOptions, GroupOptions, KeyConfig } from '@/types/arr';
import { AnyObject, PropertyKey } from '@/types/global';
import { cloneDeep } from 'lodash-es';
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
 * @param {Record<string, string | function(S): any>} format - The mapping object that defines the key transformation from source to target.
 * The keys represent the target object's keys, and the values represent either a string (indicating the key in the source object)
 * or a function to transform the value.
 * @param {Record<string, string | function(S): any>} format - 定义从源到目标的键转换的映射对象。
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
export const arrTransform = <S extends AnyObject = AnyObject, T extends AnyObject = AnyObject>(
  data: S[],
  format: ArrTransformFormat<S>,
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
          } else {
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

/**
 * Groups an array of objects by a specified key, and allows the use of either a WeakMap or a Map depending on the `keyIsObject` flag.
 * 根据指定的键对对象数组进行分组，并允许根据 `keyIsObject` 标志使用 WeakMap 或 Map。
 *
 * @template T - The type of objects in the data array.
 * @template T - 数据数组中对象的类型。
 *
 * @template K - The type of the keys when using a WeakMap (must be an object).
 * @template K - 使用 WeakMap 时的键的类型（必须是对象）。
 *
 * @param {T[]} data - The array of objects to group.
 * @param {T[]} data - 要分组的对象数组。
 *
 * @param {Object} [options] - Options for grouping the objects.
 * @param {Object} [options] - 对象分组的选项。
 *
 * @param {string} [options.groupBy='group'] - The key by which to group the objects.
 * @param {string} [options.groupBy='group'] - 用于对对象进行分组的键。
 *
 * @param {boolean} [options.keyIsObject=false] - If `true`, groups will be stored in a WeakMap with object keys, otherwise in a Map with primitive keys.
 * @param {boolean} [options.keyIsObject=false] - 如果为 `true`，分组将存储在带有对象键的 WeakMap 中，否则存储在带有原始类型键的 Map 中。
 *
 * @returns {WeakMap<K, T[]> | Map<PropertyKey, T[]>} - A WeakMap or Map where each key is a group value and the value is an array of objects in that group.
 * @returns {WeakMap<K, T[]> | Map<PropertyKey, T[]>} - 一个 WeakMap 或 Map，每个键是一个分组的值，值是该分组中的对象数组。
 */
export const group = <T extends AnyObject, K extends object = AnyObject>(data: T[], { groupBy = 'group', keyIsObject = false }: GroupOptions = {}): WeakMap<K, T[]> | Map<PropertyKey, T[]> => {
  let groups: WeakMap<K, T[]> | Map<PropertyKey, T[]>;
  if (keyIsObject) {
    groups = new WeakMap<K, T[]>();
  } else {
    groups = new Map<PropertyKey, T[]>();
  }
  for (const item of data) {
    const group = item[groupBy] as never;
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)?.push(item);
  }
  return groups;
}

/**
 * Recursively iterates over an array of objects, calling a callback for each item.
 * If the callback returns `true`, the iteration is stopped (similar to `break`).
 * 可以递归地遍历对象数组，并为每个项调用回调函数。
 * 如果回调返回 `true`，则停止遍历（类似于 `break`）。
 *
 * @template T - The type of objects in the array.
 * @template T - 数组中对象的类型。
 *
 * @param {T[]} data - The array of objects to iterate over.
 * @param {T[]} data - 要遍历的对象数组。
 *
 * @param {function} callback - A function called for each item. If it returns `true`, the iteration stops.
 * @param {function} callback - 为每个项调用的函数。如果返回 `true`，遍历停止。
 *
 * @param {boolean|void} callback.item - The current item being processed.
 * @param {boolean|void} callback.item - 当前处理的项。
 *
 * @param {Object} options - Options to control the behavior of the iteration.
 * @param {Object} options - 控制迭代行为的选项。
 *
 * @param {string} [options.childrenKey='children'] - The key used to access child nodes in the objects.
 * @param {string} [options.childrenKey='children'] - 用于访问对象中子节点的键名。
 *
 * @returns {boolean} Returns `true` if the callback returned `true` for any item, otherwise `false`.
 * @returns {boolean} 如果回调函数对某一项返回 `true`，则返回 `true`，否则返回 `false`。
 */
export const flatEach = <T extends AnyObject>(data: T[], callback: (item: T) => boolean | void, options: FlatEachOptions = {} as FlatEachOptions): boolean => {
  const { childrenKey = 'children' } = options;
  for (const item of data) {
    const result = callback(item);
    if (result) {
      return true;
    }
    if (Array.isArray(item[childrenKey]) && item[childrenKey].length) {
      const childResult = flatEach(item[childrenKey], callback, options);
      if (childResult) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Recursively filters an array of objects based on a callback, optionally filtering their children.
 * 可以递归地根据回调函数过滤对象数组，选择性地过滤它们的子节点。
 *
 * @template T - The type of objects in the array.
 * @template T - 数组中对象的类型。
 *
 * @param {T[]} data - The array of objects to filter.
 * @param {T[]} data - 要过滤的对象数组。
 *
 * @param {function} callback - A function called for each item to determine if it should be included.
 * @param {function} callback - 为每个项调用的函数，决定其是否应被包括在结果中。
 *
 * @param {boolean} callback.item - The current item being processed.
 * @param {boolean} callback.item - 当前处理的项。
 *
 * @param {Object} options - Options to control the behavior of the filtering.
 * @param {Object} options - 控制过滤行为的选项。
 *
 * @param {string} [options.childrenKey='children'] - The key used to access child nodes in the objects.
 * @param {string} [options.childrenKey='children'] - 用于访问对象中子节点的键名。
 *
 * @param {boolean} [options.deep] - Whether to apply filtering recursively to the children.
 * @param {boolean} [options.deep] - 是否递归地对子节点应用过滤。
 *
 * @returns {T[]} Returns a new array of filtered objects, including any filtered children.
 * @returns {T[]} 返回过滤后的对象数组，包括任何被过滤的子节点。
 */
export const flatFilterByChildren = <T extends AnyObject>(data: T[], callback: (item: T) => boolean, options: FlatFilterByChildrenOptions = {}): T[] => {
  const { childrenKey = 'children', deep } = options;
  const result: T[] = [];
  for (const item of data) {
    let flattenChildren: T[] = [];
    if (deep && Array.isArray(item[childrenKey]) && item[childrenKey].length) {
      flattenChildren = flatFilterByChildren(item[childrenKey], callback, options);
    }
    if (callback(item) || flattenChildren.length) {
      const newItem = cloneDeep(item) as AnyObject;
      if (flattenChildren.length) {
        newItem[childrenKey] = flattenChildren;
      }
      result.push(newItem);
    }
  }
  return result;
}
