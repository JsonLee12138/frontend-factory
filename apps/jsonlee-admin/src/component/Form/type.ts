import { FormRule } from 'antd';
import { ReactNode } from 'react';

export interface FormInstance {
  submit: () => void;
  reset: () => void;
  setFieldsValue: (values: Record<string, any>) => void;
}

export type FormFieldType = 'input' | 'select' | 'switch' | 'radio' | 'datePicker' | 'inputNumber';

export interface FormFieldItem {
  rules?: FormRule[];
  component?: (value?: any, onChange?: (value: any) => void) => ReactNode;
  label: string;
  type?: FormFieldType;
  name?: string;
  inputProps?: any;
  col?: number;
  value?: any;
  onChange?: (value: any) => void;
}
