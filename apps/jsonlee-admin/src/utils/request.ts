import emitter from './emitter';
import { EmitterEvents } from '../enum/emitter';
import JFetch, {
  JFetchRequestOptions,
  StatusCode,
  ContentType,
} from 'jsonlee-fetch';
import { message } from 'antd';
import { getDeviceId } from './deviceId';
import { getAccessToken } from './token';
import { Result } from '../types/api';
import { RequestOptions } from '@/types/request';
let isLoading = false;
let hasToast = false;
const basePath = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;

const jftech = new JFetch({
  baseURL: basePath,
  headers: {
    'Content-Type': ContentType.JSON,
    'X-Requested-With': 'XMLHttpRequest',
    'X-Client-Type': 'WEB',
  },
  credentials: 'include',
});

jftech.requestInterceptor.use(async (_config) => {
  setLoading();
  const [deviceId, accessToken] = await Promise.all([
    getDeviceId(),
    getAccessToken(),
  ]);
  if (deviceId) {
    _config.headers.set('X-Access-Device-Id', deviceId);
  }
  if (accessToken) {
    _config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const _time = _config.headers.get('X-Access-Time');
  if (!_time) {
    _config.headers.set('X-Request-Timestamp', Date.now().toString());
  }
  const contentType = _config.headers.get('content-type');
  if (contentType?.includes('multipart/form-data')) {
    _config.headers.delete('content-type');
  }
  return _config;
});

jftech.responseInterceptor.use(async (_response) => {
  return checkRes(_response);
});

jftech.errorInterceptor.use(async (_err) => {
  if (!hasToast) {
    hasToast = true;
    switch (_err.code) {
      case StatusCode.ABORTED:
        return Promise.reject();
      case StatusCode.NETWORK_ERROR:
        message.error('网络异常, 请重试!');
        break;
      case StatusCode.TIME_OUT:
        message.error('请求超时, 请重试!');
        break;
      default:
        message.error(_err.message || '请求失败, 请重试!');
        break;
    }
    setTimeout(() => {
      hasToast = false;
    }, 1500);
  }
  // return Promise.resolve(_err);
  return _err;
});

jftech.finallyInterceptor.use(() => {
  clearLoading();
});

function setLoading() {
  if (!isLoading) {
    emitter.emit(EmitterEvents.SET_LOADING);
    isLoading = true;
  }
}

function clearLoading() {
  const _queue = jftech.getQueue();
  if (_queue.length < 1) {
    emitter.emit(EmitterEvents.CLEAR_LOADING, false);
    isLoading = false;
  }
}

export const cancelAll = jftech.abortAll;
export const request = <T>(url: string, options: JFetchRequestOptions) =>
  jftech.request<Result<T>>(url, options);

function checkRes<T>(res: Result<T>) {
  if (res.code === 200) {
    return res;
  }
  if (res.code === 401) {
    emitter.emit(EmitterEvents.AUTH_EXPIRED);
    return Promise.reject({ code: res.code, message: res.msg });
  }
  return Promise.reject({ code: res.code, message: res.msg });
}

export const get = <T, P extends object = object>(
  url: string,
  params: P = {} as P,
  options: RequestInit = {},
) => {
  return jftech.get<Result<T>, P>(url, params, { ...options, method: 'GET' });
};

export const post = <T, D extends object = object>(
  url: string,
  data: D = {} as D,
  options: RequestInit = {},
) => {
  return jftech.post<Result<T>, D>(url, data, { ...options, method: 'POST' });
};

export const put = <T, D extends object = object>(
  url: string,
  data: D = {} as D,
  options: RequestInit = {},
) => {
  return jftech.put<Result<T>, D>(url, data, { ...options, method: 'PUT' });
};

export const del = <T>(url: string, options: RequestOptions = {}) => {
  return jftech.delete<Result<T>>(url, { ...options, method: 'DELETE' });
};

export const upload = async <T>(
  url: string,
  data: FormData,
  options: RequestOptions = {},
) => {
  return jftech.request<Result<T>>(url, {
    ...options,
    data,
    method: 'POST',
    headers: {
      ...(options.headers || {}),
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default jftech;
