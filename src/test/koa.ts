import { TypeCommonFn } from '@/d.types/common';

export class Koa {
  #queue: TypeCommonFn[] = [];
  #runningQueue: TypeCommonFn[] = [];

  use(fns: TypeCommonFn[]) {
    this.#queue.push(...fns);
    return this;
  }

  run() {
    this.#doRun(true);
    return this;
  }

  #doRun(isInit = false) {
    if (isInit) {
      this.#runningQueue = [...this.#queue];
    }

    const next = () => {
      const fn = this.#runningQueue.shift();
      if (fn) {
        fn(next);
      }
    };

    next();
    return this;
  }
}

const koa = new Koa();

const fns = [
  (next: TypeCommonFn) => {
    console.log('fn1 start');
    next();
    console.log('fn1 end');
  },
  (next: TypeCommonFn) => {
    console.log('fn2 start');
    // next();
    console.log('fn2 end');
  },
  (next: TypeCommonFn) => {
    console.log('fn3 start');
    next();
    console.log('fn3 end');
  },
]

koa.use(fns).run().run();
