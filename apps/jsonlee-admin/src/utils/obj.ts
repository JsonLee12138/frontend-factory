import { AnyObject } from '@/types/global';

type KeyConfig = {
  source: string;
  target: string;
};

/**
 *
 * @param data source data array
 * @param format {targetKey: sourceKey}
 * @param deep whether to format the children
 * @param childrenKey {source: 'children', target: 'children'}
 * @returns
 */
export const obj = <S extends AnyObject[], T extends AnyObject>(
  data: S,
  format: Record<string, string>,
  deep?: boolean,
  childrenKey: KeyConfig = {
    source: 'children',
    target: 'children',
  },
): T[] => {
  return data.map((item) => {
    const res: AnyObject = { ...item };
    const targetKeys = Object.keys(format);
    for (let i = 0, len = targetKeys.length; i < len; i++) {
      const targetKey = targetKeys[i];
      const sourceKey = format[targetKey];
      if (
        deep &&
        sourceKey === childrenKey.source &&
        item[childrenKey.source] &&
        item[childrenKey.source].length
      ) {
        res[childrenKey.target] = obj(
          item[childrenKey.source],
          format,
          deep,
          childrenKey,
        );
        continue;
      }
      res[targetKey] = item[sourceKey];
    }
    return res as T;
  });
};

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
