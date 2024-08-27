import { get } from "lodash";

type KeyConfig = {
  source: string;
  target: string;
}

export const arrTransform = <S extends Record<string, any>, T extends Record<string, any>>(data: S[], format: Record<string, any>, deep?: boolean, childrenKey: KeyConfig = {
  source: 'children',
  target: 'children'
}): T[] => {
  return data.map(item => {
    const resItem: Record<string, any> = {};
    for (const targetKey in format) {
      if (Object.prototype.hasOwnProperty.call(format, targetKey)) {
        const sourceKey = format[targetKey];
        const value = get(item, sourceKey);
        if (deep && sourceKey === childrenKey.source && value && value.length) {
          resItem[childrenKey.target] = arrTransform<S, T>(value, format, deep, childrenKey);
          continue;
        }
        resItem[targetKey] = value;
      }
    }
    return resItem as T;
  })
}

export const arrPick = <T extends Record<string, unknown>>(data: T[], keys: string[]) => {
  return data.map(item => {
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      result[key] = item[key];
    }
    return result;
  });
};

export const arrOmit = <T extends Record<string, unknown>>(data: T[], keys: string[]) => {
  return data.map(item => {
    const result: Record<string, unknown> = {};
    for (const key in item) {
      if (!keys.includes(key)) {
        result[key] = item[key];
      }
    }
    return result;
  });
};
