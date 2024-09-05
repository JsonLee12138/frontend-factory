import { ALL_ICON_KEYS } from '@icon-park/react/es/all';
import IconPark from '../IconPark';
import { useCallback, useEffect, useRef } from 'react';
import type { IconParkInstance } from '@/types/iconpark';
import { useSafeState } from 'ahooks';
import debounce from 'lodash-es/debounce';

interface Props {
  options: string[];
  onSelect: (key: string)=> void;
}

const IconsBar = ({ options, onSelect }: Props) => {
  const iconsRefs = useRef<Map<string, IconParkInstance>>(new Map());
  const observer = useRef<IntersectionObserver>(null);
  const [marginRight, setMarginRight] = useSafeState<string>('');

  const handleSetRef = useCallback(
    (key: string) => (el: IconParkInstance) => {
      iconsRefs.current.set(key, el);
    },
    [],
  );

  const mathItemsMarginRight = useCallback(() => {
    setMarginRight('auto');
    requestAnimationFrame(() => {
      console.log(iconsRefs.current.get(options[0]))
      setMarginRight(
        getComputedStyle(
          iconsRefs.current.get(options[0]) as unknown as Element,
        )?.marginRight,
      );
    });
  }, [iconsRefs.current]);

  useEffect(() => {
    let flag = false;
    // @ts-ignore
    observer.current = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const target = entry.target as unknown as IconParkInstance;
          target.load();
          if(!flag){
            mathItemsMarginRight();
            flag = true;
          }
        }
      }
    });

    for (const [_key, instance] of iconsRefs.current) {
      observer.current.observe(instance as unknown as Element);
    }
    window.addEventListener('resize', debounce(mathItemsMarginRight, 300));
    return () => {
      window.removeEventListener('resize', mathItemsMarginRight);
      observer.current?.disconnect();
      // @ts-ignore
      observer.current = null;
    };
  }, []);

  return (
    <div className={'flex w-full flex-wrap items-center'} style={{flexWrap: 'wrap'}}>
      {ALL_ICON_KEYS.map((item) => (
        <IconPark
          ref={handleSetRef(item)}
          key={item}
          cusLoad
          name={item}
          size={24}
          className={`${!options.includes(item) && 'hidden'} p-5 mr-auto hover:scale-150 transition cursor-pointer`}
          onClick={() => onSelect(item)}
          style={{ marginRight }}
        />
      ))}
    </div>
  );
};

export default IconsBar;
