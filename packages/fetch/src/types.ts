export type Interceptor<T = any> = (config: T) => T | Promise<T>;
export interface InterceptorManagerInstance<T = any> {
  use(interceptor: Interceptor<T>): void;
  run(config: T): Promise<T>;
}

export type RequestInterceptor = InterceptorManagerInstance<Omit<JFetchOptions, 'headers'> & { url: string; headers: Headers; }>;

export type ResponseInterceptor<T = any> = InterceptorManagerInstance<JFetchAbortablePromise<T>>;

export type ErrorInterceptor = InterceptorManagerInstance<JFetchError>;

export interface JFetchOptions extends RequestInit {
  params?: Record<string, any>;
  data?: Record<string, any> | null | string;
  timeout?: number;
  isStream?: boolean;
  streamCallback?: <T = any>(chunk: T) => void;
  baseURL?: string;
  responseInterceptor?: ResponseInterceptor;
  requestInterceptor?: RequestInterceptor;
  errorInterceptor?: ErrorInterceptor;
}

export interface JFetchError {
  code: number;
  message: string;
  url: string;
  requestHeaders: Headers;
  responseHeaders: Headers;
}

// export interface JFetchAbortablePromise<T> extends Promise<T>{
//   abort: () => void;
// }

export interface JFetchAbortablePromise<T> {
  abort: () => void;
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult>;
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
