import { AnyObject } from "@/types/global";
import { TreeBindingOptions, TreeFlattenOptions } from "@/types/tree";
import cloneDeep from 'lodash-es/cloneDeep';

/**
 * Binds a flat array of objects into a tree structure based on parent-child relationships.
 * 根据父子关系将平面对象数组绑定为树形结构。
 *
 * @template T
 * @param {T[]} data - The flat array of objects to be transformed into a tree structure.
 * @param {T[]} data - 要转换为树形结构的平面对象数组。
 *
 * @param {Object} [options] - Optional configuration for key names.
 * @param {Object} [options] - 可选的键名配置。
 *
 * @param {string} [options.idKey='id'] - The key used to identify each node's unique ID.
 * @param {string} [options.idKey='id'] - 用于标识每个节点唯一 ID 的键。
 *
 * @param {string} [options.parentKey='parentId'] - The key used to identify each node's parent ID.
 * @param {string} [options.parentKey='parentId'] - 用于标识每个节点父级 ID 的键。
 *
 * @param {string} [options.childrenKey='children'] - The key used to store each node's children.
 * @param {string} [options.childrenKey='children'] - 用于存储每个节点子节点的键。
 *
 * @returns {T[]} A tree-structured array of objects, where parent nodes contain their child nodes.
 * @returns {T[]} 树形结构的对象数组，其中父节点包含它们的子节点。
 */
export const treeBind = <T extends object>(
  data: T[],
  {
    idKey = 'id',
    parentKey = 'parentId',
    childrenKey = 'children',
  }: Partial<TreeBindingOptions> = {},
) => {
  const treeData: T[] = [];
  const newData = cloneDeep(data);
  const map = new Map();
  newData.forEach((item) => {
    map.set((item as AnyObject)[idKey], item);
  });
  newData.forEach((item) => {
    const parent = map.get((item as AnyObject)[parentKey]);
    if (parent) {
      (parent[childrenKey] || (parent[childrenKey] = [])).push(item);
    } else {
      treeData.push(item);
    }
  });
  return treeData;
};

/**
 * Omits specified keys from a tree structure of objects and returns a new tree with those keys removed.
 * 从对象的树结构中省略指定的键，并返回不包含这些键的新树结构。
 *
 * @template T
 * @param {T[]} data - The tree-structured array of objects to omit keys from.
 * @param {T[]} data - 要从中省略键的树形结构对象数组。
 *
 * @param {string[]} keys - Array of keys to omit from each object in the tree.
 * @param {string[]} keys - 要从树中每个对象中省略的键数组。
 *
 * @param {Object} [options] - Optional configuration for the children key.
 * @param {Object} [options] - 可选的子节点键配置。
 *
 * @param {string} [options.childrenKey='children'] - The key used to identify child nodes in the tree.
 * @param {string} [options.childrenKey='children'] - 用于标识树中子节点的键。
 *
 * @returns {T[]} A new tree-structured array of objects excluding the specified keys.
 * @returns {T[]} 一个新的树形结构对象数组，不包含指定的键。
 */
export const treeOmit = <T extends AnyObject>(
  data: T[],
  keys: string[],
  options: Pick<TreeBindingOptions, 'childrenKey'> = { childrenKey: 'children' }
) => {
  const { childrenKey = 'children' } = options;
  return data.map((item) => {
    const result: AnyObject = {};
    for (const key in item) {
      if (!keys.includes(key)) {
        result[key] = item[key];
      }
    }
    if (item[childrenKey]) {
      result[childrenKey] = treeOmit(item[childrenKey] as T[], keys, options);
    }
    return result;
  });
};

/**
 * Flattens a tree structure into a one-dimensional array.
 * 将树结构展平成一维数组。
 *
 * @template T - The type of the objects in the tree.
 * @template T - 树中对象的类型。
 *
 * @param {T[]} data - The tree data to flatten.
 * @param {T[]} data - 要展开的树数据。
 *
 * @param {Object} [options] - Options to configure the flattening process.
 * @param {Object} [options] - 配置展开过程的选项。
 *
 * @param {string} [options.childrenKey='children'] - The key used to identify children nodes in the tree structure.
 * @param {string} [options.childrenKey='children'] - 用于标识树结构中子节点的键。
 *
 * @param {boolean} [options.keepChildren=false] - Whether to keep the children key in the flattened items.
 * @param {boolean} [options.keepChildren=false] - 是否在展平的项中保留 children 键。
 *
 * @returns {T[]} - The flattened array of tree nodes.
 * @returns {T[]} - 展平后的树节点数组。
 */
export const treeFlatten = <T extends AnyObject<string>>(data: T[], options: Partial<TreeFlattenOptions> = {}): T[] => {
  const { childrenKey = 'children', keepChildren = false } = options;
  if (!Array.isArray(data)) {
    return data;
  }
  return data.flatMap(item => {
    if (Array.isArray(item)) {
      return treeFlatten(item, options);
    }
    const children = item[childrenKey];
    if (Array.isArray(children) && children.length) {
      const _item: AnyObject<string> = { ...item };
      const flattenedChildren = treeFlatten(children, options);
      if (!keepChildren) {
        delete _item[childrenKey];
      }else{
        _item[childrenKey] = flattenedChildren;
      }
      return [_item, ...flattenedChildren];
    }
    return item;
  });
}
