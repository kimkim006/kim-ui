/**
 * @author jianming.chen
 * @date 2018-9-18 18:56:25
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
  return fetch({
    url: baseUrl.quality + '/approval/listByPage',
    method: 'get',
    params: query
  });
}
export function getApprovalIds(taskId) {
  return fetch({
    url: baseUrl.quality + '/approval/getApprovalIds',
    method: 'get',
    params:{"taskId": taskId}
  });
}

export function getObj(id) {
  return fetch({
    url: baseUrl.quality + '/approval/find',
    method: 'get',
    params:{"id":id}
  });
}


export function audit(obj) {
  return fetch({
    url: baseUrl.quality + '/approval/audit',
    method: 'post',
    data: obj
  });
}

export function addAudit(obj) {
  return fetch({
    url: baseUrl.quality + '/approval/addAudit',
    method: 'post',
    data: obj
  });
}

export function auditBatch(obj) {
  return fetch({
    url: baseUrl.quality + '/approval/auditBatch',
    method: 'post',
    data: obj
  });
}

