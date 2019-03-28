<template>
  <fieldset class="el-dialog-panel task-item" :loading="itemLoading">
  		<legend>质检评分</legend>
	    <el-table v-if="isEditMode || (list && list.length)" :key='tableKey' :data="list" border fit highlight-current-row>
		      
		      <el-table-column type="index" label="序号" width="65" align="center"></el-table-column>
		      <el-table-column label="评分项" width="300px" align="left">
		        	<template slot-scope="scope">
		        		<span style="text-align: left;">{{scope.row.evalItemName}}</span>
		        	</template>
		      </el-table-column>
		      
		      <el-table-column label="分值" width="100px" align="center">
		        	<template slot-scope="scope"><span>{{scope.row.scoreStr}}</span></template>
		      </el-table-column>
		      
		      <el-table-column label="备注" align="center" :show-overflow-tooltip='!isEditMode'>
			        <template slot-scope="scope">
			          <el-input v-if="isEditMode" type="textarea" resize="none" v-model="scope.row.remark" placeholder="请输入内容" style="margin-left: -17px;width: 350px;float: left;" ><span>{{scope.row.remark}}</span></el-input>
			          <template v-else slot-scope="scope"><span>{{scope.row.remark}}</span></template>
			        </template>
		      </el-table-column>
		      
		      <el-table-column align="center" label="操作" width="87px" fixed="right">
			        <template slot-scope="scope">
			          <el-button size="small" v-if="isEditMode" type="danger" @click.native.prevent="deleteRow(scope.$index, list,scope.row)">移除</el-button>
			        </template>
		      </el-table-column>
	    </el-table>
	    <div>
		      <el-form ref="form" class="form-body-u">
			        <div style="display: table">
			        		<template v-if="!isEditMode">
						          <el-form-item label-width="80px" label="录音总分：" class="task-item-form-item">
						              <span>{{data.origScore}}</span>
						          </el-form-item>
						          <el-form-item label-width="80px" label="得分：" class="task-item-form-item">
						              <span>{{data.score}}</span>
						          </el-form-item>
			        		</template>
			        		<template v-else>
						          <el-form-item label-width="80px" label="录音总分：" class="task-item-form-item">
						              <span style="color: #13ce55;font-weight: bold;">{{origScore}}</span>
						          </el-form-item>
						          <el-form-item label-width="80px" label="得分：" class="task-item-form-item">
						              <span style="color: #1d90e6;font-weight: bold;">{{score}}</span>
						          </el-form-item>
			        		</template>
				          
				          <el-form-item label-width="150px" label="录音文件损坏：" class="task-item-form-item">
					            <template slot-scope="scope">
					              	<el-checkbox v-model="damageChecked" :disabled="!isEditMode"></el-checkbox>
					            </template>
				          </el-form-item>
				          <el-form-item v-if="isEditMode"  class="task-item-form-item" style="margin-left: 30px;">
					            <el-button v-if="isEditMode && isShowBtnAdd" :loading='submitBtnLoading' 
		      	 							@click="toEvaluationTree" type="primary">添加评分</el-button>
					            <el-button v-if="isEditMode && isShowBtnAdd" :loading='submitBtnLoading' 
					            		@click="createHandler()" type="primary">提 交</el-button>
				          </el-form-item>
			        </div>
		      </el-form>
	    </div>
	    <!--添加用户评分项-->
	    <el-dialog title="选择评分选项" v-if="dialogVisible" :visible.sync="dialogVisible" top="9vh"
	        custom-class="el-dialog-u-add-evaluation" :append-to-body="true" >
	      <select-evaluation ref="evaluationTree" :checkedKeys="checkedKeys" :close="closeDialog" 
	      		:callback="selectEvaluationCallback"></select-evaluation>
	    </el-dialog>
  </fieldset>

</template>

<style>
  .el-dialog-u-add-evaluation {
    width: 400px;
  }
</style>

