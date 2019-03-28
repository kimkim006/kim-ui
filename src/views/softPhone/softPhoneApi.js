/**
 * @author bo.liu01
 * @date 2018-8-15 14:22:43
 */
import fetch from '@/utils/fetch';
import {baseUrl} from '@/base/baseURL.js';

function dealResult(promiseObject, oper){
	promiseObject.then(response =>{
		if(response && response.rel){
			console.info(oper+"操作成功!");
		}else{
			console.error(oper+"操作失败， msg:"+response.msg);
		}
	}).catch(()=>{
		console.error(oper+"操作异常， msg:"+response.msg);
	});
}

/**
  * 检查座席是否能进行小休
 */
export function agentRestCheckFor() {
  	return fetch({
	    url: baseUrl.softPhone + '/agentRest/checkFor',
	    method: 'post'
	});
}

/**
  * 排队座席查看是否轮到自己小休
 */
export function agentRestCheckTurn() {
  	return fetch({
	    url: baseUrl.softPhone + '/agentRest/checkTurn',
	    method: 'post'
	});
}

/**
  * 座席放弃小休
 */
export function agentRestGiveUp() {
  	dealResult(fetch({
	    url: baseUrl.softPhone + '/agentRest/giveUp',
	    method: 'post'
	}), "座席放弃小休");
}

/**
  * 座席结束小休
 */
export function agentRest_End() {
  	dealResult(fetch({
	    url: baseUrl.softPhone + '/agentRest/restEnd',
	    method: 'post',
	    data:{}
	}), "座席结束小休");
}

/**
  * 坐席开始小休
 */
export function agentRest_Start() {
  	return fetch({
	    url: baseUrl.softPhone + '/agentRest/restStart',
	    method: 'post',
	    data:{}
	});
}

/**
  * 申请小休
 */
export function agentRestApply() {
  	return fetch({
	    url: baseUrl.softPhone + '/agentRest/apply',
	    method: 'post'
	});
}

/**
  * 来电发送满意度短信
 */
export function sendMessage(service10) {
  	dealResult(fetch({
	    url: baseUrl.softPhone + '/service10/sendMessage',
	    method: 'post',
	    data: service10
	}), "来电发送满意度短信");
}

/**
  * 是否转IVR
 */
export function updateIsTransIvr(service10) {
  	dealResult(fetch({
	    url: baseUrl.softPhone + '/isTransIvr/update',
	    method: 'post',
	    data: service10
	}), "是否转IVR");
}

/**
  * 初始化服务记录
 */
export function initService(service10) {
  	return fetch({
	    url: baseUrl.softPhone + '/service10/initService',
	    method: 'post',
	    data: service10
	});
}

/**
  * 插入挂机不就绪记录
 */
export function insertAgentNotReady() {
  	dealResult(fetch({
	    url: baseUrl.softPhone + '/agentNotReady/add',
	    method: 'post'
	}), "插入挂机不就绪记录");
}

/**
  * 更新接通时间
 * @param {Object} service10
 */
export function updateConnect(service10) {
  	dealResult(fetch({
	    url: baseUrl.softPhone + '/service10/updateConnect',
	    method: 'post',
	    data: service10
	}), "更新接通时间");
}

/**
  * 更新挂断时间
 * @param {Object} service10
 */
export function disctConnect(service10) {
  	dealResult(fetch({
	    url: baseUrl.softPhone + '/service10/disConnect',
	    method: 'post',
	    data: service10
	}), "更新挂断时间");
}

/**
  * 更新录音
 * @param {Object} service10
 */
export function updateRecordId(service10) {
  	dealResult(fetch({
	    url: baseUrl.softPhone + '/service10/updateRecordId',
	    method: 'post',
	    data: service10
	}), "更新录音");
}

 /**
  * 插入随路数据
 * @param {Object} service10
 */
export function insertRoadData(roadDataEntity) {
  	dealResult(fetch({
	    url: baseUrl.softPhone + '/roadData/add',
	    method: 'post',
	    data: roadDataEntity
	}), "插入随路数据");
}

 /**
  * 初始化坐席数据
 * @param {Object} service10
 */
export function initAgentInfo(extension) {
  	return fetch({
	    url: baseUrl.softPhone + '/agentInfo/initAgentInfo',
	    method: 'get',
	    params:{"extension":extension}
	});
}

export function initAgentInfoTest(extension) {
  	return {	
		"agentMap":{
			"extension":null,
			"agentId":"24458",
			"ctiIpPortExt":"10.22.1.180",
			"outBoundCallPrefix":"*93",
			"recordType":"witness",
			"sendStatusAddress":"http://10.22.1.180:8080/platform/service/softPhoneStatus",
			"platformType":"cisco",
			"enableLog":"false",
			"enableSendStatus":"false",
			"platformId":"Platform801b32bdc8eb4c4aafc20598e7d940c3",
			"recordPlatformId":"recordPlatformebafe35ebfde437c98b624184ccf26dd",
			"ctiIpPort":"10.22.1.180"
		}	
	};
}
