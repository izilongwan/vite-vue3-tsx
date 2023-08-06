import { LoadingMethod } from '@/hook'
import { execHttp, queryHttp, queryHttpOrigin } from '@/util/http'

const { VITE_API_URL } = import.meta.env

export function getTestManu() {
  return queryHttp({
    url: `${ VITE_API_URL }/test/manu`
  })
}

export interface Blog {
  bId: string
  author: string
  title: string
  description: string
  createTime: string
  updateTime: string
}

export interface BlogDetail extends Blog {
  text: string
  mdText: string
}

export function getBlogs(setLoading?: LoadingMethod) {
  return queryHttp<Blog[]>({ apiCode: 'GET_BLOG' }, setLoading)
}

export function getBlogDetail(bId: string, setLoading?: LoadingMethod) {
  return queryHttp<BlogDetail[]>({ apiCode: 'GET_BLOG_DETAIL', param: { bId } }, setLoading)
}

export function addBlogDetail(param: BlogDetail, setLoading?: LoadingMethod) {
  return execHttp<number>({ apiCode: 'ADD_BLOG_DETAIL', param }, setLoading)
}

export function updateBlogDetail(param: BlogDetail, setLoading?: LoadingMethod) {
  return execHttp<number>({ apiCode: 'UPDATE_BLOG_DETAIL', param }, setLoading)
}

export interface ApiCode {
  apiCode: string;
  state: number;
  description: string;
  apiType: string;
  infoJson: string
  stateTxt: string
}

export function getApiCode(param: Record<string, unknown> = {}, setLoading?: LoadingMethod) {
  return queryHttpOrigin<ApiCode[]>({ apiCode: 'GET_API_CODE', ...param }, setLoading)
}

export type ApiCodeDetail = {
  apiSql: string
} & ApiCode

export function getApiCodeDetail(param: Record<string, unknown> = {}, setLoading?: LoadingMethod) {
  return queryHttp<ApiCodeDetail[]>({ apiCode: 'GET_API_CODE_DETAIL', param }, setLoading)
}

export function updateApiCodeDetail(param: ApiCodeDetail, setLoading?: LoadingMethod) {
  return execHttp<number>({ apiCode: 'UPDATE_API_CODE_DETAIL', param }, setLoading)
}
