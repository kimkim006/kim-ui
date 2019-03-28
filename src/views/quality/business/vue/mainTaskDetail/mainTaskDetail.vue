<template>
	<div>
		<div class="el-dialog-panel task-detail" :loading="listLoading">
			<template  v-for="(item, i) in relateKeyItems">
				<div v-if="item.type == 'INFO'">
					<task-item :dataId="task.id" :task="task" :close="close" :callback="callback"></task-item>
				</div>
				<div v-if="item.type == 'EVAL'">
					<evaluation-item :dataId="item.id" :task="task" :itemStatus="'view'" :close="close" :callback="callback"></evaluation-item>
				</div>
				<!--
		        	作者：liubo
		        	时间：2018-09-29
		        	描述：判断是否是 3待审核状态,6申诉待审批
		        -->
				<div v-if="item.type == 'APPRL'">
					<approval-item v-if="allowApprlItem && i == (relateKeyItems.length-1)"
						:dataId="item.id" :task="task" :itemStatus="'edit'" :close="close" :callback="callback"/>
					<approval-item v-else :dataId="item.id" :task="task" :itemStatus="'view'" :close="close" :callback="callback" />
				</div>
				<div v-if="item.type == 'APPEAL'">
					<appeal-item :dataId="item.id" :task="task" :itemStatus="'view'" :close="close" :callback="callback"></appeal-item>
				</div>
				
				<div v-if="item.type == 'ADJUST_SCORE'">
					<adjust-score-item :dataId="item.id" :task="task" :itemStatus="'view'" :close="close" :callback="callback"></adjust-score-item>
				</div>
			</template >
			<!--
	        	作者：liubo
	        	时间：2018-09-29
	        	描述：判断是否允许提交质检评分
	        -->
			<evaluation-item v-if="allowEvalItem" :dataId="''"
				:task="task" :itemStatus="'create'" :close="close" :callback="callback"></evaluation-item>
			<!--
	        	作者：liubo
	        	时间：2018-09-29
	        	描述：判断是否允许提交申诉评分
	        -->
			<eval-with-appeal-item v-if="allowEvalWithAppealItem" :dataId="''"
				:task="task" :itemStatus="'create'" :close="close" :callback="callback"></eval-with-appeal-item>
				
			<!--
	        	作者：liubo
	        	时间：2018-09-29
	        	描述：判断是否允许提交申诉
	      	-->
			<appeal-item v-if="allowAppealItem" :dataId="''"
				:task="task" :itemStatus="'create'" :close="close" :callback="callback"></appeal-item>
				
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-u">
			<span v-if="task && task.score" style="margin-right: 20px;">
				<span>总得分：</span>
				<span style="color: blue;font-weight: bold;">{{task.score}}</span>
			</span>
			<el-button type="primary" v-if="allowAdjustScItem && hasAdjustScCount" @click="toAdjustScore()">调整分数</el-button>
			<el-button type="primary" v-else-if="!hasAdjustScCount" disabled >调整分数次数已用完</el-button>
			<el-button type="primary" v-else-if="isShowBtnAdjustScore" disabled >当前任务状态不允许调整分数</el-button>
	        <el-button type="primary" @click="close()">关  闭</el-button>
	    </div>
	    
	    <el-dialog title="调整分数" v-if="adjustScoreDialogVisible" :visible.sync="adjustScoreDialogVisible" class="dailog-body-u" 
	    	custom-class="el-dialog-u-adjustScore" :append-to-body="true" >
	    	<to-adjust-score :task="task" :close="closeAdjustScoreDialog" :callback="adjustCallback"></to-adjust-score>
	    </el-dialog>
    </div>
</template>

<style>
.el-dialog-u-adjustScore{
  width: 600px;
}
.task-detail{
	max-height: 500px;
	min-height: 315px;
	overflow-y: auto;
	padding-top:10px;
	padding-bottom: 10px;
}
.task-item{
	width: 924px;
	margin-left: 15px;
	margin-top: 5px;
}
.task-item-form-item{
  	float: left;
  	margin-bottom: 4px !important;
  }
