import '@/style/base.less'
import { defineComponent, KeepAlive, onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { recordEvent, reportEvent } from './api/rrweb';
import { record } from 'rrweb';

export default defineComponent({
  setup(props, ctx) {

    onMounted(() => {
      record({
        emit: recordEvent,
      });

      window.addEventListener('error', (event) => {
        const { filename: reportFilename, message: reportMessage, type: reportType } = event;
        reportEvent({
          reportFilename,
          reportMessage,
          reportName: reportMessage,
          reportError: JSON.stringify(event.error),
          reportType
        });
      });
    })

    return () =>
      <RouterView>
        {
          ({ Component }: { Component: typeof RouterView }) => (
            <KeepAlive>
              <Component />
            </KeepAlive>
          )
        }
      </RouterView>
  }
})
