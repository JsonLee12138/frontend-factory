import { FormRule } from "antd";
import { ReactNode } from "react";

export interface FormInstance {
  submit: () => void;
  reset: () => void;
}

export type FormFieldType = 'input' | 'select' | 'switch' | 'radio' | 'datePicker' | 'inputNumber';

export interface FormFieldItem {
  rules?: FormRule[];
  component?: ReactNode;
  label: string;
  type?: FormFieldType;
  name?: string;
  inputProps?: any;
  col?: number;
}
