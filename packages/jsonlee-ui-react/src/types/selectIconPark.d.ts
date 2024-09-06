import type { DialogInstance, DialogProps } from './dialog';

export interface SelectIconParkProps extends DialogProps {
  onChange?: (key:string) => void;
  value?: string;
  showSearch?: boolean;
  placeholder?: string;
}

export interface SelectIconInstance extends DialogInstance {

}
