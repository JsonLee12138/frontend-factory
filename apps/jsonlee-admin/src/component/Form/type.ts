import type {
  DatePickerProps,
  FormProps as AFormProps,
  FormRule,
  InputProps,
  RowProps,
  SwitchProps,
  InputNumberProps,
} from 'antd';
import { ReactNode } from 'react';
import { TreeSelectProps } from '@/component/TreeSelect/type';
import { AnyObject } from '@/types/global';

export interface FormInstance<T = AnyObject> {
  submit: () => void;
  reset: () => void;
  setFieldsValue: (values: T) => void;
}

export type FormFieldType =
  | 'text'
  | 'select'
  | 'switch'
  | 'radio'
  | 'datePicker'
  | 'inputNumber'
  | 'password'
  | 'textarea';

export interface FieldBase {
  placeholder?: string;
  width?: number | string;
}

export type FieldText = FieldBase & InputProps;
export type FieldSelect = FieldBase & unknown;
export type FieldTreeSelect = FieldBase & TreeSelectProps;
export type FieldDate = FieldBase & DatePickerProps;
export type FieldSwitch = FieldBase & SwitchProps;

export type FieldProps<T extends FormFieldType = 'text'> = T extends 'text'
  ? FieldText
  : T extends 'select'
    ? FieldSelect
    : T extends 'treeSelect'
      ? FieldTreeSelect
      : T extends 'datePicker'
        ? FieldDate
        : T extends 'switch'
          ? FieldSwitch
          : T extends 'inputNumber'
            ? InputNumberProps
            : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormFieldItem<T = any, Type extends FormFieldType = 'text'> {
  rules?: FormRule[];
  component?: (value?: T, onChange?: (value: T) => void) => ReactNode;
  label?: ReactNode;
  warning?: ReactNode;
  type?: FormFieldType;
  name?: string;
  inputProps?: FieldProps<Type>;
  col?: number;
  value?: T;
  onChange?: (value: T) => void;
  uniqueKey?: string;
}

export interface FormProps extends Omit<AFormProps, 'fields' | 'onFinish'> {
  gutter?: RowProps['gutter'];
  fields: FormFieldItem[];
  fieldMinWidth?: number;
  onSubmit?: AFormProps['onFinish'];
}

export type LabelProps = Pick<FormFieldItem, 'label' | 'warning'>;
