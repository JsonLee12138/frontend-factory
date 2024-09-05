import { camelCase as _camelCase } from 'lodash';

export const camelCase = (str: string, upper: boolean = false) => {
  const res = _camelCase(str);
  return upper ? res.charAt(0).toUpperCase() + res.slice(1) : res;
};
