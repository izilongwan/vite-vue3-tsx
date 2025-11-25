import { TypeCommonConstructor, TypeCommonObject } from '@/d.types/common';

export function deepClone<T extends TypeCommonObject>(target: T, source: T = <T> {}): T {
  const weakMap = new WeakMap();
  const CONSTRUCTORS_LIST = [Date, RegExp];
  const TYPE_REG = /^\[object (.+)\]$/

  const cloneObj = (function _(target, weakMap) {
    if (!target || typeof target !== 'object') {
      return target;
    }

    const constructor = <TypeCommonConstructor> target.constructor;

    if (CONSTRUCTORS_LIST.includes(constructor)) {
      return new constructor(target);
    }

    if (weakMap.has(target)) {
      return weakMap.get(target);
    }

    const cloneObj: TypeCommonObject = new constructor();

    weakMap.set(target, cloneObj);

    for (const key in target) {
      if (Object.hasOwn(target, key)) {
        const originValue = target[key];
        const typeString = Object.prototype.toString.call(originValue);
        const value = _(originValue, weakMap);
        const [__, type] = typeString.match(TYPE_REG) || [];

        switch (type) {
          case 'Set':
            (<Set<unknown>> cloneObj).add(value);
            break;
          case 'Map':
            (<Map<unknown, unknown>> cloneObj).set(key, value);
            break;
          default:
            cloneObj[key] = value;
            break;
        }
      }
    }

    return cloneObj;
  })(target, weakMap);

  return Object.assign(source, cloneObj);
}
