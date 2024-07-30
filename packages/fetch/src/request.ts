import qs from "qs";
import { ContentType, Method, StatusCode } from "./enums";
import { JFetchAbortablePromise, JFetchError, JFetchOptions, JFetchRequestOptions, JFetchRequestWithDataOptions, JFetchRequestWithParamsOptions } from "./types";
import InterceptorManager from "./interceptor";
import { __extends } from 'tslib';

const baseHeaders = {
  'Content-Type': ContentType.JSON,
}

const withBodyArr = [Method.POST, Method.PUT, Method.PATCH];
const withoutBodyArr = [Method.GET, Method.HEAD, Method.OPTIONS, Method.DELETE];
const withParamsArr = [Method.GET, Method.HEAD, Method.OPTIONS];

class AbortablePromise<T> implements JFetchAbortablePromise<T> {
  private promise: Promise<T>;
  private abortController: AbortController;

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void,
    abortController: AbortController
  ) {
    this.abortController = abortController;
    this.promise = new Promise<T>(executor);
    this.abort = this.abort.bind(this);
    this.then = this.then.bind(this);
    this.catch = this.catch.bind(this);
    this.finally = this.finally.bind(this);
    this.getController = this.getController.bind(this);
  }
  /**
   * Aborts the fetch request.
   * 中止 fetch 请求。
   */
  public abort() {
    this.abortController.abort();
  }
  public getController(): AbortController {
    return this.abortController;
  }

  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  public catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult> {
    return this.promise.catch(onrejected);
  }

  public finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onfinally);
  }
}

// class AbortablePromise<T> extends Promise<T> implements JFetchAbortablePromise<T> {
//   private abortController: AbortController;
//   constructor(
//     executor: (
//       resolve: (value: T | PromiseLike<T>) => void,
//       reject: (reason?: any) => void
//     ) => void,
//     abortController: AbortController
//   ) {
//     super(executor);
//     this.abortController = abortController;
//     this.abort = this.abort.bind(this);
//   }
//   /**
//    * Aborts the fetch request.
//    * 中止 fetch 请求。
//    */
//   public abort() {
//     this.abortController.abort();
//   };
// }
/**
 * Configuration options for JFetch requests.
 * JFetch 请求的配置选项。
 *
 * @param url The URL of the request.
 * @param url 请求地址
 *
 * @param {JFetchOptions} [options]
 * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
 *
 * @property {Record<string, any>} [params] - Query parameters to include in the request URL.
 * @property {Record<string, any>} [params] - 请求 URL 中包含的查询参数。
 *
 * @property {Record<string, any> | null | string} [data] - request parameter.
 * @property {Record<string, any> | null | string} [data] - 请求参数。
 *
 * @property {number} [timeout] - Timeout duration in milliseconds for the request.
 * @property {number} [timeout] - 请求的超时时间（毫秒）。
 *
 * @property {boolean} [isStream] - Whether the response should be treated as a stream.
 * @property {boolean} [isStream] - 响应是否应视为流。
 *
 * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
 * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
 *
 * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
 * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
 *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
 *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
 *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
 *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
 *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
 *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
 *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
 *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
 *   - `undefined`: Uses the default array format of `qs.stringify`.
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 *
 * Error object
 * 错误对象。
 * @interface JFetchError
 *
 * @property {number} code - The error code.
 * @property {number} code - 错误码。
 *
 * @property {string} message - The error message.
 * @property {string} message - 错误信息。
 *
 * @property {string} url - The request URL.
 * @property {string} url - 请求 URL。
 *
 * @property {Headers} requestHeaders - The request headers.
 * @property {Headers} requestHeaders - 请求头。
 *
 * @property {Headers} responseHeaders - The response headers.
 * @property {Headers} responseHeaders - 响应头。
 */
