export type Interceptor<T = any> = (config: T) => T | Promise<T>;
export interface InterceptorManagerInstance<T = any> {
  use(interceptor: Interceptor<T>): void;
  run(config: T): Promise<T>;
}

export type RequestInterceptor = InterceptorManagerInstance<JFetchOptions & { url: string; }>;

export type ResponseInterceptor<T = any> = InterceptorManagerInstance<JFetchAbortablePromise<T>>;

export interface JFetchOptions extends RequestInit {
  params?: Record<string, any>;
  data?: Record<string, any> | null | string;
  timeout?: number;
  isStream?: boolean;
  streamCallback?: <T = any>(chunk: T) => void;
  baseURL?: string;
  responseInterceptor?: ResponseInterceptor;
  requestInterceptor?: RequestInterceptor;
}

export interface JFetchError {
  code: number;
  message: string;
  url: string;
  requestHeaders: Headers;
  responseHeaders: Headers;
}

export interface JFetchAbortablePromise<T> extends Promise<T>{
  abort: () => void;
}
