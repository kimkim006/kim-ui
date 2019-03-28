/**
 * @author bo.liu01
 * @date 2018-8-16 18:34:17
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function tree() {
  return fetch({
    url: baseUrl.quality + '/sampleRule/listTree',
    method: 'get'
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.quality + '/sampleRule/checkUnique',
    method: 'get',
    params: {code:value}
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.quality + '/sampleRule/add',
    method: 'post',
    data: obj
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.quality + '/sampleRule/update',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/sampleRule/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.quality + '/sampleRule/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function getBusiness() {
  return fetch({
    url: baseUrl.quality + '/sampleRule/listBusinessCom',
    method: 'get'
  });
}