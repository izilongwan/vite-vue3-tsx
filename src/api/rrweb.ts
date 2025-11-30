import { PageData, TypeCommonObject } from '@/d.types/common';
import { http } from '@/util/http';

const { VITE_API_URL } = import.meta.env;

const eventList: Event[] = [];
const MAX_COUNT = 500;

export function recordEvent(event: Event) {
  if (eventList.length >= MAX_COUNT) {
    eventList.splice(MAX_COUNT / 2);
  }
  eventList.push(event);
}

export function getRecordedEvents() {
  return eventList;
}

export function reportEvent(info: TypeCommonObject) {
  return http({
    url: `${ VITE_API_URL }/webreport/save`,
    data: { reportContent: JSON.stringify(eventList), ...info }
  });
}

export interface ReportItem {
  id: string;
  reportName: string;
  reportContent: string;
  reportType: string;
  reportFilename: string;
  reportMessage: string;
  reportError: string;
  createTime: string;
  updateTime: string;
}


export function getReportList({ pageNum, pageSize }: { pageNum: number; pageSize: number; }) {
  return http<PageData<ReportItem>>({
    url: `${ VITE_API_URL }/webreport/list/${ pageNum }/${ pageSize }`,
  });
}

export function getReportDetail(id: string) {
  return http<ReportItem>({
    method: 'GET',
    url: `${ VITE_API_URL }/webreport/detail/${ id }`,
  });
}
