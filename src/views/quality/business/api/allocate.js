/**
 * @author bo.liu01
 * @date 2018-9-10 10:10:10
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/allocate/listByPage',
    method: 'get',
    params: query
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.quality + '/allocate/checkUnique',
    method: 'get',
    params: {code:value}
  });
}

export function allocate(obj) {
  return fetch({
    url: baseUrl.quality + '/allocate/exe',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/allocate/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.quality + '/allocate/delete',
    method: 'post',
    data:{"id": id}
  });
}
export function detailListByPage(query) {
  return fetch({
    url: baseUrl.quality + '/allocate/detailListByPage',
    method: 'get',
    params: query
  });
}

