import { createContext, useContext } from 'react';
import type { ProTableContextState } from '@/types/protable';

export const context = createContext<ProTableContextState | undefined>(
  undefined,
);

export const useProTableContext = () => {
  const _context = useContext<ProTableContextState | undefined>(context);
  return _context;
};
