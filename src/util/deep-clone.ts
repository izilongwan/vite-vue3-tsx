type CommonObj = Record<string, any>;

export function deepClone<T extends CommonObj>(target: T, source: T = <T> {}): T {
  const weakMap = new WeakMap();
  const CONSTRUCTORS_LIST = [Date, RegExp];

  const cloneObj = (function _(target, weakMap) {
    if (!target || typeof target !== 'object') {
      return target;
    }

    if (weakMap.has(target)) {
      return weakMap.get(target);
    }

    for (const key in target) {
      if (!Object.hasOwn(target, key)) {
        continue;
      }

      const value = target[key];

      if (CONSTRUCTORS_LIST.includes(value.constructor)) {
        return new value.constructor(value);
      }

      const cloneObj = new value.constructor();

      cloneObj[key] = _(value, weakMap);

      if (cloneObj && typeof cloneObj === 'object') {
        weakMap.set(value, cloneObj);
      }

      return cloneObj;
    }

  })(target, weakMap);

  return Object.assign(source, cloneObj);
}
