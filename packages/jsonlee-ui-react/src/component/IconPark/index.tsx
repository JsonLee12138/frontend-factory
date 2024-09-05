import Icon, { ALL_ICON_KEYS, IconType } from '@icon-park/react/es/all';
import { camelCase } from '@/utils/str';
import { IconParkInstance, IconParkProps } from '@/types/iconpark';
import { useBoolean, useSafeState } from 'ahooks';
import {
  forwardRef,
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';

const IconPark = forwardRef<IconParkInstance, IconParkProps>(
  (
    {
      name: nameProp = '',
      children,
      cusLoad,
      theme: themeProp,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const [loaded, { setTrue: setLoadedTrue }] = useBoolean(!cusLoad);
    const [name, setName] = useSafeState<string>('');
    const [theme, setTheme] = useSafeState<IconParkProps['theme']>(themeProp);
    const wrapperRef = useRef<IconParkInstance>(null);

    useEffect(() => {
      const [_name, _theme] = nameProp.split('/');
      setName(camelCase(_name, true));
      _theme && setTheme(themeProp || (_theme as IconParkProps['theme']));
    }, [nameProp, themeProp]);

    useEffect(() => {
      if (!cusLoad) {
        setLoadedTrue();
      }
    }, [cusLoad]);

    const handleLoad = useCallback(() => {
      setLoadedTrue();
    }, []);

    useEffect(() => {
      if (wrapperRef.current) {
        Object.defineProperty(wrapperRef.current, 'load', {
          value: function () {
            handleLoad();
          },
          writable: true,
          configurable: true,
        });
      }
    }, []);

    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(wrapperRef.current);
        } else if (ref && typeof ref === 'object') {
          ref.current = wrapperRef.current;
        }
      }
    }, [ref]);

    return (
      <i ref={wrapperRef as unknown as LegacyRef<HTMLElement>} className={className} style={style}>
        {loaded &&
          (ALL_ICON_KEYS.includes(camelCase(name, true) as IconType) ? (
            <Icon type={name} theme={theme} {...props} />
          ) : (
            <>{children}</>
          ))}
      </i>
    );
  },
);

export default IconPark;
