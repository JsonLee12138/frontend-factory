import { MapStateToProps } from '@/types/store.ts';
import { forwardRef } from '@/decorator/forwardRef.tsx';
import { connect } from '@/decorator/connect.ts';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withForwardRefAndConnect = <SP = object, DP = object>(mapStateToProps?: MapStateToProps<SP>, mapDispatchToProps?: DP) => {
  return (target: any) => {
    // return forwardRef(target)
    const newTarget = connect(mapStateToProps, mapDispatchToProps)(target);
    console.log('newTarget', newTarget);
    return forwardRef(newTarget)
  }
};
