import { TypeCommonObject } from '@/d.types/common';
import { LoadingMethod } from '@/hook';

const { VITE_API_URL_QUERY, VITE_API_URL_EXEC } = import.meta.env

type HttpParam = RequestInit & {
  url?: string
  data?: TypeCommonObject;
  timeout?: number
  abortController?: AbortController;
  cacheTimeout?: number;
  withCredentials?: boolean;
  maxRetries?: number;
}

export interface HttpResponse<T = any> {
  code: number;
  data: T;
  message: string;
  timestamp: number;
  timecost: number;
  total: number;
  path: string;
  query: string;
  status?: number;
}

export interface RequestFn<T> {
  (): Promise<HttpResponse<T>>;
  retryCount?: number;
  abortController: AbortController;
}

export function http<T>(param: HttpParam, setLoading?: LoadingMethod) {
  const {
    method = 'POST',
    url = VITE_API_URL_QUERY,
    data: body = param.method === 'GET' ? undefined : {},
    timeout = 1000 * 10,
    abortController = new AbortController(),
    withCredentials,
    cacheTimeout = 200,
    maxRetries = 3 } = param;

  let { signal } = abortController;

  const key = JSON.stringify(param);
  setLoading?.(true)

  const requestFn: RequestFn<T> = () => {
    if (cacheMap.has(key)) {
      const cached = cacheMap.get(key);
      if (cached) {
        return cached;
      }
    }

    const promise: Promise<HttpResponse<T>> = fetch(url, {
      method,
      signal,
      body: JSON.stringify(body),
      credentials: withCredentials ? 'include' : 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(json => json.json() as unknown as HttpResponse<T>)
      .then(rs => {
        // 错误响应
        if (rs.status === 500) {
          throw rs;
        }
        return rs;
      })
      .catch(async err => {
        const retryResult = await retryRequest();
        if (retryResult) {
          return retryResult;
        }
        throw err;
      })
      .finally(() => setLoading?.(false))

    handleCache(key, promise, cacheTimeout);

    return promise;
  };

  requestFn.abortController = abortController;

  const retryRequest = async () => {
    requestFn.retryCount ??= 1;
    if (requestFn.retryCount < maxRetries) {
      requestFn.retryCount++;
      requestFn.abortController.abort({ code: 500, message: `请求错误` });
      cacheMap.delete(key);
      requestFn.abortController = new AbortController();
      signal = requestFn.abortController.signal;
      return await Promise.race([requestFn(), timeoutFn()]);
    }
  };

  const timeoutFn = () => new Promise<HttpResponse<T>>((resolve, reject) => {
    setTimeout(async () => {
      // reject({ code: 500, message: `请求超时` });
      requestFn.abortController.abort({ code: 500, message: `请求超时` });
      cacheMap.delete(key);
    }, timeout);
  })
    .finally(() => setLoading?.(false))

  return Promise.race([requestFn(), timeoutFn()]);
}

export function queryHttp<T>(data: HttpParam['data'], setLoading?: LoadingMethod) {
  return http<T>({ data }, setLoading).then(rs => rs.data as T);
}

export function queryHttpOrigin<T>(data: HttpParam['data'], setLoading?: LoadingMethod) {
  return http<T>({ data }, setLoading)
}

export interface ApiCodeData<T> {
  data: T
  json: Record<string, unknown>
}

export function execHttp<T = HttpResponse<number>>(data: HttpParam['data'], setLoading?: LoadingMethod) {
  const param = { url: VITE_API_URL_EXEC, data, method: 'PUT' };
  return http<T>(param, setLoading)
}

const cacheMap = new Map<string, Promise<HttpResponse>>();

function handleCache(key: string, promise: Promise<HttpResponse>, cacheTimeout: number) {
  cacheMap.set(key, promise);
  setTimeout(() => {
    cacheMap.delete(key);
  }, cacheTimeout);
}
