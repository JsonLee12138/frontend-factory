## JFetch Documentation
[中文文档](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/fetch/README.md)

### Introduction
JFetch is an HTTP request library based on `fetch` that provides a similar experience to `axios`. It not only supports common HTTP request methods but also adds stream handling and a more concise request aborting method.

### Differences from axios
- **Stream Handling Support**: JFetch has built-in support for stream handling, making it easy to process streaming response data.
- **Simpler Request Aborting Method**: JFetch offers a more concise request aborting method. You can abort a request simply by calling the `abort` method on the request instance.
- **Uses fetch**: JFetch is based on `fetch`, enjoying all the advantages of `fetch`, such as native support and good browser compatibility.

### Usage

#### Installation
```bash
npm install jsonlee-fetch
```

#### Import
```javascript
import JFetch, { request, get, post, put, del, patch, head, options } from 'jsonlee-fetch';
```

#### Configuration Options
```typescript
/**
 * JFetch request configuration options.
 *
 * @param {string} url Request URL
 * @param {Record<string, any>} [params] Query parameters to include in the request URL.
 * @param {Record<string, any> | null | string} [data] Request parameters.
 * @param {number} [timeout] Request timeout duration in milliseconds.
 * @param {boolean} [isStream] Whether the response should be treated as a stream.
 * @param {<T>(chunk: T) => void} [streamCallback] Callback function for handling stream chunks.
 * @param {string} [baseURL] Base URL for the request.
 * @property {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - Specifies the array format to use when serializing array parameters with `qs.stringify`, default value is `"repeat"`.
 *   - `"indices"`: Serializes arrays as indexed keys, e.g., `array[0]=1&array[1]=2`.
 *   - `"brackets"`: Serializes arrays as bracketed keys, e.g., `array[]=1&array[]=2`.
 *   - `"repeat"`: Serializes arrays as repeated keys, e.g., `array=1&array=2`.
 *   - `"comma"`: Serializes arrays as comma-separated values, e.g., `array=1,2`.
 *   - `undefined`: Uses the default array format of `qs.stringify`.
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 * @param {ResponseInterceptor} [responseInterceptor] Interceptor for processing the response.
 * @param {RequestInterceptor} [requestInterceptor] Interceptor for processing the request.
 * @param {ErrorInterceptor} [errorInterceptor] Interceptor for processing the request errors.
 */
```

### API Documentation

#### Constructor
```javascript
const jfetch = new JFetch({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});
```

#### Request Methods
JFetch provides request methods similar to axios:

- **get**
```typescript
jfetch.get<T, P>(url: string, params?: P, options?: Omit<JFetchOptions, 'params' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **post**
```typescript
jfetch.post<T, D>(url: string, data?: D, options?: Omit<JFetchOptions, 'data' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **put**
```typescript
jfetch.put<T, D>(url: string, data?: D, options?: Omit<JFetchOptions, 'data' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **delete**
```typescript
jfetch.delete<T>(url: string, options?: Omit<JFetchOptions, 'data' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **patch**
```typescript
jfetch.patch<T, D>(url: string, data?: D, options?: Omit<JFetchOptions, 'data' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **head**
```typescript
jfetch.head<T, P>(url: string, params?: P, options?: Omit<JFetchOptions, 'params' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **options**
```typescript
jfetch.options<T, P>(url: string, params?: P, options?: Omit<JFetchOptions, 'params' | 'baseURL'>): JFetchAbortablePromise<T>
```

#### Static Methods
JFetch also provides static methods for use without instantiation:
- **request**
```typescript
JFetch.request<T = any>(url: string, options?: JFetchOptions): JFetchAbortablePromise<T>
```
- **get**
```typescript
JFetch.get<T = any, P = any>(url: string, params?: P, options?: Omit<JFetchOptions, 'params' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **post**
```typescript
JFetch.post<T = any, D = any>(url: string, data?: D, options?: Omit<JFetchOptions, 'data' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **put**
```typescript
JFetch.put<T = any, D = any>(url: string, data?: D, options?: Omit<JFetchOptions, 'data' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **delete**
```typescript
JFetch.delete<T = any>(url: string, options?: Omit<JFetchOptions, 'data' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **patch**
```typescript
JFetch.patch<T = any, D = any>(url: string, data?: D, options?: Omit<JFetchOptions, 'data' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **head**
```typescript
JFetch.head<T = any, P = any>(url: string, params?: P, options?: Omit<JFetchOptions, 'params' | 'baseURL'>): JFetchAbortablePromise<T>
```
- **options**
```typescript
JFetch.options<T = any, P = any>(url: string, params?: P, options?: Omit<JFetchOptions, 'params' | 'baseURL'>): JFetchAbortablePromise<T>
```

### Aborting Requests
You can easily abort a request by calling the `abort` method on the request instance:
```javascript
const req = jfetch.get('/endpoint');
req.abort();  // Abort the request
```

#### Aborting All Requests
```javascript
jfetch.abortAll();
```

### Interceptors
JFetch provides request and response interceptors, allowing you to process the request before sending it or the response after it arrives.
```typescript
jfetch.requestInterceptor.use(async (config) => {
  // Process before the request is sent
  return config;
});

jfetch.responseInterceptor.use(async (response) => {
  // Process after the response arrives
  return response;
});

jfetch.errorInterceptor.use(async (error: JFetchError) => {
  // Process on request error
  return response;
});

jfetch.finallyInterceptor.use(async (controller: AbortController) => {
  // Processing request completed
})
```
