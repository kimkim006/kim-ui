/**
 * @author liubo
 * @date 2019-3-22 11:27:48
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

export function page(query) {
	return fetch({
		url: baseUrl.notify + '/notice/listByPage',
    	method: 'get',
    	params: query
	});
}

export function myPage(query) {
	return fetch({
		url: baseUrl.notify + '/notice/listMyPage',
    	method: 'get',
    	params: query
	});
}


export function getObj(id) {
	return fetch({
	    url: baseUrl.notify + '/notice/find',
	    method: 'get',
	    params:{"id":id}
	});
}

export function delObj(id) {
	return fetch({
	    url: baseUrl.notify + '/notice/delete',
	    method: 'post',
	    data:{"id": id}
	});
}

