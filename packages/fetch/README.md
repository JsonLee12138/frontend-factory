## JFetch文档
[English Documents](https://github.com/JsonLee12138/frontend-factory/blob/main/packages/fetch/README.en.md)

### 介绍
JFetch是一个基于`fetch`的HTTP请求库，提供了类似于`axios`的使用体验。它不仅支持常见的HTTP请求方法，还增加了流处理和更简洁的请求中止方法。

### 与axios的区别
- **流处理支持**：JFetch内置了对流处理的支持，可以方便地处理流式响应数据。
- **更简洁的请求中止方法**：JFetch提供了更简洁的请求中止方法，通过调用请求实例的`abort`方法即可终止请求。
- **使用fetch**：JFetch基于`fetch`实现，享有`fetch`的所有优势，如原生支持、良好的浏览器兼容性等。

### 使用方法

#### 安装
```bash
npm install jsonlee-fetch
```

#### 导入
```javascript
import JFetch, { request, get, post, put, del, patch, head, options } from 'jsonlee-fetch';
```

#### 配置选项
```typescript
/**
 * JFetch 请求的配置选项。
 *
 * @param {string} url 请求地址
 * @param {Record<string, any>} [params] 请求 URL 中包含的查询参数。
 * @param {Record<string, any> | null | string} [data] 请求参数。
 * @param {number} [timeout] 请求的超时时间（毫秒）。
 * @param {boolean} [isStream] 响应是否应视为流。
 * @param {<T>(chunk: T) => void} [streamCallback] 处理流块的回调函数。
 * @param {string} [baseURL] 请求的基础 URL。
 * @param {"indices" | "brackets" | "repeat" | "comma" | undefined} [qsArrayFormat]
 * - 指定在使用 `qs.stringify` 序列化数组参数时使用的数组格式, 默认值是`"repeat"`。
 *   - `"indices"`：将数组序列化为带有索引的键值对，例如，`array[0]=1&array[1]=2`。
 *   - `"brackets"`：将数组序列化为带有方括号的键值对，例如，`array[]=1&array[]=2`。
 *   - `"repeat"`：将数组序列化为重复的键值对，例如，`array=1&array=2`。
 *   - `"comma"`：将数组序列化为逗号分隔的字符串，例如，`array=1,2`。
 *   - `undefined`：使用 `qs.stringify` 的默认数组格式。
 *
 * @param {ResponseInterceptor} [responseInterceptor] 处理响应的拦截器。
 * @param {RequestInterceptor} [requestInterceptor] 处理请求的拦截器。
 */
```

### API文档

#### 构造函数
```javascript
const jfetch = new JFetch({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});
```

#### 请求方法
JFetch提供了与axios类似的请求方法：

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

#### 静态方法
JFetch还提供了一些静态方法，便于无需实例化即可使用：
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

### 中止请求
通过调用请求实例的`abort`方法可以轻松中止请求：
```javascript
const req = jfetch.get('/endpoint');
req.abort();  // 中止请求
```

#### 中止所有请求
```javascript
jfetch.abortAll();
```

### 拦截器
JFetch提供了请求和响应拦截器，可以在请求发送前或响应到达后进行处理。
```typescript
jfetch.requestInterceptor.use(async (config) => {
  // 在请求发送前做一些处理
  return config;
});

jfetch.responseInterceptor.use(async (response) => {
  // 在响应到达后做一些处理
  return response;
});

jfetch.errorInterceptor.use(async (error: JFetchError) => {
  // 在请求错误做一些处理
  return response;
});

jfetch.finallyInterceptor.use(async (controller: AbortController) => {
  // 处理请求完成
})
```
