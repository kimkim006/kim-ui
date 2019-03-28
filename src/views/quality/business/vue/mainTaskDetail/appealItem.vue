<template>
	<fieldset class="el-dialog-panel task-item">
  		<legend style="">坐席申诉</legend>
		<el-form :model="form" :rules="rules" ref="form" label-width="80px" 
			:inline="true" class="form-body-u">
			<div style="display: table;">
               	<el-form-item label="申诉理由" prop="content" required class="task-item-form-item">
                   	<el-input v-if="isEditMode" type="textarea" v-model="form.content" placeholder="请输入申诉理由" 
                   		style="width: 560px;" :autosize="{minRows: 2, maxRows: 5}"></el-input>
                   	<el-input v-else type="textarea" readonly v-model="form.content" 
                   		style="width: 560px;" :autosize="{minRows: 2, maxRows: 5}"></el-input>
               	</el-form-item>
               	<el-button v-if="isEditMode && isShowBtnSubmit" :loading="submitBtnLoading" 
               		@click="createHandler()" type="primary">提 交</el-button>
               	<span v-else>{{msg}}</span>
        	</div>
        	<div style="display: table;margin-top: 15px;">
        		<el-form-item label="附件列表" style="margin-bottom: 0px !important;">
        			<el-upload v-if='isEditMode' ref="upload" :action="opt.action" :on-remove="handleRemove"
					  	list-type="picture-card" :on-preview="handlePictureCardPreview"
					  	:on-success="handleSuccess" :on-error="handleError" :limit="opt.limit" :accept='opt.accept'
					  	:on-exceed="exceedHandler" :multiple="false">
					  	<i class="el-icon-plus"></i>
					</el-upload>
					<div v-else>
						<div v-if='attaList && attaList.length'>
							<a v-for="atta in attaList" @click="handlePictureCardPreview(atta)" style="margin-right: 6px;">
								<img :src="convertUrl(atta)" class="img-list-a"/>
							</a>
						</div>
						<div v-else>无附件</div>
					</div>
        		</el-form-item>
            </div>
        </el-form>
        <el-dialog title='附件信息' :visible.sync="dialogPicVisible" top='3vh'
					 append-to-body custom-class="dialog-pic-show" :append-to-body="true" :modal-append-to-body="false">
				  	<div align="center">
					  	<img style="max-height: 500px;" :src="dialogImageUrl">
				  	</div>
				  	<div slot="footer" class="dialog-footer">
			            <el-button @click="closeDialogPic()">关 闭</el-button>
			        </div>
				</el-dialog>
	</fieldset>
</template>

<style>
.dialog-pic-show{
	max-height: 600px;
	width: fit-content;
	width: -webkit-fit-content;
	width: -moz-fit-content;
}
.img-list-a{
	background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    width: 148px;
    height: 148px;
}
</style>

<script>
import {getObj, addObj, getAttaUploadUrl, getUploadOpt} from '@/views/quality/business/api/appeal';
import {allowAppeal} from '@/views/quality/business/api/taskUtil';
import {getPortraitImg} from '@/views/admin/api/user';
import $ from 'jquery';
import {mapGetters} from 'vuex';
import {hasPermission} from '@/utils/permissionUtil';
import { addToken} from '@/utils/auth';
import {creatValid, checkRequire, check} from '@/components/public/validator';

