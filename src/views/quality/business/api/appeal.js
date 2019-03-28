/**
 * @author bo.liu01
 * @date 2018-9-19 10:11:34
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/appeal/listByPage',
    method: 'get',
    params: query
  });
}

export function pageCur(query) {
  return fetch({
    url: baseUrl.quality + '/appeal/listCurByPage',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: baseUrl.quality + '/appeal/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/appeal/find',
    method: 'get',
    params:{"id":id}
  });
}

export function getAttaUploadUrl() {
  return baseUrl.zuul + '/zuul/quality/appeal/addAttachment';
}

export function getUploadOpt() {
  	return fetch({
	    url: baseUrl.quality + '/appeal/findOpt',
	    method: 'get'
	});
}


