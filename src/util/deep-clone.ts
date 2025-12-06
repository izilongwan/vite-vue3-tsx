import { TypeCommonConstructor, TypeCommonObject } from '@/d.types/common';

// 特殊构造函数映射
const SPECIAL_CONSTRUCTORS = new Set<TypeCommonConstructor>([Date, RegExp]);

// 获取对象类型
function getType(obj: unknown): string {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

// 处理集合类型的克隆
function cloneCollectionValue(type: string, cloneObj: TypeCommonObject, key: string | number, value: unknown): boolean {
  switch (type) {
    case 'Set':
      (cloneObj as Set<TypeCommonObject>).add(value);
      return true;
    case 'Map':
      (cloneObj as Map<unknown, unknown>).set(key, value);
      return true;
    default:
      return false;
  }
}

export function deepClone<T extends TypeCommonObject>(target: T, source: T = <T> {}): T {
  const weakMap = new WeakMap<T, T>();

  function clone(obj: T): T {
    // 处理基本类型
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    const constructor = Object.getPrototypeOf(obj).constructor as TypeCommonConstructor;

    // 处理特殊构造函数（Date、RegExp）
    if (SPECIAL_CONSTRUCTORS.has(constructor)) {
      return new constructor(obj);
    }

    // 处理循环引用
    if (weakMap.has(obj)) {
      return weakMap.get(obj)!;
    }

    // 创建新对象
    const clonedObj = new constructor() as TypeCommonObject;
    weakMap.set(obj, clonedObj as T);

    // 遍历并克隆属性
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        const value = clone(obj[key]);
        const type = getType(obj[key]);

        if (!cloneCollectionValue(type, clonedObj, key, value)) {
          clonedObj[key] = value;
        }
      }
    }

    return clonedObj as T;
  }

  const clonedObj = clone(target) as T;
  return Object.assign(source, clonedObj);
}
