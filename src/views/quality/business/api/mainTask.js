/**
 * @author bo.liu01
 * @date 2018-8-28 18:24:20
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';
import {downloadFile} from '@/components/downloadUtil';

export function page(query) {
	return fetch({
	    url: baseUrl.quality + '/mainTask/listByPage',
	    method: 'get',
	    params: query
	});
}

export function download(query, callback) {
	downloadFile({
	    url: baseUrl.quality + '/mainTask/download',
	    method: 'get',
	    params: query
	}, callback);
}

export function downloadTask(query, callback) {
	downloadFile({
	    url: baseUrl.quality + '/mainTask/downloadTask',
	    method: 'get',
	    params: query
	}, callback);
}

export function listStatus(stage) {
	return fetch({
	    url: baseUrl.quality + '/mainTask/listStatus',
	    method: 'get',
	    params:{"stage": stage}
	});
}

export function digestInfo(taskId) {
	return fetch({
	    url: baseUrl.quality + '/mainTask/digestInfo',
	    method: 'get',
	    params:{"taskId":taskId}
	});
}

export function listSampleDetail(query) {
	return fetch({
	    url: baseUrl.quality + '/mainTask/listSampleDetail',
	    method: 'get',
	    params: query
	});
}
export function listSampleAgentStat(query) {
 	return fetch({
	    url: baseUrl.quality + '/mainTask/listSampleAgentStat',
	    method: 'get',
	    params: query
  	});
}

export function listResult(query) {
	return fetch({
	    url: baseUrl.quality + '/mainTask/listResult',
	    method: 'get',
	    params: query
	});
}

export function listApproval(query) {
	return fetch({
	    url: baseUrl.quality + '/mainTask/listApproval',
	    method: 'get',
	    params: query
	});
}

export function listEvaluation(query) {
	return fetch({
	    url: baseUrl.quality + '/mainTask/listEvaluation',
	    method: 'get',
	    params: query
	});
}

export function findTape(taskId) {
	return fetch({
	    url: baseUrl.quality + '/fileMapping/findTapeFile',
	    method: 'get',
	    params:{"mainTaskId":taskId}
	});
}

export function getAudioUrl(f, s) {
  	return baseUrl.quality + '/file/getAudio?f='+f+'&s='+s;
}