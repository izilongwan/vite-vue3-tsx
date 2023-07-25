import { execHttp, http, HttpResponse, queryHttp } from '@/util/http'

const { VITE_API_URL } = import.meta.env

export function getTestManu() {
  return http({
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

export function getBlogs() {
  return queryHttp<Blog[]>({ apiCode: 'GET_BLOG' })
}

export function getBlogDetail(bId: string) {
  return queryHttp<BlogDetail[]>({ apiCode: 'GET_BLOG_DETAIL', param: { bId } })
}

export function addBlogDetail(param: BlogDetail) {
  return execHttp<number>({ apiCode: 'ADD_BLOG_DETAIL', param })
}

export function updateBlogDetail(param: BlogDetail) {
  return execHttp<number>({ apiCode: 'UPDATE_BLOG_DETAIL', param })
}

export interface ApiCode {
  apiCode: string;
  apiSql: string;
  description: string;
  apiType: string;
}

export function getApiCode(param: Record<string, unknown> = {}) {
  return queryHttp<HttpResponse<ApiCode[]>>({ apiCode: 'GET_API_CODE', ...param }, true)
}
