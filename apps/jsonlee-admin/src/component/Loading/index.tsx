import { ModalProps } from 'antd';

const loadingText = 'LOADING...';

const Loading = ({ open }: Pick<ModalProps, 'open'>) => {
  return (
    <dialog open={open} className={'w-screen h-screen fixed top-0 left-0'}>
      <div className={'m-0 p-0 bg-[rgba(0,0,0,.3)] relative w-screen h-screen'}>
        <h1
          className={
            'm-0 p-0 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'
          }
        >
          {loadingText.split('').map((char, index) => {
            return (
              <span
                key={`${char}-${index}`}
                className={`after:text-[#262626] bg-white px-5 py-2.5 font-arial table-cell shadow-loading-shadow animate-loading-jump animation-delay-[${200 * (index + 1)}ms]`}
              >
                {char}
              </span>
            );
          })}
        </h1>
      </div>
    </dialog>
  );
};

export default Loading;
