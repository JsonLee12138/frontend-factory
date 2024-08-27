type KeyConfig = {
  source: string;
  target: string;
}

/**
 *
 * @param data source data array
 * @param format {targetKey: sourceKey}
 * @param deep whether to format the children
 * @param childrenKey {source: 'children', target: 'children'}
 * @returns
 */
export const obj = <S extends Record<string, any>[], T extends Record<string, any>>(data: S, format: Record<string, string>, deep?: boolean, childrenKey: KeyConfig = {
  source: 'children',
  target: 'children',
}): T[] => {
  return data.map((item) => {
    const obj: Record<string, any> = { ...item };
    const targetKeys = Object.keys(format);
    for (let i = 0, len = targetKeys.length; i < len; i++) {
      const targetKey = targetKeys[i];
      const sourceKey = format[targetKey];
      if (deep && sourceKey === childrenKey.source && item[childrenKey.source] && item[childrenKey.source].length > 0) {
        obj[childrenKey.target] = obj(item[childrenKey.source], format, deep, childrenKey);
        continue;
      }
      obj[targetKey] = item[sourceKey];
    }
    return obj as T;
  });
}

export const objOmit = <T extends Record<string, any>>(data: T, keys: (keyof T)[]): Omit<T, typeof keys[number]> => {
  const res: Record<string, any> = {};
  for (const sourceKey in data) {
    if (data.hasOwnProperty(sourceKey)) {
      if (!keys.includes(sourceKey)) {
        res[sourceKey] = data[sourceKey];
      }
    }
  }
  return res as Omit<T, typeof keys[number]>;
}

export const objPick = <T extends Record<string, any>>(data: T, keys: (keyof T)[]): Pick<T, typeof keys[number]> => {
  const res: Record<string, any> = {};
  for (const sourceKey in data) {
    if (data.hasOwnProperty(sourceKey)) {
      if (keys.includes(sourceKey)) {
        res[sourceKey] = data[sourceKey];
      }
    }
  }
  return res as Pick<T, typeof keys[number]>;
}