</style>

<script>
import {digestInfo} from '@/views/quality/business/api/mainTask';
import {allowEval, allowEvalWithAppeal, allowApprl, allowAppeal, allowAdjustSc} from '@/views/quality/business/api/taskUtil';
import {getAdjustScoreOpt} from '@/views/quality/business/api/adjustScore';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {mapGetters} from 'vuex';

export default {
	name: 'mainTaskDetail',
	components: {
	    'task-item': () => import('./taskItem'),
	    'evaluation-item': () => import('./evaluationItem'),
	    'eval-with-appeal-item': () => import('./evalWithAppealItem'),
	    'appeal-item': () => import('./appealItem'),
	    'approval-item': () => import('./approvalItem'),
	    'adjust-score-item': () => import('./adjustScoreItem'),
	    'to-adjust-score': () => import('./toAdjustScore')
	},
	props: {
		close: {
	        type: Function,
	        default: () => {
	        }
	    },
	    callback:{
	        type: Function,
	        default: () => {
	        }
	    },
	    stage:{
	    	type: String,
	    	required: true
	    },
	    taskId:{
	    	type: String,
	    	required: true
	    }
	},
	data() {
		return {
			relateKeyItems: [],
			relateKeys:[],
			task:{},
			listLoading: true,
			adjustScoreDialogVisible: false,
			isShowBtnAdjustScore: false,
			opt:{
				minScore: -100,
				maxScore: 100,
				maxCount: 2
			}
		}
	},
	created() {
	  	this.getList();
	  	this.initAdjustScoreOpt();
	  	this.isShowBtnAdjustScore = hasPermission('mainTask.adjustScore');
	},
	computed: {
		...mapGetters(['tenantId']),
		mainTaskId:function(){
			return this.taskId;
		},
		allowEvalItem(){
	  		return this.task.status && allowEval(this.task.status) && this.stage == 'EVAL';
	  	},
		allowEvalWithAppealItem(){
	  		return this.task.status && allowEvalWithAppeal(this.task.status) && this.stage == 'EVAL';
	  	},
	  	allowApprlItem(){
	  		return this.task.status && allowApprl(this.task.status) && this.stage == 'APPROVAL';
	  	},
	  	allowAppealItem(){
	  		return this.task.status && allowAppeal(this.task.status) && this.stage == 'APPEAL';
	  	},
	  	allowAdjustScItem(){
	  		return this.task.status && allowAdjustSc(this.task.status) && this.isShowBtnAdjustScore;
	    },
	  	hasAdjustScCount(){
	  		return !this.task.adjustScoreCount || this.task.adjustScoreCount < this.opt.maxCount;
	    }
	},
	methods: {
	  	getList() {
		    this.listLoading = true;
		    digestInfo(this.mainTaskId).then(response => {
		    	this.task = response.data.task;
		    	this.relateKeys = response.data.relateKeys;
		    	this.relateKeyItems = [];
		    	this.relateKeys.forEach((item, i)=>{
		    		let ss = item.split('-');
		    		this.relateKeyItems.push({
		    			type:ss[0],
		    			id:ss[1]
		    		});
		    	});
		      this.listLoading = false;
		    })
		},
		initAdjustScoreOpt(){
  			getAdjustScoreOpt().then(res =>{
  				if(res.rel){
  					this.opt = res.data;
  				}else{
  					this.$message.error({message: res && res.msg ? res.msg:'获取分数调整配置失败, 请联系管理员!',showClose: true});
  				}
  			});
	    },
	    toAdjustScore(){
			this.adjustScoreDialogVisible = true;
		},
		closeAdjustScoreDialog(){
			this.adjustScoreDialogVisible = false;
		},
		adjustCallback(){
			this.getList();
		}		
	}
}

</script>


<!--<template>
  <component :is="comp"></component>
</template>
<script>
export default {
  data () {
    return {
      compName: this.name
    }
  },
  computed: {
    comp: function () {
      console.log(this.compName)
      return require(`./${this.compName}`)
    }
  },
  props: ['name']
}
</script>-->

