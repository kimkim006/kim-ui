/**
 * @author jianming.chen
 * @date 2018-9-10 14:40:52
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function tree() {
  return fetch({
    url: baseUrl.quality + '/evaluationSetting/listTree',
    method: 'get'
  });
}

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/evaluationSetting/listByPage',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.quality + '/evaluationSetting/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/evaluationSetting/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.quality + '/evaluationSetting/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.quality + '/evaluationSetting/update',
    method: 'post',
    data: obj
  });
}

export function listForCom(id) {
  return fetch({
    url: baseUrl.quality + '/evaluationSetting/listForCom',
    method: 'post',
    params:{"id": id}
  });
}
