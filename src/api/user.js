import request from '@/utils/request'

export function getAllprovinces (data) {
  return request({
    url: '/extendApp/getAllProvinces',
    method: 'get',
    params: data
  })
}
