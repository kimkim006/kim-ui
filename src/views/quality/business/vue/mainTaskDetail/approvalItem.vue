<template>
  	<fieldset class="el-dialog-panel task-item">
  		<legend v-if="form.type == 1">质检评分审核</legend>
  		<legend v-else-if="form.type == 3">申诉评分审核</legend>
  		<legend v-else>申诉业务审核</legend>
  		<div v-if="form.status == 0 && itemStatus =='view'">
  			<span style="font-size: 18px;font-weight: bold;">等待审核</span>
  		</div>
  		<div v-else>
  			<el-form :model="form" ref="form" :rules="rules" label-width="85px" class="form-body-u">
				<div style="display: table;">
					<el-form-item label="审核意见" prop="status" required class="task-item-form-item">
						<el-select v-model="form.status" @change="changeStatus" placeholder="选择状态" style="width: 110px;" :disabled="!isEditMode">
							<el-option v-for="item in approvalStatusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否记错" prop="mistake" class="task-item-form-item">
						<el-checkbox v-model="form.mistake" :disabled="!form.status || form.status != 2 || !isEditMode"></el-checkbox>
					</el-form-item>
				</div>
				<div style="display: table;">
					<el-form-item label="意见内容" prop="content" required style="width: 640px;" class="task-item-form-item">
						<el-input type="textarea" v-model="form.content" :readonly="!isEditMode" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入审核意见"></el-input>
					</el-form-item>
					<div style="float: left;margin-left: 20px;">
						<el-button v-if="isShowBtnAudit && isEditMode" @click="auditHandler()" :loading="submitBtnLoading" type="primary">提 交</el-button>
					</div>
				</div>
			</el-form>
  		</div>
  	</fieldset>
</template>
<script>
import {getObj, audit} from '@/views/quality/business/api/approval';
import {getMapFromArr} from '@/utils/arrayUtil';
import $ from 'jquery';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
import {hasPermission} from '@/utils/permissionUtil';
import {creatValid, checkRequire, check} from '@/components/public/validator';
export default {
    name: 'approvalItem',
	props: {
		dataId: {
			type: String,
			required: true
		},
		task: {
			type: Object,
			required: true
		},
		itemStatus: {
			type: String,
			required: true
		},
		close: {
			type: Function,
			default: () => {}
		},
		callback: {
			type: Function,
			default: () => {}
		}
	},
	data() {
		return {
			rules: {
				status: [{required: true,message: '请选择审核意见',trigger: 'blur'}],
				content: creatValid(checkRequire('意见内容', 2, 500))
			},
			metadata: {
				status: 1,
				content: "",
				id: this.dataId,
				mistake: false
			},
			actualStatus: '',
			form: $.extend(true, {}, this.metadata),
			submitBtnLoading: false,
			isShowBtnAudit: false,
			approvalStatusArr: [{value: 1,name: '通过'}, {value: 2,name: '驳回'}]
		}
	},
	created() {
		this.isShowBtnAudit = hasPermission('mainTaskApproval.audit');
		this.getData();
	},
	computed: {
		...mapGetters(['tenantId']),
		isEditMode(){
			if(this.actualStatus){
				return this.actualStatus ==='edit';
			}
      		return this.itemStatus ==='edit';
      	}
    },
    methods: {
	    getData(){
	        getObj(this.dataId).then(response => {
	          if(response.rel){
	            this.form = response.data;
	            if(this.isEditMode){
	            	this.form.status = 1;//默认设置通过
	            	this.form.content = "审核通过";
	            }else{
	            	this.form.mistake = this.form.mistake == 1;
	            }
	          }else{
	            this.$message.error({message: '获取审批记录失败',showClose: true});
	          }
	        });
	    },
      	auditHandler() {
	    	this.$refs['form'].validate(valid => {
	        	if (!valid) {
	        		return false;
	    		} else {
		          	this.$confirm('确定要提交?', '提示', {
				        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				    }).then(() => {
		        		this.submitBtnLoading = true;
				      	let data = {
				      		type: this.form.type,
				      		status: this.form.status,
							content: this.form.content,
							id: this.dataId,
							taskId: this.task.id,
							mistake: this.form.mistake?1:0
				      	};
				      	audit(data).then(response => {
				        	if (response && response.rel) {
				          		this.$message.success({message: '审批成功', showClose: true});
				          		this.getData();
				          		this.actualStatus = 'view';
				          		this.callback();
					        } else {
					          this.$message.error({message: response.msg ? response.msg : '审批失败', showClose: true});
					        }
				        	this.submitBtnLoading = false;
				      	});
				    }).catch(()=>{});
		        }
		    });
	    },
	    changeStatus(value){
		    if(this.form.status == 1) {
	          	this.form.mistake = '';
	          	this.form.content = "审核通过";
	        } else {
	          	this.form.content = "审核驳回";
	        }
	    }
    }
}
</script>
