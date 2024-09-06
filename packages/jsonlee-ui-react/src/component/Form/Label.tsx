import { Tooltip } from 'antd';
import { LabelProps } from '@/types/form';
import Icon from '../IconPark';

const Label = ({ label, warning }: LabelProps) => {
  return (
    <span>
      {label}
      {warning && (
        <Tooltip title={warning}>
          <Icon
            className={'ml-1.5 cursor-pointer'}
            name="help"
            theme={'filled'}
          />
        </Tooltip>
      )}
    </span>
  );
};

export default Label;
