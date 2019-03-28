<template>
	<div>
		<div class="el-dialog-panel">
	        <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">
				<div style="display: table;">
	               	<el-form-item label="调整分值" prop="adScore" required>
			            <el-input-number v-model="form.adScore" :min="opt.minScore" :max="opt.maxScore"></el-input-number>
			            <span>可调整分值范围:</span>
			            <span style="color: blue;">({{opt.minScore}} ~ {{opt.maxScore}})不包括 0 </span>
	               	</el-form-item>
	        	</div>
				<div style="display: table;">
	               	<el-form-item label="调整说明" prop="content" required>
	                   	<el-input type="textarea" v-model="form.content" placeholder="请输入调整说明" 
	                   		style="width: 400px;" :autosize="{minRows: 2, maxRows: 5}"></el-input>
	               	</el-form-item>
	        	</div>
	        </el-form>
	    </div>
        <div slot="footer" class="dialog-footer dialog-footer-u">
			<el-button :loading="submitBtnLoading" @click="createAdjustScoreHandler()" type="primary">提 交</el-button>
	        <el-button  @click="closeAdjustScoreDialog()">取消</el-button>
	    </div>
	</div>
</template>

<script>
import {allowAdjustSc} from '@/views/quality/business/api/taskUtil';
import {addAdjustScore, getAdjustScoreOpt} from '@/views/quality/business/api/adjustScore';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {creatValid, checkRequire} from '@/components/public/validator';
import {mapGetters} from 'vuex';

export default {
	name: 'toAdjustScore',
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
	    task:{
	    	type: Object,
	    	required: true
	    }
	},
	data() {
		return {
			
			submitBtnLoading: false,
			isShowBtnAdjustScore: false,
			
			rules: {
				adScore: {required: true, message: '请填写调整分值', trigger: 'blur'},
				content: creatValid(checkRequire('调整说明', 2, 300))
			},
			form:{
				taskId: this.task.id,
				adScore: 0,
				content:""
			},
			opt:{
				minScore: -20,
				maxScore: 20,
				maxCount: 2
			}
		}
	},
	created() {
		this.initAdjustScoreOpt();
	  	this.isShowBtnAdjustScore = hasPermission('mainTask.adjustScore');
	},
	computed: {
		...mapGetters(['tenantId'])
	},
	methods: {
	    initAdjustScoreOpt(){
  			getAdjustScoreOpt().then(res =>{
  				if(res.rel){
  					this.opt = res.data;
  				}else{
  					this.$message.error({message: res && res.msg ? res.msg:'获取分数调整配置失败, 请联系管理员!',showClose: true});
  				}
  			});
	    },
		closeAdjustScoreDialog(){
			this.close();
		},
		createAdjustScoreHandler(){
  			//非结果反馈和申诉驳回，其他状态不可以提交
  			if(!allowAdjustSc(this.task.status)){
  				this.$message.warning({message: '当前状态不允许修改分数', showClose: true});
	      		return ;
  			}
  			this.$refs['form'].validate(valid => {
        		if (valid) {
					this.submitBtnLoading = true;
			        addAdjustScore(this.form).then(response => {
			            if(response && response.rel){
			                this.callback();
			                this.closeAdjustScoreDialog();
			                this.$message.success({message: '提交成功',showClose: true});
			            }else{
			                this.$message({message: response.msg ? response.msg : '提交失败',showClose: true,type: 'error'});
			            }
			            this.submitBtnLoading = false;
			        });
        		} else {
		          	return false;
		        }
		    });
  		}
	}
}

</script>

<style>
</style>