import {
  ChangeEventHandler,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Col,
  Form as AForm,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
} from 'antd';
import type {
  FormInstance,
  InputNumberProps,
  SelectProps,
  SwitchProps,
} from 'antd';
import emitter from '@/utils/emitter';
import { EmitterEvents } from '@/enum/emitter';
import type { FormFieldItem, FormProps } from './type';
import Label from './Label';

const Field = ({ value, onChange, ...props }: FormFieldItem) => {
  const inputProps = props.inputProps || {};
  switch (props.type) {
    case 'text':
      return (
        <Input
          value={value as string}
          onChange={onChange as unknown as ChangeEventHandler<HTMLInputElement>}
          {...inputProps}
        />
      );
    case 'inputNumber':
      return (
        <InputNumber
          value={value}
          onChange={onChange}
          {...(inputProps as InputNumberProps)}
        />
      );
    case 'select':
      return (
        <Select
          value={value}
          onChange={onChange}
          {...(inputProps as SelectProps)}
        />
      );
    case 'switch':
      return (
        <Switch
          value={value}
          onChange={onChange}
          {...(inputProps as SwitchProps)}
        />
      );
    default:
      if (!props.component)
        return <Input value={value} onChange={onChange} {...inputProps} />;
      return props.component(value, onChange);
  }
};

const Form = forwardRef(
  (
    {
      layout = 'horizontal',
      fieldMinWidth,
      gutter = 16,
      scrollToFirstError = true,
      fields,
      colon,
      labelAlign,
      onSubmit,
      ...props
    }: FormProps,
    ref,
  ) => {
    const [wrapWidth, setWrapWidth] = useState<number>(0);
    const formRef = useRef<FormInstance & { nativeElement: HTMLDivElement }>();
    const fieldSpan = useMemo(() => {
      const defaultMinWidth = layout === 'horizontal' ? 280 : 200;
      const minWidth = fieldMinWidth || defaultMinWidth;
      if (!wrapWidth) return 24;
      const cols = Math.floor(wrapWidth / minWidth);
      if (cols < 1) return 24;
      const span = Math.ceil(24 / cols);
      return Math.min(Math.max(span, 1), 24);
    }, [layout, fieldMinWidth, wrapWidth]);
    const submit = useCallback(() => {
      formRef.current?.submit();
    }, [formRef]);
    useImperativeHandle(
      ref,
      () => ({
        submit,
        reset: formRef.current?.resetFields,
        setFieldsValue: formRef.current?.setFieldsValue,
      }),
      [submit],
    );
    useEffect(() => {
      requestAnimationFrame(() => {
        setWrapWidth(formRef.current?.nativeElement.clientWidth || 0);
      });
      emitter.on(EmitterEvents.RESIZE, () => {
        setWrapWidth(formRef.current?.nativeElement.clientWidth || 0);
      });
      return () => {
        emitter.off(EmitterEvents.RESIZE);
      };
    }, []);
    return (
      <AForm
        {...props}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={formRef as any}
        scrollToFirstError={scrollToFirstError}
        layout={layout}
        onFinish={onSubmit}
      >
        <Row gutter={gutter}>
          {fields.map((field) => {
            const col = field.col || 1;
            const span = Math.min(Math.max(Math.ceil(fieldSpan * col), 1), 24);
            return (
              <Col span={span} key={field.name || field.uniqueKey}>
                <AForm.Item
                  name={field.name}
                  rules={field.rules}
                  label={<Label label={field.label} warning={field.warning} />}
                  colon={typeof field.colon === 'boolean' ? field.colon : colon}
                  labelAlign={labelAlign}
                >
                  <Field {...field} />
                </AForm.Item>
              </Col>
            );
          })}
        </Row>
      </AForm>
    );
  },
);

export default Form;
