/**
 * @author bo.liu01
 * @date 2018-9-10 10:10:11
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/recycle/listByPage',
    method: 'get',
    params: query
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/recycle/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.quality + '/recycle/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function detailListByPage(query) {
  return fetch({
    url: baseUrl.quality + '/recycle/detailListByPage',
    method: 'get',
    params: query
  });
}
export function getStatusList() {
  return fetch({
    url: baseUrl.quality + '/recycle/statusList',
    method: 'get',
    params: ''
  });
}

export function listUserByBacth(query) {
  return fetch({
    url: baseUrl.quality + '/recycle/listUserByBacth',
    method: 'get',
    params: query
  });
}

export function recycle(obj) {
  return fetch({
    url: baseUrl.quality + '/recycle/exe',
    method: 'post',
    data: obj
  });
}

