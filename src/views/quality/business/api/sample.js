/**
 * @author bo.liu01
 * @date 2018-8-28 18:24:20
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/sample/listByPage',
    method: 'get',
    params: query
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.quality + '/sample/checkUnique',
    method: 'get',
    params: {code:value}
  });
}

export function execute(obj) {
  return fetch({
    url: baseUrl.quality + '/sample/execute',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/sample/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.quality + '/sample/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function delSampleDetal(obj) {
  return fetch({
    url: baseUrl.quality + '/sample/deleteDetail',
    method: 'post',
    data:obj
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.quality + '/sample/update',
    method: 'post',
    data: obj
  });
}

export function ruleRree(obj) {
  return fetch({
    url: baseUrl.quality + '/sample/listTree',
    method: 'get',
    params: obj
  });
}
