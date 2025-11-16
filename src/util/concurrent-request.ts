export class ConcurrentRequest {
  #limitCount: ConcurrentRequestOptions['limitCount'] = 3;
  #queue: ConcurrentRequestOptions['queue'] = [];
  #resultIndex = 0;
  #results: Array<{
    result: any;
    error?: Error
  }> = [];

  constructor({ limitCount, queue }: ConcurrentRequestOptions) {
    this.#limitCount = limitCount;
    this.#queue = queue;
    this.#doRunRequests();
  }

  #doRunRequests() {
    let maxCount = Math.min(this.#limitCount, this.#queue.length);

    while (maxCount--) {
      const request = this.#queue.shift();
      this.#handleRequest(request!, this.#resultIndex++);
    }
  }

  #handleRequest(request: ConcurrentRequestOptions['queue'][number], index: number) {
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
        this.#doRunRequests();
      });
  }

  getResults() {
    return this.#results;
  }
}

interface ConcurrentRequestOptions {
  limitCount: number;
  queue: Array<() => Promise<any>>;
}
