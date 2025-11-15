export function fetchStream(filename: string) {
  fetch(`http://127.0.0.1:9000/file/stream/${ filename }`)
    .then(async rs => {
      const total = Number(rs.headers.get('Content-Length'));
      const reader = rs.body?.getReader();
      let size = 0;
      const chunks: BlobPart[] = [];

      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          const blob = new Blob(chunks);
          const url = URL.createObjectURL(blob);
          console.log(url);
          break;
        }
        console.log(size += value.length, total, size / total);
        chunks.push(value);
      }

      // reader?.read()
      //   .then(async function _({ done, value }) {
      //     if (done) {
      //       const blob = new Blob(chunks);
      //       const url = URL.createObjectURL(blob);
      //       console.log(url);
      //       return;
      //     }
      //     console.log(size += value.length, total, size / total);
      //     chunks.push(value);
      //     reader?.read().then(_);
      //   })
    }
    )
}
