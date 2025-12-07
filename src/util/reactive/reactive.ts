import { TypeCommonFn, TypeCommonObject } from '@/d.types/common';
import { Dep, dep } from './dep';

const weakMap = new WeakMap<TypeCommonObject, TypeCommonObject>();

export function reactive<T extends TypeCommonObject>(data: T): T {
  if (weakMap.has(data)) {
    return weakMap.get(data) as T;
  }

  const proxy = new Proxy(data, {
    get(target, key, receiver) {
      // console.log(`获取属性${ String(key) }`);
      const value = Reflect.get(target, key, receiver);

      if (Array.isArray(value)) {
        dep.depend(value, Symbol.iterator);
      } else {
        dep.depend(target, key);
      }

      return typeof value === 'object' && value !== null ? reactive(value) : value;
    },
    set(target, key, value, receiver) {
      // console.log(`设置属性${ String(key) }，新值为${ value }`);
      const oldValue = Reflect.get(target, key, receiver);
      const isOk = Reflect.set(target, key, value, receiver);

      if (isArrayProperty<T>(target, key)) {
        dep.notify(target, Symbol.iterator, value, oldValue);
      }

      if (Object.is(value, oldValue)) {
        return isOk;
      }

      dep.notify(target, key, value, oldValue);

      return isOk;
    },
  });

  weakMap.set(data, proxy);

  return proxy;
}

export function isArrayProperty<T extends TypeCommonObject>(target: T, key: string | symbol) {
  return Array.isArray(target) &&
    (['push', 'pop', 'shift', 'unshift', 'splice'].includes(key as string) || isIndexKey(key));
}

function isIndexKey(key: any) {
  return typeof key === "string" && /^\d+$/.test(key);
}

export function watchEffect(fn: TypeCommonFn) {
  Dep.setEffecFn(fn);
  fn();
  Dep.clearEffecFn();
}

export function watch<T>(getter: () => T, callback: (value: T, oldValue: T) => void) {
  let oldValue: T;

  const runner = () => {
    Dep.setEffecFn(update);
    const value = getter();
    Dep.clearEffecFn();
    return value;
  };

  const update = () => {
    const newValue = getter();
    callback(newValue, oldValue);
    oldValue = newValue;
  };

  oldValue = runner();
}

export interface TypeComputedFn<T = any> {
  _value: Ref<T>;
  (): T;
}

export class Ref<T> {
  #value: T | null;
  constructor(value: T) {
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
  }
}

export function computed<T>(fn: TypeComputedFn<T>) {
  Dep.setEffecFn(fn);

  const ref = new Ref(fn());
  fn._value = ref;
  Dep.clearEffecFn();

  return ref;
}
