export interface EditModalRef {
  open: (title: string, record?: any) => void;
  close: () => void;
}
