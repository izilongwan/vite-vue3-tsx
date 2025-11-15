// type TypeCommonFn = (...args: any[]) => any;

interface RequestResult<T> {
  data: T | null
  error: Error | null | unknown,
  status: 0 | 1 | 2
}

// 挑选出 RequestResult data 和 error 属性

type T1 = Pick<RequestResult<1>, 'data' | 'error'>
type T2 = Extract<RequestResult<number>, 'error'>

export function requestSync<T>(fn: () => Promise<T>) {
  const result: RequestResult<T> = {
    data: null,
    error: null,
    status: 0,
  }

  const runFunc = (): T | RequestResult<T>['error'] => {
    if (result.status !== 0) {
      switch (result.status) {
        case 1:
          return result.data;
        case 2:
          return result.error;
        default:
          break;
      }
    }

    fn()
      .then((json) => json.json())
      .then((data: T) => {
        result.data = data
        result.status = 1
      })
      .catch((error) => {
        result.error = error
        result.status = 2
      })
      .finally(() => {
        throw new Error();
      });

  }

  try {
    runFunc();
  } catch (error) {
    if (error instanceof Promise) {
      return runFunc();
    }
    throw error;
  }
}