<script>
  import {getObj, addObj, getOrigScore} from '@/views/quality/business/api/evaluation';
  import {allowEval} from '@/views/quality/business/api/taskUtil';
  import $ from 'jquery';
  import {hasPermission} from '@/utils/permissionUtil';
  import {mapGetters} from 'vuex';
  import {getMapFromArr} from '@/utils/arrayUtil';

  export default {
    name: 'evaluationItem',
    components: {
      'select-evaluation': () => import('./selectEvaluation'),
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
      task: {
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
        data: {},
        list: [],
        itemLoading: false,
        dialogVisible: false,
        submitBtnLoading: false,
        isShowBtnAdd: false,
        tableKey: 0,
        typeArr: [{value: 1, name: '加分'}, {value: 2, name: '减分'}],
        checkedKeys: [],
        damageChecked: false,
        origScore: 100,
        score: this.origScore,
        actualStatus: ''
      }
    },
    watch:{
    		list:'calc'
    },
    created() {
        this.isShowBtnAdd = hasPermission('mainTaskEvaluation.update');
	      if(this.isEditMode){
		      	this.getOrigScore();
	      }else{
		      	this.getList();
	      }
    },
    computed: {
	      ...mapGetters(['tenantId']),
	      typeMapping() {
	        	return getMapFromArr(this.typeArr);
	      },
	      isEditMode(){
		      	if(this.actualStatus){
		      		return this.actualStatus === 'create';
		      	}
		      	return this.itemStatus ==='create';
	      }
    },
    methods: {
      //打开评分项tree,checkedKeys赋值选中
      toEvaluationTree() {
        if (this.$refs.evaluationTree) {
          	this.$refs.evaluationTree.getList();
        }
        this.openDialog();
      },
      openDialog(){
      		this.dialogVisible = true;
      },
      closeDialog(){
      		this.dialogVisible = false;
      },
      //获取列表数据
      getList() {
        if (!this.isEditMode) {
	          this.itemLoading = true;
	          getObj(this.dataId).then(response => {
		          	this.data = response.data;
		            this.list = this.data.evaluationDetailList;
	              this.damageChecked = this.data.damaged == 1;
		            this.itemLoading = false;
	          });
        }
      },
      //获取初始录音总分
      getOrigScore() {
          getOrigScore().then(response => {
            	this.origScore = response.data;
            	this.score = this.origScore;
          });
      },
      calc(){
      		let grade = Number.parseInt(this.origScore);
      		this.checkedKeys = [];
      		if(this.list && this.list.length){
	        		this.list.forEach((item)=>{
	        				this.checkedKeys.push(item.id);
		        			if(item.evalType == 1){
		        					grade += item.score;
		        			}else{
		        					grade -= item.score;
		        			}
	        		});
	        }
	        this.score = grade;
      },
      //callback回调显示数据列表
      selectEvaluationCallback(data) {
	      	if(data && data.length){
		      		data.forEach(item=>{
		      				if(this.checkedKeys.indexOf(item.id) < 0){
		      						this.list.push(item);
		      				}
		      		});
	      	}
      },
      //移除评分项
      deleteRow(index, rows, row) {
        	rows.splice(index, 1);
      },
      //提交保存数据1、是否损坏；2、是否有list列表；
      createHandler() {
      		if(!this.isEditMode){
							this.$message.warning({message: '当前模式下不允许提交评分',showClose: true});
		      		return ;
					}
					//非结果反馈和申诉驳回，其他状态不可以提交
					if(!allowEval(this.task.status)){
							this.$message.warning({message: '当前状态不允许提交评分', showClose: true});
			      	return ;
					}
	        let msg = "确认提交评分？";
	        if (this.damageChecked) {
		          msg = "文件已损坏，评分明细将清空，" + msg;
	        }else {
	          	if (this.list && this.list.length) {
		          		let flag = false;
		          		let tmpList = this.list;
		          		for(let i=0;i<tmpList.length;i++){
		          				if(!tmpList[i].remark){
		          						this.$message.error({message: '请填写评分项备注', showClose: true});
		          						return ;
		          				}
		          				if(tmpList[i].remark.length > 500){
		          						this.$message.error({message: '评分项备注最多500字符', showClose: true});
		          						return ;
		          				}
		          		}
		          }
	        }
	        this.$confirm(msg, '提示', {
	          	confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
	        }).then(() => {
		        	if (this.damageChecked) {
		        			this.list = [];
		        	}
		          let data = {
			            evaluationSettings: JSON.stringify(this.list ? this.list:[]),
			            taskId: this.task.id,
			            tapeId: this.task.tape.tapeId,
			            damaged: this.damageChecked?1:0
		          };
		          this.submitBtnLoading = true;
		          addObj(data).then(response => {
			            if (response && response.rel) {
				              this.$message.success({message: '评分成功', showClose: true});
				              this.actualStatus = 'view';
				              this.data = response.data;
				              this.callback();
			            } else {
			              	this.$message.error({message: response.msg ? response.msg : '评分失败', showClose: true});
			            }
			            this.submitBtnLoading = false;
		          });
	        }).catch(()=>{});
      }
    }
  }
</script>
