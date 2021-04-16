import request from '@/utils/request'

export function getRisk (query) {
  return request({
    url: '/getrisk',
    method: 'get',
    params: query
  })
}

export function getOpenLast () {
  return request({
    url: '/rest/findRecentLayers',
    method: 'post'
  })
}
