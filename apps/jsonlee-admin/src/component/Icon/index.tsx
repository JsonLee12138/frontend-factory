import IconPark, {
  ALL_ICON_KEYS,
  IconType,
  IIconAllProps,
} from '@icon-park/react/es/all';
import { camelCase } from '@/utils/str';

interface Props extends Omit<IIconAllProps, 'type'> {
  name: string;
}

const Icon = ({ name, children, ...props }: Props) => {
  if (ALL_ICON_KEYS.includes(camelCase(name, true) as IconType)) {
    return <IconPark type={name} {...props} />;
  }
  return <>{children}</>;
};

export default Icon;
