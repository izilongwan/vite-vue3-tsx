export type TypeCommonFn = (...args: any[]) => any;

export type TypeCommonConstructor<T = any> = new (...args: any[]) => T;

export type TypeCommonObject = Record<string, any>;

export type TypePromiseFn = () => Promise<object>;

export interface PageData<T> {
  records: T[];
  total: number;
  pages: number;
  size: number;
}
