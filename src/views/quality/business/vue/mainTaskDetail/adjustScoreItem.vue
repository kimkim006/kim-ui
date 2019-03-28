<template>
	<fieldset class="el-dialog-panel task-item">
  		<legend style="">分数调整</legend>
		<el-form :model="form" ref="form" label-width="80px" class="form-body-u">
			<div style="display: table;">
               	<el-form-item label="调整分值" class="task-item-form-item" style="float: left;width: 200px;">
		            <el-input readonly v-model="form.adScore"></el-input>
               	</el-form-item>
               	<el-form-item label="得分" class="task-item-form-item" style="float: left;width: 200px;">
		            <el-input readonly v-model="form.score"></el-input>
               	</el-form-item>
        	</div>
			<div style="display: table;">
               	<el-form-item label="调整说明" class="task-item-form-item">
                   	<el-input type="textarea" readonly v-model="form.content" 
                   		style="width: 560px;" :autosize="{minRows: 2, maxRows: 5}"></el-input>
               	</el-form-item>
        	</div>
        </el-form>
	</fieldset>
</template>

<style>

</style>

<script>
import {getObj} from '@/views/quality/business/api/adjustScore';
import $ from 'jquery';
import {mapGetters} from 'vuex';

export default {
  	name: 'adjustScoreItem',
  	components: {
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
	    dataId: {
        	type: String,
       		required: true
      	},
	    task:{
	    	type: Object,
      		required: true
	    },
	    itemStatus: {
	        type: String,
	        required: true
	    }
  	},
  	data() {
    	return {
    		actualStatus: '',
	      	listLoading: false,
	      	submitBtnLoading: false,
	      	form:{
	      		taskId: this.task.id,
	      		adScore: 0,
	      		score: 0,
	      		content:""
	      	}
    	}
  	},
  	created() {
      	this.getList();
  	},
  	computed: {
  		...mapGetters(['tenantId']),
  		taskObj(){
  			return this.task;
  		},
  		isEditMode(){
  			if(this.actualStatus){
      			return this.actualStatus === 'create';
      		}
      		return this.itemStatus ==='create';
       	}
  	},
  	methods: {
  		getList(){
  			if(this.dataId && this.dataId.trim()){
  				getObj(this.dataId).then(ret => {
  					if(ret.rel){
  						this.form = ret.data;
  					}else{
  						this.$message.error({message: '获取行动记录失败',showClose: true});
  					}
  				});
  			}
  		}
  	}
}
	
</script>
