import { getReportDetail, getReportList, ReportItem } from '@/api/rrweb';
import { ElButton } from 'element-plus';
import { Replayer } from 'rrweb';
import { defineComponent, ref } from 'vue';
import styles from './index.module.less';

export default defineComponent({
  name: 'WebReportPage',

  setup() {

    const reportData = ref<ReportItem[]>([]);
    getReportList({ pageNum: 1, pageSize: 10 }).then(rs => {
      reportData.value = rs.data.records;
    });

    let replayer: Replayer | null = null;
    function getReportDetailById(id: string) {
      getReportDetail(id).then(rs => {
        if (!rs.data.reportContent) {
          return;
        }

        if (!replayer) {
          replayer = new Replayer(rs.data.reportContent ? JSON.parse(rs.data.reportContent) : [], {
            root: document.querySelector('.J_report_content') as HTMLElement,
            UNSAFE_replayCanvas: true,
          }) as Replayer;
          // 注册循环播放
          replayer.on('finish', () => {
            // 从头开始再播一遍
            // 可选：先 resetCache，再 play(0)
            replayer!.play(0);
          });
        } else {
          replayer.pause();
          replayer.resetCache();
          replayer.setConfig({
            events: rs.data.reportContent ? JSON.parse(rs.data.reportContent) : [],
          });
        }
        replayer.play(0);
      });
    }

    let oTargetTitle: HTMLElement | null = null;
    function handlePlay(e: Event, item: ReportItem) {
      if (replayer) {
        replayer.pause();
        replayer.resetCache();
      }

      if (oTargetTitle) {
        oTargetTitle.classList.remove(styles.active);
      }
      oTargetTitle = (e.target as HTMLElement)?.closest('.summary')?.firstChild as HTMLElement;
      oTargetTitle?.classList.add(styles.active);
      getReportDetailById(item.id);
    }

    return {
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
          <div class={ ['J_report_content', styles['report_content']].join(' ') }></div>
        </div>

      </div>
    );
  }
});
