import type { IIconAllProps, IconType } from '@icon-park/react/es/all';

export interface IconParkProps extends Omit<IIconAllProps, 'type'> {
  name: IconType | (string & {});
  cusLoad?: boolean;
}

export interface IconParkInstance extends Element {
  load: () => void;
}
