import qs from "qs";
import { ContentType, Method, StatusCode } from "./enums";
import { JFetchAbortablePromise, JFetchError, JFetchOptions } from "./types";

const baseHeaders = {
  'Content-Type': ContentType.JSON,
}

const withBodyArr = [Method.POST, Method.PUT, Method.PATCH];
const withoutBodyArr = [Method.GET, Method.HEAD, Method.OPTIONS];

class AbortablePromise<T> extends Promise<T> implements JFetchAbortablePromise<T> {
  private abortController: AbortController;
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void,
    abortController: AbortController
  ) {
    super(executor);
    this.abortController = abortController;
    this.abort = this.abort.bind(this);
  }
  public abort(){
    this.abortController.abort();
  };
}
export function request<T = any, P = any>(url: string, { headers: _headers, timeout = 3000, isStream = false, streamCallback = () => { }, method = Method.GET, params, data, ...options }: JFetchOptions): JFetchAbortablePromise<T> {
  const headers = mergeHeaders(baseHeaders, _headers);
  const controller = new AbortController();
  const signal = controller.signal;
  let timeoutFlag: boolean = false;
  let timeoutInstance: NodeJS.Timeout | null = null;
  function timeoutHandler(_time: number): Promise<void> {
    return new Promise((_resolve, reject) => {
      timeoutInstance = setTimeout(() => {
        timeoutFlag = true;
        clearTimeout(timeoutInstance!);
        timeoutInstance = null;
        controller.abort();
        reject(genError({
          code: StatusCode.TIME_OUT,
          message: `Timeout of ${_time}ms exceeded`,
          requestHeaders: headers,
          responseHeaders: new Headers(),
          url,
        }));
      }, _time);
    });
  }
  if(data){
    if (withBodyArr.includes(method.toUpperCase() as Method)) {
      const _contentType = headers.get('Content-Type') || '';
      if (_contentType.includes(ContentType.JSON)) {
        data = JSON.stringify(data);
      } else if (_contentType.includes(ContentType.FORM_URLENCODED)) {
        data = qs.stringify(data, { arrayFormat: 'repeat' });
      } else if (_contentType.includes(ContentType.FORM_DATA)) {
        const formData = new FormData();
        if (!(data instanceof FormData) && typeof data === 'object') {
          const _data = data as Record<string, any>;
          Object.keys(_data).forEach((key) => {
            if(_data.hasOwnProperty(key)){
              formData.append(key, _data[key]);
            }
          });
          data = formData;
        }
      }
    }
    if (withoutBodyArr.includes(method.toUpperCase() as Method)) {
      data = null;
    }
  }
  if(params){
    const paramsStr = qs.stringify(params, { arrayFormat: 'repeat' });
    if(paramsStr){
      url = url.includes('?') ? `${url}&${paramsStr}` : `${url}?${paramsStr}`;
    }
  }
  return new AbortablePromise<T>(async (resolve, reject) => {
    try {
      const res = await Promise.race([
        fetch(url, {
          ...options,
          headers,
          signal,
          method,
          body: data as unknown as BodyInit,
        }),
        timeoutHandler(timeout),
      ]) as Response;
      res.headers.get('Content-Type');
      if (res.ok) {
        if (res.headers.get('Content-Type')?.includes(ContentType.STREAM) || res.headers.get('Transfer-Encoding') === 'chunked' || isStream) {
          resolve(handleStream(res, streamCallback) as T);
        }
        resolve(dataToJson(res));
      }
      return reject(genError({
        code: res.status,
        message: res.statusText,
        requestHeaders: headers,
        responseHeaders: res.headers,
        url,
      }));
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        if (timeoutFlag) {
          return reject(genError({
            code: StatusCode.TIME_OUT,
            message: `Timeout of ${timeout}ms exceeded`,
            requestHeaders: headers,
            responseHeaders: new Headers(),
            url,
          }));
        }
        return reject(genError({
          code: StatusCode.ABORTED,
          message: 'Request aborted',
          requestHeaders: headers,
          responseHeaders: new Headers(),
          url,
        }));
      }
      return reject(genError({
        code: StatusCode.NETWORK_ERROR,
        message: error.message || 'Network error or other problem',
        requestHeaders: headers,
        responseHeaders: new Headers(),
        url,
      }));
    } finally{
      if(timeoutInstance){
        clearTimeout(timeoutInstance);
      }
    }
}, controller)
}

async function handleStream(res: Response, callback: <T = any>(chunk: T | string) => void) {
  if (!res.body) {
    return Promise.reject(genError({
      code: StatusCode.BODY_NULL,
      message: 'Response body is null in stream mode',
      requestHeaders: new Headers(),
      responseHeaders: res.headers,
      url: res.url,
    }));
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;
    if (value) {
      const chunk = decoder.decode(value, { stream: !done });
      try {
        const data = JSON.parse(chunk);
        callback(data)
      } catch (error) {
        callback(chunk);
      }
    }
  }
}
function dataToJson(res: Response) {
  return res.json();
}
function mergeHeaders(_baseHeaders: HeadersInit = {}, _newHeaders: HeadersInit = {}): Headers {
  return new Headers({ ..._baseHeaders, ..._newHeaders })
}

function genError({ code, message, requestHeaders, responseHeaders, url }: JFetchError): JFetchError {
  return {
    code,
    message,
    requestHeaders,
    responseHeaders,
    url,
  }
}
