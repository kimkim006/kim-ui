
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

/**
  * 查询合同列表
 */
export function contractList(data) {
  	return fetch({
	    url: baseUrl.softPhone + '/mmtIvr/contractList',
	    method: 'get',
	    params: data
	});
}