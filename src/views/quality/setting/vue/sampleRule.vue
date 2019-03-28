<template>
<div class="app-container calendar-list-container">
    
    <div class="el-box">
	    <div class="el-dialog-panel" style="width: 40%;">
	      <div style="margin: 3px; ">
	        <div class="filter-container">
	          <el-button :loading='listLoading' type="primary" icon="search" style="width: 15%" @click="getList">刷新</el-button>
	          <el-input placeholder="输入关键字" style="width: 83%" v-model="filterText" ></el-input>
	        </div>
	      </div>
	      <div style="margin-top: 1px; margin-left: 3px; margin-right: 2px;">
	        <el-tree :data="treeData" node-key="id" highlight-current v-loading.body="listLoading"
	                 :props="defaultProps" ref="tree"
	                 :default-expand-all="true"
	                 :filter-node-method="filterNode" class="filter-tree"
	                 :expand-on-click-node="true"
	                 @node-click="currentChangeHandler"
	                 style="height: 635px;overflow:auto;">
	        	<span class="custom-tree-node" slot-scope="{ node, data }">
	        		<span v-if="data.type == 4">
	        			<i v-if="data.active" class="icm icon-iconcreditrule node-i_page" ></i>
	        			<i v-else class="icm icon-iconcreditrule node-i_page_unactive"></i>
	        		</span>
	        		<span v-else><i class="icm icon-folder_icon node-i_dir"></i></span>
	        		<span class="node-i_text">{{node.label}}</span>
	        		<span class="el-tree-node-button-u">
	        			<el-button v-if="data.type == 4 && isShowBtnDel" size="mini" type="danger"
	        				@click="deleteHandler(data)">删除</el-button>
	        		</span>
	        	</span>
	        </el-tree>
	      </div>
	    </div>

	    <div style="margin-left: 8px;width: 60%;">
	      	<el-card class="box-card" >
		        <div slot="header" class="clearfix">
		          <span  class="el-card-header-text">{{editTitle}}</span>
		          <div style="float: right;">
		          	<el-button type="primary" v-if="isShowBtnAdd" :disabled="editStatus != 'view'" @click="toCreate">新增</el-button>
		          	<el-button type="primary" v-if="isShowBtnEdit" :disabled="editStatus != 'view'" @click="toUpdate">修改</el-button>
		          </div>
		        </div>
		        <div v-if="editContentVisible">
		        	<div class="el-dialog-panel" v-loading.body="detailLoading">
			            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form-body-u">
			
							<div style="display: table;width: 100%;">
								<el-form-item label="抽检类型" required prop="sampleType" style="float: left; width: 50%;">
				                   	<el-radio-group v-model="form.sampleType" :disabled="editStatus != 'create'" @change="radioGgroupChange">
					              		<el-radio  v-for="item in sampleTypeArr" :key="item.value" :label="item.value" >{{item.name}}</el-radio>
					              	</el-radio-group>
				               	</el-form-item>
				               	<el-form-item label="质检模式" required prop="modeCode" style="float: left;width: 50%;">
				                   	<el-select v-model="form.modeCode" placeholder="选择质检模式" :disabled="editStatus != 'create'">
					                  <el-option v-for="item in modeCodes" :key="item.value" :label="item.name" :value="item.value"></el-option>
					                </el-select>
				               </el-form-item>
			               	</div>
			            	<div style="display: table;width: 100%;">
				               
				               <el-form-item label="规则名称" required prop="name" style="float: left;width: 50%;">
				                   <el-input v-model="form.name" placeholder="请输入规则名称" :readonly="isReadOnly"></el-input>
				               	</el-form-item>
				               <el-form-item label="业务热线" required prop="businessCode" style="float: left;width: 50%;">
				                    <el-select v-model="form.businessCode" placeholder="选择业务线" :disabled="editStatus != 'create'">
					                  <el-option v-for="item in businessCodes" :key="item.code" :label="item.name" :value="item.code"></el-option>
					                </el-select>
				               </el-form-item>
			            	</div>
			            	<div style="display: table;width: 100%;">
				               <el-form-item label="是否启用" required prop="active" style="float: left; width: 50%;">
				                   	<el-radio-group v-model="form.active" :disabled="isReadOnly">
					              		<el-radio v-for="item in activeArr" :key="item.value" :label="item.value">{{item.name}}</el-radio>
					              	</el-radio-group>
				               	</el-form-item>
				                <el-form-item v-if="form.sampleType=='system'" label="人均数量" required prop="personAvg" style="float: left;width: 50%;">
				                    <el-input-number :disabled="isReadOnly" v-model="form.personAvg" :min="1" :max="1000" style="margin-top: 3px;"></el-input-number>
				                </el-form-item>
				               
			            	</div>
			                <div style="display: table;width: 100%">
				                <el-form-item label="备注" prop="remark" style="float: left;width: 94%;">
				                    <el-input type="textarea" :readonly="isReadOnly" v-model="form.remark" :autosize="{minRows: 1, maxRows: 5}" placeholder="请输入内容"></el-input>
				                </el-form-item>
			                </div>
			            	<hr align='center' width='96%' color='#48576a' size='1'/>
				            <div>
				            	<div>
				            		<el-tag  style="margin-left: 12px;margin-bottom: 12px;">规则明细</el-tag>
				            		<el-button v-if="editStatus != 'view'" type="primary" @click="addRuleDetail">添加</el-button>
				            	</div>
				            	<div style="margin-left: 10px;">
				            			
			            			<div v-for="(detail, index) in form.ruleDetail">
			            				<div style="width: 100%;display: table;" :key="index" >
			            					<el-form-item required :label="'规则条件 ' + (index + 1)" :prop="'ruleDetail.' + index + '.name'"
											    :rules="{required: true, message: '请选择规则条件', trigger: 'blur'}"
											  	style="float: left;width: 55%;">
												<el-input readonly v-model="detail.digestName"></el-input>
											</el-form-item>
											<el-button type="primary" @click="toSelectRuleDetail(index)" style="float: left;margin-top: 4px;">选择</el-button>
											<el-form-item label="比例: " required :prop="'ruleDetail.' + index + '.percent'" label-width="55px" 
												:rules="{required: true, message: '请填写抽检比例', trigger: 'blur'}" style="float: left;width: 160px;">
												<el-input-number :disabled="isReadOnly" v-model="detail.percent" :min="1" :max="100" style="width: 105px;margin-top: 3px;"></el-input-number>
											</el-form-item>
											<el-button v-if="editStatus != 'view'" type="danger" @click="removeRuleDetail(index)" style="float: left;margin-top: 4px;margin-left: 4px;">X</el-button>
			            				</div>
			            			</div>
				            	</div>
				            </div>
			            </el-form>
			        </div>
			        <div slot="footer" class="dialog-footer dialog-footer-u">
			            <el-button v-if="editStatus=='view'" @click="closeEditContent()">关 闭</el-button>
			            <el-button v-else @click="closeEditContent()">取 消</el-button>
			            <el-button :loading='submitBtnLoading' v-if="editStatus=='create'" @click="createHandler()" type="primary">确 定</el-button>
			            <el-button :loading='submitBtnLoading' v-else-if="editStatus=='update'" @click="updateHandler()" type="primary">确 定</el-button>
			        </div>
			        
				        <el-dialog :title="'选择规则条件'" v-if="dialogVisible" :visible.sync="dialogVisible" class="dailog-body-u" 
						    	custom-class="el-dialog-u-select-rule-detail" :append-to-body="true" :modal-append-to-body="false">
									<select-rule-detail :index="curRuleDetalIndex" :ruleDetail="curRuleDetal" ref="selectRuleDetail" 
										:sampleType="form.sampleType" :editStatus="editStatus" :ruleDetailList="form.ruleDetail"
										:close="closeDialog" :callback="selectRuleDetailCallback"></select-rule-detail>
						    </el-dialog>
		        </div>
	      	</el-card>
	    </div>
  </div>
