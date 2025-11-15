import { TypeCommonFn, TypeCommonObject } from '@/d.types/common';
import { Dep, dep } from './dep';

export function reactive<T extends TypeCommonObject>(data: T): T {
  return new Proxy(data, {
    get(target, key, receiver) {
      // console.log(`获取属性${ String(key) }`);
      const value = Reflect.get(target, key, receiver);
      dep.depend(target, key);
      return typeof value === 'object' && value !== null ? reactive(value) : value;
    },
    set(target, key, value, receiver) {
      console.log(`设置属性${ String(key) }，新值为${ value }`);
      const oldValue = Reflect.get(target, key, receiver);
      const isOk = Reflect.set(target, key, value, receiver);

      if (Object.is(value, oldValue)) {
        return isOk;
      }

      dep.notify(target, key, value, oldValue);

      return isOk;
    },
  });
}

export function watchEffect(fn: TypeCommonFn) {
  Dep.setEffecFn(fn);
  fn();
  Dep.clearEffecFn();
}

export function watch<T>(watcher: () => T, fn: (value: T, oldValue: T) => void) {
  Dep.setEffecFn(fn);
  watcher();
  Dep.clearEffecFn();
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
