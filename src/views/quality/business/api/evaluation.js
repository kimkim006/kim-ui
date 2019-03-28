/**
 * @author yonghui.wu
 * @date 2018-9-19 11:00:54
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/evaluation/listByPage',
    method: 'get',
    params: query
  });
}
export function detailList(query) {
  return fetch({
    url: baseUrl.quality + '/evaluation/detailList',
    method: 'get',
    params: query
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.quality + '/evaluation/checkUnique',
    method: 'get',
    params: {code:value}
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.quality + '/evaluation/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/evaluation/find',
    method: 'get',
    params:{"id":id}
  });
}
export function getOrigScore() {
  return fetch({
    url: baseUrl.quality + '/evaluation/getOrigScore',
    method: 'get'
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.quality + '/evaluation/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.quality + '/evaluation/update',
    method: 'post',
    data: obj
  });
}
