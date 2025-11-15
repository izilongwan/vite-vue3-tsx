import { TypeCommonFn } from '@/d.types/common';
import { TypeComputedFn } from './reactive';

export class Dep {
  static #effecFn: TypeComputedFn | TypeCommonFn | null = null;

  /**
   * map:
   * target ->
   *  key ->
   *    dep
   */
  #depMap = new WeakMap<object, any>();

  static setEffecFn(fn: TypeComputedFn | TypeCommonFn) {
    Dep.#effecFn = fn;
  }

  static clearEffecFn() {
    Dep.#effecFn = null;
  }

  getDepMap() {
    return this.#depMap;
  }

  depend(target: object, key: string | symbol) {
    let keyMap: Map<typeof key, any> = this.#depMap.get(target);
    if (!keyMap) {
      keyMap = new Map<string, any>();
      this.#depMap.set(target, keyMap);
    }

    let dep: Set<TypeComputedFn | TypeCommonFn> = keyMap.get(key);
    if (!dep) {
      dep = new Set();
      keyMap.set(key, dep);
    }

    if (Dep.#effecFn) {
      dep.add(Dep.#effecFn);
    }
  }

  notify<T>(target: object, key: string | symbol, value: T, oldValue: T) {
    const keyMap: Map<typeof key, any> | undefined = this.#depMap.get(target);
    if (!keyMap) return;

    const deps: Set<TypeComputedFn | TypeCommonFn> | undefined = keyMap.get(key);
    if (!deps) return;

    const runDeps = new Set<TypeComputedFn | TypeCommonFn>();

    deps.forEach((fn) => fn !== Dep.#effecFn && runDeps.add(fn));

    runDeps.forEach((fn) => {
      Promise.resolve().then(() => {
        const result = fn(value, oldValue);

        if ((<TypeComputedFn> fn)._value) {
          (<TypeComputedFn> fn)._value.value = result;
        }
      });
    });
  }
}

export const dep = new Dep();
