import { useLayoutEffect, useRef } from 'react';
import { TooltipBarProps } from '@/types/protable';
import { useBoolean } from 'ahooks';
import { Tooltip } from 'antd';

export const TooltipCol = ({ text }: TooltipBarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tooltipDisabled, setTooltipDisabled] = useBoolean(false);
  useLayoutEffect(() => {
    if (ref.current) {
      const { scrollWidth, clientWidth } = ref.current;
      setTooltipDisabled.set(scrollWidth <= clientWidth);
    }
  }, []);
  return (
    <Tooltip title={tooltipDisabled ? '' : text}>
      <div
        ref={ref}
        className={'overflow-hidden text-ellipsis whitespace-nowrap'}
      >
        {text}
      </div>
    </Tooltip>
  );
};
