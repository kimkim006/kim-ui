/**
 * @author liubo
 * @date 2018-12-12 14:44:32
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/adjustScore/listByPage',
    method: 'get',
    params: query
  });
}

export function addAdjustScore(obj) {
  return fetch({
    url: baseUrl.quality + '/adjustScore/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/adjustScore/find',
    method: 'get',
    params:{"id":id}
  });
}

export function getAdjustScoreOpt() {
  return fetch({
    url: baseUrl.quality + '/adjustScore/findOpt',
    method: 'get'
  });
}

