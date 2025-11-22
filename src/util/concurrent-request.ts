import { TypePromiseFn } from '@/d.types/common';

export class ConcurrentRequest {
  #limitCount: ConcurrentRequestOptions['limitCount'] = 3;
  #queue: ConcurrentRequestOptions['queue'] = [];
  #resultIndex = 0;
  #results: Array<{
    result: object | null;
    error?: Error
  }> = [];

  constructor({ limitCount, queue }: ConcurrentRequestOptions) {
    this.#limitCount = limitCount;
    this.#queue = queue;
  }

  #doRun() {
    let maxCount = Math.min(this.#limitCount, this.#queue.length);

    while (maxCount--) {
      const request = this.#queue.shift();
      this.#handleRequest(request, this.#resultIndex++);
    }
  }

  #handleRequest(request: TypePromiseFn, index: number) {
    this.#limitCount--;
    request()
      .then((res) => {
        this.#results[index] = {
          result: res,
        }
      })
      .catch((error) => {
        this.#results[index] = {
          result: null,
          error,
        }
      })
      .finally(() => {
        this.#limitCount++;
        this.#doRun();
      });
  }

  add(request: TypePromiseFn | TypePromiseFn[]) {
    if (Array.isArray(request)) {
      this.#queue.push(...request);
    } else {
      this.#queue.push(request);
    }
  }

  run() {
    this.#doRun();
  }

  getResults() {
    return this.#results;
  }
}

interface ConcurrentRequestOptions {
  limitCount: number;
  queue: Array<TypePromiseFn>;
}