export default {
  	name: 'appealItem',
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
	      	isShowBtnSubmit: false,
	      	rules: {
				content: creatValid(checkRequire('申诉理由', 2, 300))
			},
	      	form:{
	      		taskId: this.task.id,
	      		content:"",
	      		attachmentId: ''
	      	},
	      	attaList:[],
	      	msg: '',
	      	dialogImageUrl: '',
	      	dialogPicVisible: false,
	      	opt: {
				action: '',   		
	      		accept:'',
	      		limitSize: 0,
	      		limit: 3
	      	}
    	}
  	},
  	created() {
  		this.opt.action = getAttaUploadUrl();
  		if(this.opt.action){
      		this.opt.action = addToken(this.opt.action); 
      	}
  		if(this.isEditMode){
  			getUploadOpt().then(res =>{
  				if(res.rel){
  					this.opt = $.extend(true, this.opt, res.data);
  				}else{
  					this.$message.error({message: res && res.msg ? res.msg:'获取上传配置失败, 请联系管理员!',showClose: true});
  				}
  			});
  		}
  		this.isShowBtnSubmit = true;//hasPermission('appeal.submit');
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
  						this.attaList = ret.data.attaList;
  					}else{
  						this.$message.error({message: '获取申诉记录失败',showClose: true});
  					}
  				});
  			}
  		},
  		convertUrl(atta){
  			return atta.url = addToken(getPortraitImg(atta.f, atta.s));
  		},
  		createHandler(){
  			if(!this.isEditMode){
  				this.$message.warning({message: '当前模式下不允许提交申诉',showClose: true});
	      		return ;
  			}
  			//非结果反馈和申诉驳回、申诉成功，其他状态不可以提交
  			if(!allowAppeal(this.task.status)){
  				this.$message.warning({message: '当前状态不允许提交申诉记录', showClose: true});
	      		return ;
  			}
  			this.$refs['form'].validate(valid => {
        		if (valid) {
					this.submitBtnLoading = true;
					if(this.attaList && this.attaList.length){
						let arr = [];
						this.attaList.forEach(item => {
							arr.push(item.id);
						});
		    			this.form.attachmentId = arr.join();
		    		}
			        addObj(this.form).then(response => {
			            if(response && response.rel){
			                this.getList();
			                this.actualStatus = 'view';
			                this.$message.success({message: '提交成功',showClose: true});
			                this.callback();
			            }else{
			                this.$message({message: response.msg ? response.msg : '提交失败',showClose: true,type: 'error'});
			            }
			            this.submitBtnLoading = false;
			        });
        		} else {
		          	return false;
		        }
		    });
  		},
  		handleSuccess(response, file, fileList) {
	    	if(response && response.rel){
	    		var data = response.data;
	    		if(!data){
	    			this.$message.warning({message: '上传结果未知，接口未返回上传结果',showClose: true});
	    			return false;
	    		}
	    		if(!this.attaList){
	    			this.attaList =[];
	    		}
	    		this.attaList.push(data);
	    	}else{
	    		var msg = response && response.msg ? response.msg:'上传失败!';
	    		this.$message.error({message: msg,showClose: true});
	    		this.$refs.upload.abort(file);
	    	}
	    	return false;
	  	},
  		handleRemove(file, fileList) {
        	console.log(file, fileList);
        	
      	},
      	closeDialogPic(){
      		this.dialogPicVisible = false;
      	},
      	handlePictureCardPreview(file) {
       		this.dialogImageUrl = file.url;
        	this.dialogPicVisible = true;
      	},
      	handleError(err, file, fileList) {
  			var msg = err && err.error ? err.error:'上传附件时程序出错啦!';
    		this.$message.error({message: msg,showClose: true});
	  	},
	  	exceedHandler(files, fileList){
  			this.$message.warning({message: '附件个数不能超过'+this.opt.limit+'个',showClose: true});
  			return false;
	  	},
	  	beforeUpload(file){
	  		if(!file){
	  			this.$message.warning({message: '请选择附件',showClose: true});
	  			return false;
	  		}
	  		var fileType=file.name.substring(file.name.lastIndexOf('.'));
            if(this.opt.accept.indexOf(fileType) < 0) {
            	this.$message.warning({message: '只允许请选择'+this.opt.accept+'文件',showClose: true});
            	return false;
            }
            var flag = file.size / 1024 / 1024 < this.opt.limitSize;
            if(!flag) {  
                this.$message.warning({message: '导入文件大小不能超过 '+this.opt.limitSize+'MB!', showClose: true});
                return false;
            }  
            return true;
	  	}
  	}
}
	
</script>
