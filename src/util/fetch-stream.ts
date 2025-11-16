export interface FetchStreamOptions {
  url: string;
  onProcess?(percentage: number): void;
  onFinish?(blob: Blob): void;
}

export class FetchStream {
  #options: FetchStreamOptions;

  constructor(option: FetchStreamOptions) {
    this.#options = option;
    this.#doFetch();
  }

  #doFetch() {
    fetch(this.#options.url)
      .then(async rs => {
        const total = Number(rs.headers.get('Content-Length'));
        const reader = rs.body?.getReader();
        let size = 0;
        const chunks: BlobPart[] = [];

        while (true) {
          const { done, value } = await reader!.read();
          if (done) {
            const blob = new Blob(chunks);
            this.#onFinish(blob);
            break;
          }
          size += value.length;
          const percentage = (size / total * 100).toFixed(2);
          this.#onProcess?.(Number(percentage));
          chunks.push(value);
        }
      }
      );
  }

  #onProcess(percentage: number): void {
    this.#options.onProcess?.(percentage);
  }

  #onFinish(blob: Blob): void {
    this.#options.onFinish?.(blob);
  }
}
