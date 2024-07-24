export interface JFetchOptions extends RequestInit {
  params?: Record<string, any>;
  data?: Record<string, any> | null | string;
  timeout?: number;
  isStream?: boolean;
  streamCallback?: <T = any>(chunk: T) => void;
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
