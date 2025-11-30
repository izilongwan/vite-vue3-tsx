import { getReportDetail, getReportList, ReportItem } from '@/api/rrweb';
import { ElButton } from 'element-plus';
import { Replayer } from 'rrweb';
import { defineComponent, ref } from 'vue';
import styles from './index.module.less';

export default defineComponent({
  name: 'WebReportPage',

  setup() {

    const reportData = ref<ReportItem[]>([]);

    // 加载列表（可以按需改成 onMounted 里调用）
    getReportList({ pageNum: 1, pageSize: 10 })
      .then(rs => {
        reportData.value = rs.data?.records ?? [];
      })
      .catch(err => {
        console.error('获取报告列表失败:', err);
      });

    let replayer: Replayer | null = null;
    const rootElRef = ref<HTMLElement | null>();

    // 统一解析 events
    function parseEvents(content: string | null | undefined) {
      if (!content || typeof content !== 'string') return null;
      try {
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : null;
      } catch (e) {
        console.error('reportContent 解析失败:', e, content);
        return null;
      }
    }

    // 获取详情并播放
    async function getReportDetailById(id: string) {
      try {
        const rs = await getReportDetail(id);
        const events = parseEvents(rs.data?.reportContent);
        if (!events || !events.length) {
          console.warn('无有效回放数据');
          return;
        }

        if (!replayer) {
          replayer = new Replayer(events, {
            root: rootElRef.value!,
            UNSAFE_replayCanvas: true,
          });

          // 循环播放
          replayer.on('finish', () => {
            if (!replayer) return;
            replayer.play(0);
          });
        } else {
          replayer.pause();
          replayer.resetCache();
          replayer.setConfig({ events });
        }

        replayer.play(0);
      } catch (err) {
        console.error('获取报告详情失败:', err);
      }
    }

    let oTargetTitle: HTMLElement | null = null;

    function handlePlay(e: Event, item: ReportItem) {
      // 停止当前播放
      if (replayer) {
        replayer.pause();
        replayer.resetCache();
      }

      // 处理选中样式
      if (oTargetTitle) {
        oTargetTitle.classList.remove(styles.active);
      }

      const target = e.currentTarget as HTMLElement | null;
      const summaryEl = target?.closest('.summary') as HTMLElement | null;
      // 根据真实 DOM 结构选择到标题节点，这里示例用 querySelector
      const titleEl = summaryEl?.firstChild as HTMLElement;

      if (titleEl) {
        titleEl.classList.add(styles.active);
        oTargetTitle = titleEl;
      } else {
        oTargetTitle = null;
      }

      getReportDetailById(item.id);
    }

    return {
      rootElRef,
      handlePlay,
      getReportDetailById,
      reportData,
    };
  },

  render() {

    return (
      <div class={ styles['webreport-page'] }>
        <div class={ styles.report_main }>
          <div class={ styles['report_main-left'] }>
            {
              this.reportData.map(item => (<p>
                <summary class="summary">
                  <div>
                    <div>{ item.reportName }</div>
                    <div><strong>{ item.createTime }</strong></div>
                  </div>
                  <ElButton size="mini" onClick={ (e: Event) => this.handlePlay(e, item) }>回放</ElButton>
                  <details>
                    {
                      Object.entries(item).map(([key, value], idx) => (
                        <div key={ idx }>
                          <strong>{ key }:</strong>
                          <span>{ value }</span>
                        </div>
                      ))
                    }
                  </details>
                </summary>
                <hr />
              </p>))
            }
          </div>
          <div class={ styles['report_content'] } ref={ (el) => this.rootElRef = el as HTMLElement }></div>
        </div>

      </div>
    );
  }
});