export function request<T = any>(url: string, { headers: _headers, timeout = 3000, isStream = false, streamCallback = () => { }, method = Method.GET, params, data, responseInterceptor, requestInterceptor, errorInterceptor, mode = 'cors', qsArrayFormat = "repeat", finallyInterceptor,...options }: JFetchRequestOptions = {}): JFetchAbortablePromise<T> {
  let headers = mergeHeaders(baseHeaders, _headers);
  console.log('headers', baseHeaders, _headers)
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
  return new AbortablePromise<T>(async (resolve, reject) => {
    if (requestInterceptor) {
      const { headers: _h, data: _d, params: _p, method: _m, url: _u, ..._op } = await requestInterceptor.run({ ...options, headers, data, params, method, url })
      data = _d;
      url = _u;
      params = _p;
      options = _op;
      headers = _h;
    }
    if (data) {
      if (withBodyArr.includes(method.toUpperCase() as Method)) {
        const _contentType = headers.get('Content-Type') || '';
        if (_contentType.includes(ContentType.JSON)) {
          data = JSON.stringify(data);
        } else if (_contentType.includes(ContentType.FORM_URLENCODED)) {
          data = qs.stringify(data, { arrayFormat: qsArrayFormat, });
        } else if (_contentType.includes(ContentType.FORM_DATA)) {
          const formData = new FormData();
          if (!(data instanceof FormData) && typeof data === 'object') {
            const _data = data as Record<string, any>;
            Object.keys(_data).forEach((key) => {
              if (_data.hasOwnProperty(key)) {
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
    url = buildUrl(url, params, qsArrayFormat);
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
        if (isStream) {
          resolve(handleStream(res, streamCallback) as T);
        }
        if (responseInterceptor) {
          return resolve(await responseInterceptor.run(await dataToJson(res)));
        }
        resolve(await dataToJson(res));
      }
      throw genError({
        code: res.status,
        message: res.statusText,
        requestHeaders: headers,
        responseHeaders: res.headers,
        url,
      });
    } catch (err: unknown) {
      const error = err as Error;
      let errorTemp: JFetchError;
      if (error.name === 'AbortError') {
        if (timeoutFlag) {
          errorTemp = genError({
            code: StatusCode.TIME_OUT,
            message: `Timeout of ${timeout}ms exceeded`,
            requestHeaders: headers,
            responseHeaders: new Headers(),
            url,
          });
        } else {
          errorTemp = genError({
            code: StatusCode.ABORTED,
            message: 'Request aborted',
            requestHeaders: headers,
            responseHeaders: new Headers(),
            url,
          });
        }
      } else {
        errorTemp = genError({
          code: (err as { code: number | string }).code || StatusCode.NETWORK_ERROR,
          message: error.message || 'Network error or other problem',
          requestHeaders: headers,
          responseHeaders: new Headers(),
          url,
        });
      }
      if (errorInterceptor) {
        return reject(await errorInterceptor.run(errorTemp));
      }
      return reject(errorTemp);
    } finally {
      if (finallyInterceptor) {
        finallyInterceptor.run(controller);
      }
      if (timeoutInstance) {
        clearTimeout(timeoutInstance);
      }
    }
  }, controller)
}
/**
 * Sends an HTTP GET request.
 * 发送 HTTP GET 请求。
 *
 * @template T - The type of the response data.
 * @template T - 响应数据的类型。
 *
 * @template P - The type of the request parameter.
 * @template P - 请求参数的类型。
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} url - 发送请求的 URL。
 *
 * @param {P} [params] - The query parameters to include in the request.
 * @param {P} [params] - 请求中包含的查询参数。
 *
 * @param {Omit<JFetchOptions, 'baseURL' | 'data' | 'params'>} [options]
 * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
 *
 * @property {number} [timeout] - Timeout duration in milliseconds for the request.
 * @property {number} [timeout] - 请求的超时时间（毫秒）。
 *
 * @property {boolean} [isStream] - Whether the response should be treated as a stream.
 * @property {boolean} [isStream] - 响应是否应视为流。
 *
 * @property {function} [streamCallback] - Callback function for handling stream chunks.
 * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
 *
 * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
 * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
 *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
 *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
 *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
 *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
 *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
 *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
 *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
 *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
 *   - `undefined`: Uses the default array format of `qs.stringify`.
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 *
 * Error object
 * 错误对象。
 * @interface JFetchError
 *
 * @property {number} code - The error code.
 * @property {number} code - 错误码。
 *
 * @property {string} message - The error message.
 * @property {string} message - 错误信息。
 *
 * @property {string} url - The request URL.
 * @property {string} url - 请求 URL。
 *
 * @property {Headers} requestHeaders - The request headers.
 * @property {Headers} requestHeaders - 请求头。
 *
 * @property {Headers} responseHeaders - The response headers.
 * @property {Headers} responseHeaders - 响应头。
 */
export function get<T = any, P = any>(url: string, params: P = {} as P, options: JFetchRequestWithParamsOptions = {}): JFetchAbortablePromise<T> {
  return request<T>(url, {
    ...options,
    params: params as unknown as JFetchOptions['params'],
    method: Method.GET,
  })
}
/**
 * Sends an HTTP POST request.
 * 发送 HTTP POST 请求。
 *
 * @template T - The type of the response data.
 * @template T - 响应数据的类型。
 *
 * @template D - The type of the request parameter.
 * @template D - 请求参数的类型。
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} url - 发送请求的 URL。
 *
 * @param {D} [data] - request parameter.
 * @param {D} [data] - 请求参数。
 *
 * @param {JFetchRequestWithDataOptions} [options]
 * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
 *
 * @property {number} [timeout] - Timeout duration in milliseconds for the request.
 * @property {number} [timeout] - 请求的超时时间（毫秒）。
 *
 * @param {Record<string, any>} [params] - The query parameters contained in the request.
 *
 * @param {Record<string, any>} [params] - 请求中包含的查询参数。
 *
 * @property {boolean} [isStream] - Whether the response should be treated as a stream.
 * @property {boolean} [isStream] - 响应是否应视为流。
 *
 * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
 * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
 *
 * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
 * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
 *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
 *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
 *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
 *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
 *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
 *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
 *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
 *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
 *   - `undefined`: Uses the default array format of `qs.stringify`.
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 *
 * Error object
 * 错误对象。
 * @interface JFetchError
 *
 * @property {number} code - The error code.
 * @property {number} code - 错误码。
 *
 * @property {string} message - The error message.
 * @property {string} message - 错误信息。
 *
 * @property {string} url - The request URL.
 * @property {string} url - 请求 URL。
 *
 * @property {Headers} requestHeaders - The request headers.
 * @property {Headers} requestHeaders - 请求头。
 *
 * @property {Headers} responseHeaders - The response headers.
 * @property {Headers} responseHeaders - 响应头。
 */
export function post<T = any, D = any>(url: string, data: D = {} as D, options: JFetchRequestWithDataOptions = {}): JFetchAbortablePromise<T> {
  return request<T>(url, {
    ...options,
    data: data as unknown as JFetchOptions['data'],
    method: Method.POST,
  })
}
/**
 * Sends an HTTP PUT request.
 * 发送 HTTP PUT 请求。
 *
 * @template T - The type of the response data.
 * @template T - 响应数据的类型。
 *
 * @template D - The type of the request parameter.
 * @template D - 请求参数的类型。
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} url - 发送请求的 URL。
 *
 * @param {D} [data] - request parameter.
 * @param {D} [data] - 请求参数。
 *
 * @param {JFetchRequestWithDataOptions} [options]
 * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
 *
 * @property {number} [timeout] - Timeout duration in milliseconds for the request.
 * @property {number} [timeout] - 请求的超时时间（毫秒）。
 *
 * @param {Record<string, any>} [params] - The query parameters contained in the request.
 * @param {Record<string, any>} [params] - 请求中包含的查询参数。
 *
 * @property {boolean} [isStream] - Whether the response should be treated as a stream.
 * @property {boolean} [isStream] - 响应是否应视为流。
 *
 * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
 * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
 *
 * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
 * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
 *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
 *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
 *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
 *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
 *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
 *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
 *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
 *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
 *   - `undefined`: Uses the default array format of `qs.stringify`.
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 *
 * Error object
 * 错误对象。
 * @interface JFetchError
 *
 * @property {number} code - The error code.
 * @property {number} code - 错误码。
 *
 * @property {string} message - The error message.
 * @property {string} message - 错误信息。
 *
 * @property {string} url - The request URL.
 * @property {string} url - 请求 URL。
 *
 * @property {Headers} requestHeaders - The request headers.
 * @property {Headers} requestHeaders - 请求头。
 *
 * @property {Headers} responseHeaders - The response headers.
 * @property {Headers} responseHeaders - 响应头。
 */
export function put<T = any, D = any>(url: string, data: D = {} as D, options: JFetchRequestWithDataOptions = {}): JFetchAbortablePromise<T> {
  return request<T>(url, {
    ...options,
    data: data as unknown as JFetchOptions['data'],
    method: Method.PUT,
  })
}
/**
 * Sends an HTTP DELETE request.
 * 发送 HTTP DELETE 请求。
 *
 * @template T - The type of the response data.
 * @template T - 响应数据的类型。
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} url - 发送请求的 URL。
 *
 * @param {JFetchRequestWithDataOptions} [options]
 * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
 *
 * @property {number} [timeout] - Timeout duration in milliseconds for the request.
 * @property {number} [timeout] - 请求的超时时间（毫秒）。
 *
 * @property {boolean} [isStream] - Whether the response should be treated as a stream.
 * @property {boolean} [isStream] - 响应是否应视为流。
 *
 * @param {Record<string, any>} [params] - The query parameters contained in the request.
 *
 * @param {Record<string, any>} [params] - 请求中包含的查询参数。
 *
 * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
 * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
 *
 * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
 * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
 *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
 *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
 *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
 *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
 *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
 *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
 *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
 *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
 *   - `undefined`: Uses the default array format of `qs.stringify`.
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 *
 * Error object
 * 错误对象。
 * @interface JFetchError
 *
 * @property {number} code - The error code.
 * @property {number} code - 错误码。
 *
 * @property {string} message - The error message.
 * @property {string} message - 错误信息。
 *
 * @property {string} url - The request URL.
 * @property {string} url - 请求 URL。
 *
 * @property {Headers} requestHeaders - The request headers.
 * @property {Headers} requestHeaders - 请求头。
 *
 * @property {Headers} responseHeaders - The response headers.
 * @property {Headers} responseHeaders - 响应头。
 */
export function del<T = any>(url: string, options: JFetchRequestWithDataOptions = {}): JFetchAbortablePromise<T> {
  return request<T>(url, {
    ...options,
    method: Method.DELETE,
  })
}
/**
 * Sends an HTTP PATCH request.
 * 发送 HTTP PATCH 请求。
 *
 * @template T - The type of the response data.
 * @template T - 响应数据的类型。
 *
 * @template D - The type of the request parameter.
 * @template D - 请求参数的类型。
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} url - 发送请求的 URL。
 *
 * @param {D} [data] - request parameter.
 * @param {D} [data] - 请求参数。
 *
 * @param {JFetchRequestWithDataOptions} [options]
 * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
 *
 * @property {number} [timeout] - Timeout duration in milliseconds for the request.
 * @property {number} [timeout] - 请求的超时时间（毫秒）。
 *
 * @param {Record<string, any>} [params] - The query parameters contained in the request.
 * @param {Record<string, any>} [params] - 请求中包含的查询参数。
 *
 * @property {boolean} [isStream] - Whether the response should be treated as a stream.
 * @property {boolean} [isStream] - 响应是否应视为流。
 *
 * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
 * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
 *
 * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
 * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
 *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
 *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
 *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
 *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
 *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
 *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
 *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
 *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
 *   - `undefined`: Uses the default array format of `qs.stringify`.
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 *
 * Error object
 * 错误对象。
 * @interface JFetchError
 *
 * @property {number} code - The error code.
 * @property {number} code - 错误码。
 *
 * @property {string} message - The error message.
 * @property {string} message - 错误信息。
 *
 * @property {string} url - The request URL.
 * @property {string} url - 请求 URL。
 *
 * @property {Headers} requestHeaders - The request headers.
 * @property {Headers} requestHeaders - 请求头。
 *
 * @property {Headers} responseHeaders - The response headers.
 * @property {Headers} responseHeaders - 响应头。
 */
export function patch<T = any, D = any>(url: string, data: D = {} as D, options: JFetchRequestWithDataOptions = {}): JFetchAbortablePromise<T> {
  return request<T>(url, {
    ...options,
    data: data as unknown as JFetchOptions['data'],
    method: Method.PATCH,
  })
}
/**
 * Sends an HTTP HEAD request.
 * 发送 HTTP HEAD 请求。
 *
 * @template T - The type of the response data.
 * @template T - 响应数据的类型。
 *
 * @template P - The type of the request parameter.
 * @template P - 请求参数的类型。
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} url - 发送请求的 URL。
 *
 * @param {P} [params] - The query parameters to include in the request.
 * @param {P} [params] - 请求中包含的查询参数。
 *
 * @param {JFetchRequestWithDataOptions} [options]
 * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
 *
 * @property {number} [timeout] - Timeout duration in milliseconds for the request.
 * @property {number} [timeout] - 请求的超时时间（毫秒）。
 *
 * @property {boolean} [isStream] - Whether the response should be treated as a stream.
 * @property {boolean} [isStream] - 响应是否应视为流。
 *
 * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
 * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
 *
 * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
 * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
 *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
 *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
 *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
 *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
 *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
 *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
 *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
 *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
 *   - `undefined`: Uses the default array format of `qs.stringify`.
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 *
 * Error object
 * 错误对象。
 * @interface JFetchError
 *
 * @property {number} code - The error code.
 * @property {number} code - 错误码。
 *
 * @property {string} message - The error message.
 * @property {string} message - 错误信息。
 *
 * @property {string} url - The request URL.
 * @property {string} url - 请求 URL。
 *
 * @property {Headers} requestHeaders - The request headers.
 * @property {Headers} requestHeaders - 请求头。
 *
 * @property {Headers} responseHeaders - The response headers.
 * @property {Headers} responseHeaders - 响应头。
 */
export function head<T = any, P = any>(url: string, params: P = {} as P, options: JFetchRequestWithParamsOptions = {}): JFetchAbortablePromise<T> {
  return request<T>(url, {
    ...options,
    params: params as unknown as JFetchOptions['params'],
    method: Method.HEAD,
  })
}
/**
 * Sends an HTTP OPTIONS request.
 * 发送 HTTP OPTIONS 请求。
 *
 * @template T - The type of the response data.
 * @template T - 响应数据的类型。
 *
 * @template P - The type of the request parameter.
 * @template P - 请求参数的类型。
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} url - 发送请求的 URL。
 *
 * @param {P} [params] - The query parameters to include in the request.
 * @param {P} [params] - 请求中包含的查询参数。
 *
 * @param {JFetchRequestWithDataOptions} [options]
 * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
 *
 * @property {number} [timeout] - Timeout duration in milliseconds for the request.
 * @property {number} [timeout] - 请求的超时时间（毫秒）。
 *
 * @property {boolean} [isStream] - Whether the response should be treated as a stream.
 * @property {boolean} [isStream] - 响应是否应视为流。
 *
 * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
 * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
 *
 * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
 * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
 *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
 *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
 *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
 *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
 *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
 *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
 *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
 *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
 *   - `undefined`: Uses the default array format of `qs.stringify`.
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 *
 * Error object
 * 错误对象。
 * @interface JFetchError
 *
 * @property {number} code - The error code.
 * @property {number} code - 错误码。
 *
 * @property {string} message - The error message.
 * @property {string} message - 错误信息。
 *
 * @property {string} url - The request URL.
 * @property {string} url - 请求 URL。
 *
 * @property {Headers} requestHeaders - The request headers.
 * @property {Headers} requestHeaders - 请求头。
 *
 * @property {Headers} responseHeaders - The response headers.
 * @property {Headers} responseHeaders - 响应头。
 */
export function options<T = any, P = any>(url: string, params: P = {} as P, options: JFetchRequestWithParamsOptions = {}): JFetchAbortablePromise<T> {
  return request<T>(url, {
    ...options,
    params: params as unknown as JFetchOptions['params'],
    method: Method.OPTIONS,
  })
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
function buildUrl(url: string, params?: JFetchOptions['params'], qsArrayFormat: JFetchOptions['qsArrayFormat'] = "repeat"): string {
  if (params) {
    const paramsStr = qs.stringify(params, { arrayFormat: qsArrayFormat });
    if (paramsStr) {
      url = url.includes('?') ? `${url}&${paramsStr}` : `${url}?${paramsStr}`;
    }
  }
  return url;
}
async function dataToJson(res: Response) {
  try {
    return await res.json();
  } catch (error: unknown) {
    const _error = error as Error;
    return Promise.reject(genError({
      code: StatusCode.BODY_NULL,
      message: `Failed to parse JSON: ${_error.message || 'Unknown error'}`,
      requestHeaders: new Headers(),
      responseHeaders: res.headers,
      url: res.url,
    }))
  }
}
function mergeHeaders(_baseHeaders: HeadersInit | Headers = {}, _newHeaders: HeadersInit | Headers = {}): Headers {
  const _result = _baseHeaders instanceof Headers ? _baseHeaders : new Headers(_baseHeaders);
  const combineHeaders = (_headers: HeadersInit | Headers) => {
    if(!(_headers instanceof Headers)){
      _headers = new Headers(_headers);
    }
    _headers.forEach((value, key) => {
      _result.set(key, value);
    });
  }
  combineHeaders(_newHeaders);
  return _result;
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

/**
 * JFetch class for making HTTP requests with a predefined configuration.
 * 用于使用预定义配置进行 HTTP 请求的 JFetch 类。
 */
class JFetch {
  private baseURL: string;
  private headers: HeadersInit;
  private config: Omit<JFetchOptions, 'baseURL' | 'headers'>;
  private requestQueue: Array<JFetchAbortablePromise<any>> = [];
  /**
   * Constructs an instance of JFetch.
   * 构造 JFetch 的实例。
   *
   * @param {Omit<JFetchOptions, 'params' | 'data' | 'isStream' | 'streamCallback' | 'responseInterceptor' | 'requestInterceptor' | 'errorInterceptor'>} [options]
   * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
   *
   * @property {number} [timeout] - Timeout duration in milliseconds for the request.
   * @property {number} [timeout] - 请求的超时时间（毫秒）。
   *
   * @property {string} [baseURL] - Base URL for the request.
   * @property {string} [baseURL] - 请求的基础 URL。
   *
   * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
   * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
   * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
   *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
   *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
   *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
   *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
   *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
   *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
   *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
   *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
   *   - `undefined`: Uses the default array format of `qs.stringify`.
   *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
   */
  constructor({ baseURL = '', headers = {}, ...options }: Omit<JFetchOptions, 'params' | 'data' | 'isStream' | 'streamCallback' | 'responseInterceptor' | 'requestInterceptor' | 'errorInterceptor'> = {}) {
    this.baseURL = baseURL;
    this.headers = headers;
    this.config = options;
    // bind
    this.request = this.request.bind(this);
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
    this.patch = this.patch.bind(this);
    this.head = this.head.bind(this);
    this.options = this.options.bind(this);
    this.abortAll = this.abortAll.bind(this);
    this.getQueue = this.getQueue.bind(this);
    this.finallyInterceptor.use((_controller)=> {
      this.requestQueue = this.requestQueue.filter((_c)=> _c.getController() !== _controller);
    })
  }
  static request = request;
  static get = get;
  static post = post;
  static put = put;
  static patch = patch;
  static delete = del;
  static head = head;
  static options = options;

  /**
   * Configuration options for JFetch requests.
   * JFetch 请求的配置选项。
   *
   * @param url The URL of the request.
   * @param url 请求地址
   *
   * @param {JFetchOptions} [options]
   * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
   *
   * @property {Record<string, any>} [params] - Query parameters to include in the request URL.
   * @property {Record<string, any>} [params] - 请求 URL 中包含的查询参数。
   *
   * @property {Record<string, any> | null | string} [data] - request parameter.
   * @property {Record<string, any> | null | string} [data] - 请求参数。
   *
   * @property {number} [timeout] - Timeout duration in milliseconds for the request.
   * @property {number} [timeout] - 请求的超时时间（毫秒）。
   *
   * @property {boolean} [isStream] - Whether the response should be treated as a stream.
   * @property {boolean} [isStream] - 响应是否应视为流。
   *
   * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
   * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
   *
   * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
   * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
   * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
   *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
   *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
   *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
   *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
   *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
   *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
   *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
   *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
   *   - `undefined`: Uses the default array format of `qs.stringify`.
   *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
   *
   * @property {string} [baseURL] - Base URL for the request.
   * @property {string} [baseURL] - 请求的基础 URL。
   *
   * @property {ResponseInterceptor} [responseInterceptor] - Interceptor for processing the response.
   * @property {ResponseInterceptor} [responseInterceptor] - 处理响应的拦截器。
   *
   * @property {RequestInterceptor} [requestInterceptor] - Interceptor for processing the request.
   * @property {RequestInterceptor} [requestInterceptor] - 处理请求的拦截器。
   *
   * @property {ErrorInterceptor} [errorInterceptor] - Interceptor for processing the request errors.
   * @property {ErrorInterceptor} [errorInterceptor] - 处理请求错误的拦截器。
   *
   * Error object
   * 错误对象。
   * @interface JFetchError
   *
   * @property {number} code - The error code.
   * @property {number} code - 错误码。
   *
   * @property {string} message - The error message.
   * @property {string} message - 错误信息。
   *
   * @property {string} url - The request URL.
   * @property {string} url - 请求 URL。
   *
   * @property {Headers} requestHeaders - The request headers.
   * @property {Headers} requestHeaders - 请求头。
   *
   * @property {Headers} responseHeaders - The response headers.
   * @property {Headers} responseHeaders - 响应头。
   */
  public request<T = any>(url: string, { headers, ...options }: JFetchRequestOptions = {}) {
    const _headers = mergeHeaders(this.headers, headers);
    let _url = this.baseURL;
    if (_url.charAt(_url.length - 1) === '/') {
      _url = _url.slice(0, _url.length - 1);
    }
    _url += url;
    const controller = request<T>(_url, {
      ...this.config,
      ...options,
      headers: _headers,
      requestInterceptor: this.requestInterceptor,
      responseInterceptor: this.responseInterceptor,
      errorInterceptor: this.errorInterceptor,
      finallyInterceptor: this.finallyInterceptor,
    })
    this.requestQueue.push(controller);
    return controller;
  }
  /**
   * Sends an HTTP GET request.
   * 发送 HTTP GET 请求。
   *
   * @template T - The type of the response data.
   * @template T - 响应数据的类型。
   *
   * @template P - The type of the request parameter.
   * @template P - 请求参数的类型。
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {string} url - 发送请求的 URL。
   *
   * @param {P} [params] - The query parameters to include in the request.
   * @param {P} [params] - 请求中包含的查询参数。
   *
   * @param {Omit<JFetchOptions, 'baseURL' | 'data' | 'params'>} [options]
   * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
   *
   * @property {number} [timeout] - Timeout duration in milliseconds for the request.
   * @property {number} [timeout] - 请求的超时时间（毫秒）。
   *
   * @property {boolean} [isStream] - Whether the response should be treated as a stream.
   * @property {boolean} [isStream] - 响应是否应视为流。
   *
   * @property {function} [streamCallback] - Callback function for handling stream chunks.
   * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
   *
   * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
   * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
   * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
   *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
   *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
   *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
   *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
   *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
   *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
   *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
   *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
   *   - `undefined`: Uses the default array format of `qs.stringify`.
   *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
   *
   * @property {ResponseInterceptor} [responseInterceptor] - Interceptor for processing the response.
   * @property {ResponseInterceptor} [responseInterceptor] - 处理响应的拦截器。
   *
   * @property {RequestInterceptor} [requestInterceptor] - Interceptor for processing the request.
   * @property {RequestInterceptor} [requestInterceptor] - 处理请求的拦截器。
   *
   * @property {ErrorInterceptor} [errorInterceptor] - Interceptor for processing the request errors.
 * @property {ErrorInterceptor} [errorInterceptor] - 处理请求错误的拦截器。
   *
   * Error object
   * 错误对象。
   * @interface JFetchError
   *
   * @property {number} code - The error code.
   * @property {number} code - 错误码。
   *
   * @property {string} message - The error message.
   * @property {string} message - 错误信息。
   *
   * @property {string} url - The request URL.
   * @property {string} url - 请求 URL。
   *
   * @property {Headers} requestHeaders - The request headers.
   * @property {Headers} requestHeaders - 请求头。
   *
   * @property {Headers} responseHeaders - The response headers.
   * @property {Headers} responseHeaders - 响应头。
   */
  get<T = any, P = any>(url: string, params: P = {} as P, options?: Omit<JFetchOptions, 'params' | 'baseURL'>) {
    return this.request<T>(url, {
      ...options,
      params: params as unknown as JFetchOptions['params'],
      method: Method.GET
    })
  }
  /**
   * Sends an HTTP POST request.
   * 发送 HTTP POST 请求。
   *
   * @template T - The type of the response data.
   * @template T - 响应数据的类型。
   *
   * @template D - The type of the request parameter.
   * @template D - 请求参数的类型。
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {string} url - 发送请求的 URL。
   *
   * @param {D} [data] - request parameter.
   * @param {D} [data] - 请求参数。
   *
   * @param {JFetchRequestWithDataOptions} [options]
   * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
   *
   * @property {number} [timeout] - Timeout duration in milliseconds for the request.
   * @property {number} [timeout] - 请求的超时时间（毫秒）。
   *
   * @param {Record<string, any>} [params] - The query parameters contained in the request.
   *
   * @param {Record<string, any>} [params] - 请求中包含的查询参数。
   *
   * @property {boolean} [isStream] - Whether the response should be treated as a stream.
   * @property {boolean} [isStream] - 响应是否应视为流。
   *
   * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
   * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
   *
   * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
   * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
   * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
   *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
   *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
   *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
   *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
   *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
   *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
   *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
   *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
   *   - `undefined`: Uses the default array format of `qs.stringify`.
   *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
   *
   * @property {ResponseInterceptor} [responseInterceptor] - Interceptor for processing the response.
   * @property {ResponseInterceptor} [responseInterceptor] - 处理响应的拦截器。
   *
   * @property {RequestInterceptor} [requestInterceptor] - Interceptor for processing the request.
   * @property {RequestInterceptor} [requestInterceptor] - 处理请求的拦截器。
   *
   * @property {ErrorInterceptor} [errorInterceptor] - Interceptor for processing the request errors.
 * @property {ErrorInterceptor} [errorInterceptor] - 处理请求错误的拦截器。
   *
   * Error object
   * 错误对象。
   * @interface JFetchError
   *
   * @property {number} code - The error code.
   * @property {number} code - 错误码。
   *
   * @property {string} message - The error message.
   * @property {string} message - 错误信息。
   *
   * @property {string} url - The request URL.
   * @property {string} url - 请求 URL。
   *
   * @property {Headers} requestHeaders - The request headers.
   * @property {Headers} requestHeaders - 请求头。
   *
   * @property {Headers} responseHeaders - The response headers.
   * @property {Headers} responseHeaders - 响应头。
   */
  post<T = any, D = any>(url: string, data: D = {} as D, options?: Omit<JFetchOptions, 'data' | 'baseURL'>) {
    return this.request<T>(url, {
      ...options,
      data: data as unknown as JFetchOptions['data'],
      method: Method.POST
    })
  }
  /**
   * Sends an HTTP PUT request.
   * 发送 HTTP PUT 请求。
   *
   * @template T - The type of the response data.
   * @template T - 响应数据的类型。
   *
   * @template D - The type of the request parameter.
   * @template D - 请求参数的类型。
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {string} url - 发送请求的 URL。
   *
   * @param {D} [data] - request parameter.
   * @param {D} [data] - 请求参数。
   *
   * @param {JFetchRequestWithDataOptions} [options]
   * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
   *
   * @property {number} [timeout] - Timeout duration in milliseconds for the request.
   * @property {number} [timeout] - 请求的超时时间（毫秒）。
   *
   * @param {Record<string, any>} [params] - The query parameters contained in the request.
   * @param {Record<string, any>} [params] - 请求中包含的查询参数。
   *
   * @property {boolean} [isStream] - Whether the response should be treated as a stream.
   * @property {boolean} [isStream] - 响应是否应视为流。
   *
   * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
   * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
   *
   * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
   * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
   * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
   *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
   *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
   *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
   *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
   *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
   *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
   *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
   *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
   *   - `undefined`: Uses the default array format of `qs.stringify`.
   *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
   *
   * Error object
   * 错误对象。
   * @interface JFetchError
   *
   * @property {number} code - The error code.
   * @property {number} code - 错误码。
   *
   * @property {string} message - The error message.
   * @property {string} message - 错误信息。
   *
   * @property {string} url - The request URL.
   * @property {string} url - 请求 URL。
   *
   * @property {Headers} requestHeaders - The request headers.
   * @property {Headers} requestHeaders - 请求头。
   *
   * @property {Headers} responseHeaders - The response headers.
   * @property {Headers} responseHeaders - 响应头。
   */
  put<T = any, D = any>(url: string, data: D = {} as D, options?: Omit<JFetchOptions, 'data' | 'baseURL'>) {
    return this.request<T>(url, {
      ...options,
      data: data as unknown as JFetchOptions['data'],
      method: Method.PUT
    })
  }
  /**
   * Sends an HTTP DELETE request.
   * 发送 HTTP DELETE 请求。
   *
   * @template T - The type of the response data.
   * @template T - 响应数据的类型。
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {string} url - 发送请求的 URL。
   *
   * @param {JFetchRequestWithDataOptions} [options]
   * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
   *
   * @property {number} [timeout] - Timeout duration in milliseconds for the request.
   * @property {number} [timeout] - 请求的超时时间（毫秒）。
   *
   * @property {boolean} [isStream] - Whether the response should be treated as a stream.
   * @property {boolean} [isStream] - 响应是否应视为流。
   *
   * @param {Record<string, any>} [params] - The query parameters contained in the request.
   *
   * @param {Record<string, any>} [params] - 请求中包含的查询参数。
   *
   * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
   * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
   *
   * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
   * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
   * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
   *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
   *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
   *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
   *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
   *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
   *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
   *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
   *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
   *   - `undefined`: Uses the default array format of `qs.stringify`.
   *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
   *
   * Error object
   * 错误对象。
   * @interface JFetchError
   *
   * @property {number} code - The error code.
   * @property {number} code - 错误码。
   *
   * @property {string} message - The error message.
   * @property {string} message - 错误信息。
   *
   * @property {string} url - The request URL.
   * @property {string} url - 请求 URL。
   *
   * @property {Headers} requestHeaders - The request headers.
   * @property {Headers} requestHeaders - 请求头。
   *
   * @property {Headers} responseHeaders - The response headers.
   * @property {Headers} responseHeaders - 响应头。
   */
  delete<T = any>(url: string, options?: Omit<JFetchOptions, 'data' | 'baseURL'>) {
    return this.request<T>(url, {
      ...options,
      method: Method.DELETE
    })
  }
  /**
   * Sends an HTTP PATCH request.
   * 发送 HTTP PATCH 请求。
   *
   * @template T - The type of the response data.
   * @template T - 响应数据的类型。
   *
   * @template D - The type of the request parameter.
   * @template D - 请求参数的类型。
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {string} url - 发送请求的 URL。
   *
   * @param {D} [data] - request parameter.
   * @param {D} [data] - 请求参数。
   *
   * @param {JFetchRequestWithDataOptions} [options]
   * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
   *
   * @property {number} [timeout] - Timeout duration in milliseconds for the request.
   * @property {number} [timeout] - 请求的超时时间（毫秒）。
   *
   * @param {Record<string, any>} [params] - The query parameters contained in the request.
   * @param {Record<string, any>} [params] - 请求中包含的查询参数。
   *
   * @property {boolean} [isStream] - Whether the response should be treated as a stream.
   * @property {boolean} [isStream] - 响应是否应视为流。
   *
   * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
   * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
   *
   * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
   * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
   * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
   *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
   *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
   *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
   *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
   *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
   *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
   *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
   *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
   *   - `undefined`: Uses the default array format of `qs.stringify`.
   *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
   *
   * Error object
   * 错误对象。
   * @interface JFetchError
   *
   * @property {number} code - The error code.
   * @property {number} code - 错误码。
   *
   * @property {string} message - The error message.
   * @property {string} message - 错误信息。
   *
   * @property {string} url - The request URL.
   * @property {string} url - 请求 URL。
   *
   * @property {Headers} requestHeaders - The request headers.
   * @property {Headers} requestHeaders - 请求头。
   *
   * @property {Headers} responseHeaders - The response headers.
   * @property {Headers} responseHeaders - 响应头。
   */
  patch<T = any, D = any>(url: string, data: D = {} as D, options?: Omit<JFetchOptions, 'data' | 'baseURL'>) {
    return this.request<T>(url, {
      ...options,
      data: data as unknown as JFetchOptions['data'],
      method: Method.PATCH
    })
  }
  /**
   * Sends an HTTP HEAD request.
   * 发送 HTTP HEAD 请求。
   *
   * @template T - The type of the response data.
   * @template T - 响应数据的类型。
   *
   * @template P - The type of the request parameter.
   * @template P - 请求参数的类型。
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {string} url - 发送请求的 URL。
   *
   * @param {P} [params] - The query parameters to include in the request.
   * @param {P} [params] - 请求中包含的查询参数。
   *
   * @param {JFetchRequestWithDataOptions} [options]
   * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
   *
   * @property {number} [timeout] - Timeout duration in milliseconds for the request.
   * @property {number} [timeout] - 请求的超时时间（毫秒）。
   *
   * @property {boolean} [isStream] - Whether the response should be treated as a stream.
   * @property {boolean} [isStream] - 响应是否应视为流。
   *
   * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
   * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
   *
   * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
   * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
   * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
   *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
   *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
   *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
   *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
   *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
   *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
   *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
   *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
   *   - `undefined`: Uses the default array format of `qs.stringify`.
   *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
   *
   * Error object
   * 错误对象。
   * @interface JFetchError
   *
   * @property {number} code - The error code.
   * @property {number} code - 错误码。
   *
   * @property {string} message - The error message.
   * @property {string} message - 错误信息。
   *
   * @property {string} url - The request URL.
   * @property {string} url - 请求 URL。
   *
   * @property {Headers} requestHeaders - The request headers.
   * @property {Headers} requestHeaders - 请求头。
   *
   * @property {Headers} responseHeaders - The response headers.
   * @property {Headers} responseHeaders - 响应头。
   */
  head<T = any, P = any>(url: string, params: P = {} as P, options?: Omit<JFetchOptions, 'params' | 'baseURL'>) {
    return this.request<T>(url, {
      ...options,
      params: params as unknown as JFetchOptions['params'],
      method: Method.HEAD
    })
  }
  /**
   * Sends an HTTP OPTIONS request.
   * 发送 HTTP OPTIONS 请求。
   *
   * @template T - The type of the response data.
   * @template T - 响应数据的类型。
   *
   * @template P - The type of the request parameter.
   * @template P - 请求参数的类型。
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {string} url - 发送请求的 URL。
   *
   * @param {P} [params] - The query parameters to include in the request.
   * @param {P} [params] - 请求中包含的查询参数。
   *
   * @param {JFetchRequestWithDataOptions} [options]
   * @extends [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
   *
   * @property {number} [timeout] - Timeout duration in milliseconds for the request.
   * @property {number} [timeout] - 请求的超时时间（毫秒）。
   *
   * @property {boolean} [isStream] - Whether the response should be treated as a stream.
   * @property {boolean} [isStream] - 响应是否应视为流。
   *
   * @property {<T>(chunk: T) => void} [streamCallback] - Callback function for handling stream chunks.
   * @property {<T>(chunk: T) => void} [streamCallback] - 处理流块的回调函数。
   *
   * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
   * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
   * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
   *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
   *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
   *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
   *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
   *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
   *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
   *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
   *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
   *   - `undefined`: Uses the default array format of `qs.stringify`.
   *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
   *
   * Error object
   * 错误对象。
   * @interface JFetchError
   *
   * @property {number} code - The error code.
   * @property {number} code - 错误码。
   *
   * @property {string} message - The error message.
   * @property {string} message - 错误信息。
   *
   * @property {string} url - The request URL.
   * @property {string} url - 请求 URL。
   *
   * @property {Headers} requestHeaders - The request headers.
   * @property {Headers} requestHeaders - 请求头。
   *
   * @property {Headers} responseHeaders - The response headers.
   * @property {Headers} responseHeaders - 响应头。
   */
  options<T = any, P = any>(url: string, params: P = {} as P, options?: Omit<JFetchOptions, 'params' | 'baseURL'>) {
    return this.request<T>(url, {
      ...options,
      params: params as unknown as JFetchOptions['params'],
      method: Method.OPTIONS
    })
  }

  /**
   * Request interceptor manager.
   * 请求拦截器管理器。
   */
  requestInterceptor = new InterceptorManager<JFetchOptions & { url: string; headers: Headers; }>();

  /**
   * Response interceptor manager.
   * 响应拦截器管理器。
   */
  responseInterceptor = new InterceptorManager<any>();

  /**
   * Error interceptor manager.
   * 错误拦截器管理器。
   */
  errorInterceptor = new InterceptorManager<JFetchError>();

  /**
   * Error interceptor manager.
   * 错误拦截器管理器。
   */
  finallyInterceptor = new InterceptorManager<AbortController>();

  /**
   * Abort all requests.
   * 终止所有请求。
   */
  abortAll() {
    this.requestQueue.forEach(item => {
      item.abort();
    })
    this.requestQueue = [];
  }

  /**
   * Get request queue.
   * 获取请求队列。
   * @returns AbortController[]
   */
  getQueue(): AbortController[] {
    return this.requestQueue.map(item => item.getController());
  }
}

export default JFetch;
