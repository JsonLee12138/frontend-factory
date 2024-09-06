import { Space } from 'antd';
import type { ButtonsProps } from '@/types/protable';

const Buttons = ({ buttons }: ButtonsProps) => {
  if (!buttons || !buttons.length) return <div></div>;
  return <Space className={'pb-3'}>{buttons}</Space>;
};

export default Buttons;
