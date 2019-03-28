

/**
 * 只有  待评分状态(2), 审核驳回(5) 才允许提交质检评分
 * @param {Object} status 任务的状态
 */
export function allowEval(status){
	return status == 2 || status == 5;
}

/**
 * 只有  申诉待处理(7) 才允许提交申诉评分
 * @param {Object} status 任务的状态
 */
export function allowEvalWithAppeal(status){
	return status == 7;
}

/**
 * 只有  待审核状态(3),申诉待审批(6) 才允许审核
 * @param {Object} status 任务的状态
 */
export function allowApprl(status){
	return status == 3 || status == 6;
}

/**
 * 只有  结果反馈(4), 申诉通过(8), 申诉驳回(9) 才允许提交申诉
 * @param {Object} status 任务的状态
 */
export function allowAppeal(status){
	return status == 4 || status == 8 || status == 9;
}


/**
 * 只有  结果反馈(4), 申诉通过(8), 申诉驳回(9), 坐席已确认(10) 才允许提交强制改分
 * @param {Object} status 任务的状态
 */
export function allowAdjustSc(status){
	return status == 4 || status == 8 || status == 9 || status == 10;
}