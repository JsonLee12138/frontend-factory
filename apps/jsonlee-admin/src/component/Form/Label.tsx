import { Tooltip } from 'antd';
import { LabelProps } from './type';
import Icon from '../Icon';

const Label = ({ label, warning }: LabelProps) => {
  return (
    <span>
      {label}
      {warning && (
        <Tooltip title={warning} trigger={'hover'}>
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
