export interface TreeBindingOptions {
  idKey: string;
  parentKey: string;
  childrenKey: string;
}

export const treeBind = <T extends object>(
  data: T[],
  {
    idKey = 'id',
    parentKey = 'parentId',
    childrenKey = 'children',
  }: Partial<TreeBindingOptions> = {},
) => {
  const treeData: T[] = [];
  const map = new Map();
  data.forEach((item) => {
    map.set((item as Record<string, unknown>)[idKey], item);
  });
  data.forEach((item) => {
    const parent = map.get((item as Record<string, unknown>)[parentKey]);
    if (parent) {
      (parent[childrenKey] || (parent[childrenKey] = [])).push(item);
    } else {
      treeData.push(item);
    }
  });
  return treeData;
};

export const treeOmit = <T extends Record<string, unknown>>(
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
    if (item.children) {
      result.children = treeOmit(item.children as T[], keys);
    }
    return result;
  });
};
