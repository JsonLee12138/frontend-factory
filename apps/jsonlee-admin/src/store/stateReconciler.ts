const stateReconciler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inboundState: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _originalState: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reducedState: any,
  // { debug }: { debug: boolean }
) => {
  // 如果 inboundState 是 undefined，直接返回 reducedState
  if (inboundState === undefined) {
    return reducedState;
  }
  // 否则，将 inboundState 和 reducedState 进行浅合并
  return {
    ...reducedState,
    ...inboundState,
  };
};

export default stateReconciler;
