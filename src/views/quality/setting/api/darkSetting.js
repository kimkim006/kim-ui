/**
 * @author bo.liu01
 * @date 2018-11-21 17:34:22
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/darkSetting/listByPage',
    method: 'get',
    params: query
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.quality + '/darkSetting/checkUnique',
    method: 'get',
    params: {code:value}
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.quality + '/darkSetting/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/darkSetting/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.quality + '/darkSetting/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function activeObj(id, active) {
  return fetch({
    url: baseUrl.quality + '/darkSetting/active',
    method: 'post',
    data:{"id": id, active:active}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.quality + '/darkSetting/update',
    method: 'post',
    data: obj
  });
}