</div>
</template>

<style>
.el-dialog-u-select-rule-detail{
  width: 400px;
}

</style>

<script>
import {tree, addObj, getObj, delObj, updObj, checkUnique, getBusiness} from '@/views/quality/setting/api/sampleRule';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
import {createButton} from '@/utils/treeUtil';
export default {
  name: 'sampleRule',
  components: {
    'select-rule-detail': () => import('./selectRuleDetail')
  },
  data() {
    return {
		filterText: '',
		treeData: null,
		defaultProps: {
		   	children: 'children',
			label: 'name'
		},
		curNodeData:{id:undefined, name:''},
		listLoading: true,
		detailLoading: false,
		editContentVisible:false,
		isShowBtnEdit: false,
		isShowBtnDel: false,
		isShowBtnAdd: false,
		editTitle: '选择一个规则查看详情',
		editStatus:'view',
		curRowData:{},
		
		metadata:{
		    sampleType: 'manual',
			modeCode: 'tape',
			businessCode: '',
			name: '',
			personAvg: 1,
		    active: 1,
		    remark: undefined,
		    ruleDetail:[]
		},
		form: $.extend(true, {}, this.metadata),
		rules: {
		    sampleType: {required: true, message: '请选择抽检类型', trigger: 'blur'},
			modeCode: {required: true, message: '请选择质检模式', trigger: 'blur'},
			businessCode: {required: true, message: '请选择业务线', trigger: 'blur'},
			name: creatValid(checkRequire('名称', 2, 100)),
			personAvg: {required: true, message: '请填写人均抽取数量', trigger: 'blur'},
			active: {required: true, message: '请选择启用类型', trigger: 'blur'},
			remark: creatValid(check('备注', 2, 200))
		},
		ruleDetailMetadata:{
		  	name:'',
			digestName:'',
			ruleId:'',
			seqNumber:'',
			resolver:'',
			resolverParam:'',
			percent:10
		},
		dialogVisible: false,
		submitBtnLoading:false,
		sampleTypeArr:[{value:'system', name:'系统抽检规则'},{value:'manual', name:'人工抽检规则'}],
		modeCodes:[
		    {value:'tape', name:'录音质检'},
			{value:'text', name:'文本质检'},
			{value:'mixed', name:'混合质检'}
		],
		businessCodes:[],
		activeArr:[{value:1, name:'可用'},{value:0, name:'不可用'}],
		curRuleDetalIndex: -1,
		curRuleDetal:{},
		userTypeMapping:{
			NEW:'新员工',
	      	OLD:'老员工'
	    },
	    resolverMapping:{
	   		tapeTimeLong:'录音时长',
	   		userType:'员工类型'
	   	}
    }
  },
  watch: {
    filterText(val) {
      this.$refs['tree'].filter(val);
    },
    curRowData(data){
    	for(var i=0;i< data.ruleDetail.length;i++){
    		if(data.ruleDetail[i].resolverParam){
    			let param = JSON.parse(data.ruleDetail[i].resolverParam);
    			data.ruleDetail[i] = $.extend(data.ruleDetail[i], param);
    			if(!data.ruleDetail[i].digestName){
    				switch(data.ruleDetail[i].resolver){
			    		case 'tapeTimeLong': {
							data.ruleDetail[i].digestName = "录音时长 (" 
								+ (param.end? param.start + " - "+param.end : param.start + " - ∞") + ")s";
							break;
						}
						case'userType': {
							data.ruleDetail[i].digestName = "员工类型 (" + this.userTypeMapping[param.userType] + ")";
							break;
						}
			    		default :break;
			    	}
    			}
    		}else{
    			data.ruleDetail[i].digestName = data.ruleDetail[i].name;
    		}
    	}
    	this.form = data;
  	}
  },
  created() {
  	this.init();
    this.getList();
    this.isShowBtnAdd = hasPermission('sampleRule.insert');
    this.isShowBtnEdit = hasPermission('sampleRule.update');
    this.isShowBtnDel = hasPermission('sampleRule.delete');
  },
  computed: {
  	...mapGetters(['tenantId']),
  	isReadOnly(){
  		return this.editStatus == 'view';
  	}
  },
  methods: {
  	init(){
    	getBusiness().then(response => {this.businessCodes = response.data;});
    },
    getList() {
      this.listLoading = true;
      tree().then(response => {
        this.treeData = response.data;
        this.listLoading = false;
      });
    },
    radioGgroupChange(val){
    	if(val == 'system'){
    		for(var i=0;i<6;i++){
    			this.addRuleDetail();
    		}
    	}else{
    		this.form.ruleDetail=[];
    	}
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    currentChangeHandler(data, node) {
      if(this.curNodeData.code == data.code || data.type != 4
      		||this.editStatus == 'update' || this.editStatus =='create'){
        return;
      }
      this.curNodeData = data;
      this.openContent('view', data.id);
    },
    showEditContent(data){
    	if(data && data.name){
    		if(this.editStatus == 'update'){
    			this.editTitle = "修改规则【"+data.name+'】';
    		}else{
    			this.editTitle = '【'+data.name+"】规则详情";
    		}
    	}else{
    		this.editTitle = "添加新规则";
    	}
    	this.curRowData = data;
      	this.editContentVisible = true;
    },
    hideEditContent(){
    	this.editTitle = '选择一个规则查看详情';
      	this.editContentVisible = false;
      	this.editStatus = 'view';
      	this.$refs['tree'].setCurrentKey(null);
      	this.curNodeData={id:undefined, name:''};
    	this.curRowData = $.extend(true, {}, this.metadata);
    },
    openContent(editStatus, id){
    	this.editStatus = editStatus;
		if(this.editStatus == 'update' || this.editStatus == 'view'){
			this.detailLoading = true;
			getObj(id).then(response => {
	            if(response.data){
	            	this.showEditContent(response.data);
	            }else{
	              	this.getList();
	              	this.$message.warning({message: '该记录已不存在',showClose: true});
	            }
	            this.detailLoading = false;
	        });
        }else{
    		this.showEditContent($.extend(true, {}, this.metadata));
        }
    },
    closeEditContent(isDone){
    	if(this.editStatus == 'create' && isDone){
    		this.editStatus = 'view';
    		this.$refs['form'].clearValidate();
    	}else if(this.editStatus == 'update'){
    		this.editStatus = 'view';
    		this.$refs['form'].clearValidate();
    		this.openContent('view',this.curRowData.id);
    	}else{
    		this.hideEditContent();
    	}
    },
    toCreate() {
    	this.openContent('create');
    },
    toUpdate() {
    	if(!this.curNodeData || !this.curNodeData.id){
    		this.$message.error({message: '请先在左侧选择一个抽检规则',showClose: true});
	        return false; 
    	}
    	this.openContent('update', this.curNodeData.id);
    },
    checkSystemForm(){
    	if(this.form.sampleType != 'system'){
    		return true;
    	}
    	var total = 0;
    	this.form.ruleDetail.forEach((item, i)=>{
    		total += item.percent;
    	});
    	return total == 100;
    },
    toValid(callBack){
    	this.$refs['form'].validate(valid => {
	        if (valid) {
	        	if(this.form.ruleDetail.length < 1){
	        		this.$message.error({message: '请添加规则明细',showClose: true});
	        		return false; 
	        	}
	        	callBack(valid);
	        } else {
	          return false;
	        }
	    });
    },
    createHandler() {
      	this.toValid(valid => {
      		if(!this.checkSystemForm()){
      			this.$message.error({message: '抽检比例之和必须为100%',showClose: true});
      			return ;
      		}
			this.submitBtnLoading = true;
	        addObj(this.form).then(response => {
	            if(response && response.rel){
	            	this.closeEditContent(true);
	                this.getList();
	                this.$message.success({message: '新增成功',showClose: true});
	            }else{
	                this.$message({message: response.msg ? response.msg : '新增失败',showClose: true,type: 'error'});
	            }
	            this.submitBtnLoading = false;
	        });
      	});
    },
    updateHandler() {
      	this.toValid(valid => {
      		if(!this.checkSystemForm()){
      			this.$message.error({message: '抽检比例之和必须为100%',showClose: true});
      			return ;
      		}
	        this.submitBtnLoading = true;
	        updObj(this.form).then((response) => {
	            if(response && response.rel){
	            	this.closeEditContent();
	              	this.getList();
	              	this.$message({message: '修改成功',showClose: true,type: 'success'});
	            }else{
	              	this.$message({message: response.msg ? response.msg : '修改失败',showClose: true,type: 'error'});
	            }
	            this.submitBtnLoading = false;
	        });
      	});
    },
    deleteHandler(row) {
      this.$confirm('确认要删除该记录?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
          delObj(row.id).then((response) => {
              if(response && response.rel){
                this.$message({message: '删除成功',showClose: true,type: 'success'});
                this.getList();
                this.closeEditContent();
              }else{
                this.$message({message: response.msg ? response.msg : '删除失败',showClose: true,type: 'error'});
              }
            });
        }).catch(()=>{});
    },
    openDialog(){
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    toSelectRuleDetail(index){
    	this.curRuleDetalIndex = index;
    	this.curRuleDetal = this.form.ruleDetail[index];
    	this.openDialog();
    },
    selectRuleDetailCallback(index, ruleDetail){
    	this.form.ruleDetail[index] = ruleDetail;
    },
    addRuleDetail(){
    	var d = $.extend(true, {}, this.ruleDetailMetadata);
    	d.seqNumber = this.form.ruleDetail.length+1;
    	//d.name = '条件'+d.seqNumber;
		d.resolver = "tapeTimeLong";
    	this.form.ruleDetail.push(d);
    },
    removeRuleDetail(index){
        if (index !== -1) {
          this.form.ruleDetail.splice(index, 1);
        }
    }
  }
}
</script>