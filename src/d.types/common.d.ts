export type TypeCommonFn = (...args: any[]) => any;

export type TypeCommonConstructor<T = any> = new (...args: any[]) => T;

export type TypeCommonObject = Record<string, any>;
