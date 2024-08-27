import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Form as AForm, Input, InputNumber, Row, Select, Switch } from 'antd';
import type { FormInstance, FormProps, FormRule, RowProps } from 'antd';
import emitter from '@/utils/emitter.ts';
import { EmitterEvents } from '@/enum/emitter.ts';
import { FormFieldItem } from './type';

interface Props extends Omit<FormProps, 'fields' | 'onFinish'> {
  gutter?: RowProps['gutter'];
  fields: FormFieldItem[];
  fieldMinWidth?: number;
  onSubmit?: FormProps['onFinish']
}

const Field = (props: FormFieldItem) => {
  const inputProps = props.inputProps || {};
  switch (props.type) {
    case 'input':
      return <Input {...inputProps} />;
    case 'inputNumber':
      return <InputNumber {...inputProps} />;
    case 'select':
      return <Select {...inputProps} />;
    case 'switch':
      return <Switch {...inputProps} />
    default:
      if (!props.component) return <Input {...inputProps} />;
      return props.component;
  }
};

const Form = forwardRef(
  (
    { layout, fieldMinWidth, gutter, fields, colon, labelAlign, onSubmit }: Props,
    ref,
  ) => {
    const [wrapWidth, setWrapWidth] = useState<number>(0);
    const formRef = useRef<FormInstance & { nativeElement: HTMLDivElement }>();
    const fieldSpan = useMemo(() => {
      const defaultMinWidth = !layout || layout === 'horizontal' ? 280 : 200;
      const minWidth = fieldMinWidth || defaultMinWidth;
      if (!wrapWidth) return 24;
      const cols = Math.floor(wrapWidth / minWidth);
      if (cols < 1) return 24;
      const span = Math.ceil(24 / cols);
      return Math.min(Math.max(span, 1), 24);
    }, [wrapWidth, layout]);
    const submit = useCallback(() => {
      formRef.current?.submit();
      // const valid = await formRef.current?.validateFields();
      // if(valid){

      // }
    }, [formRef]);
    const reset = useCallback(()=> {
      formRef.current?.resetFields();
    }, [])
    useImperativeHandle(
      ref,
      () => ({
        submit,
        reset
      }),
      [],
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
      <AForm ref={formRef as any} layout={layout} onFinish={onSubmit}>
        <Row gutter={gutter ?? 16}>
          {fields.map((field) => {
            const col = field.col || 1;
            return (
              <Col span={fieldSpan * col} key={field.name}>
                <AForm.Item
                  name={field.name}
                  rules={field.rules}
                  label={field.label}
                  colon={colon}
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
