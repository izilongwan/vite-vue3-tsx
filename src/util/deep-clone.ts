import { TypeCommonObject } from '@/d.types/common';

export function deepClone<T extends TypeCommonObject>(target: T, source: T = <T> {}): T {
  const weakMap = new WeakMap();
  const CONSTRUCTORS_LIST = [Date, RegExp];

  const cloneObj = (function _(target, weakMap) {
    if (!target || typeof target !== 'object') {
      return target;
    }

    const constructor = target.constructor;
    const regDateConstructor = <RegExpConstructor | DateConstructor> constructor;

    if (CONSTRUCTORS_LIST.includes(regDateConstructor)) {
      return new regDateConstructor(<any> target);
    }

    if (weakMap.has(target)) {
      return weakMap.get(target);
    }

    const cloneObj: TypeCommonObject = new (<ArrayConstructor | ObjectConstructor> constructor)();

    weakMap.set(target, cloneObj);

    for (const key in target) {
      if (Object.hasOwn(target, key)) {
        cloneObj[key] = _(target[key], weakMap);
      }
    }

    return cloneObj;
  })(target, weakMap);

  return Object.assign(source, cloneObj);
}
