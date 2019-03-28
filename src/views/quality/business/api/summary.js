/**
 * @author bo.liu01
 * @date 2018-11-14 16:19:30
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/summary/listByPage',
    method: 'get',
    params: query
  });
}

export function listSummary(parentCode, level) {
  return fetch({
    url: baseUrl.quality + '/summary/listCom',
    method: 'get',
    params:{
    	parentCode : parentCode,
    	level : level
    }
  });
}

export function listSource(value) {
  return fetch({
    url: baseUrl.quality + '/summary/listSource',
    method: 'get'
  });
}

export function checkUnique(value) {
  return fetch({
    url: baseUrl.quality + '/summary/checkUnique',
    method: 'get',
    params: {code:value}
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.quality + '/summary/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/summary/find',
    method: 'get',
    params:{"id":id}
  });
}

export function delObj(id) {
  return fetch({
    url: baseUrl.quality + '/summary/delete',
    method: 'post',
    data:{"id": id}
  });
}

export function updObj(obj) {
  return fetch({
    url: baseUrl.quality + '/summary/update',
    method: 'post',
    data: obj
  });
}
