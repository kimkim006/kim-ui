/**
 * @author bo.liu01
 * @date 2018-8-16 18:34:17
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/tape/listByPage',
    method: 'get',
    params: query
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.quality + '/tape/checkUnique',
    method: 'get',
    params: {code:value}
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.quality + '/tape/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/tape/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.quality + '/tape/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.quality + '/tape/update',
    method: 'post',
    data: obj
  });
}
