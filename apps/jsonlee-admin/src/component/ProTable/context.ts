import { createContext, useContext } from 'react';
import { ProTableContextState } from './types';

export const context = createContext<ProTableContextState | undefined>(
  undefined,
);

export const useProTableContext = () => {
  const _context = useContext<ProTableContextState | undefined>(context);
  return _context;
};
