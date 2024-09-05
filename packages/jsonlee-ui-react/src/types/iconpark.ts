import type { IIconAllProps } from '@icon-park/react/es/all';

export interface IconParkProps extends Omit<IIconAllProps, 'type'> {
  name: string;
  cusLoad?: boolean;
}

export interface IconParkInstance extends Element {
  load: () => void;
}
