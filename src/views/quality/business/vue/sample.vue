<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

			<el-form-item class="el-form-item-u" label="日期">
                <el-date-picker type="date"  v-model="listQuery.extractDateStart" placeholder="开始日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
                -
                <el-date-picker  type="date"  v-model="listQuery.extractDateEnd" placeholder="结束日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="业务线">
                <el-select v-model="listQuery.businessCode" placeholder="选择业务线" :clearable='true' style="width: 100px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in businessCodes" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="状态">
                <el-select v-model="listQuery.status" clearable placeholder="选择状态" style="width: 100px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="规则">
        		<el-input v-model="listQuery.ruleName" placeholder="选择规则" readonly :clearable='true' 
        			@clear="clearRule" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
        		<el-button @click="toSelectQueryRule()" class="filter-item" 
        			style="float: right;margin-top: 4px;margin-left: 0px;font-weight: bold;">···</el-button>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
                <el-button class="filter-item"  v-if="isShowBtnAgentStat" @click="sampleAgentStatVisible = true;" type="primary" >抽检汇总</el-button>
                <el-button class="filter-item"  v-if="isShowBtnExe" @click="toExecute" type="primary" >任务抽取</el-button>
                <el-button class="filter-item"  v-if="isShowBtnAllocate" @click="toAllocate" type="success">分配</el-button>
                <el-button class="filter-item"  v-if="isShowBtnRecycle" @click="toRecycle" type="danger">回收</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
    	@selection-change="handleSelectionChange" ref="resTable"  @row-click="clickRow">

		<el-table-column type="selection" width="47"></el-table-column>
	    <el-table-column label="批次号" width="180px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.batchNo}}</span></template>
        </el-table-column>

	    <el-table-column label="业务线" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.businessCode}}</span></template>
        </el-table-column>

	    <el-table-column label="抽检规则" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.ruleName}}</span></template>
        </el-table-column>

	    <el-table-column label="数据日期" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.extractDate}}</span></template>
        </el-table-column>
        
        <el-table-column label="状态" width="100px" align="center" >
            <template slot-scope="scope"><span>{{statusMapping[scope.row.status]}}</span></template>
        </el-table-column>

	    <el-table-column label="抽取数量" width="100px" align="center" >
            <template slot-scope="scope">
            	<a v-if="scope.row.extractNum && scope.row.extractNum>0" 
            		@click="toOpenSampleDetailDialog(scope.row, 'ALL')" class="href-class">
            		<span>{{scope.row.extractNum}}</span>
            	</a>
            	<span v-else>{{scope.row.extractNum}}</span>
            </template>
        </el-table-column>
        
        <el-table-column label="可分配量" width="100px" align="center" >
            <template slot-scope="scope">
            	<a v-if="scope.row.assignableNum && scope.row.assignableNum>0" 
            		@click="toOpenSampleDetailDialog(scope.row, 'ASSG')" class="href-class">
            		<span>{{scope.row.assignableNum}}</span>
            	</a>
            	<span v-else>{{scope.row.assignableNum}}</span>
            </template>
        </el-table-column>
        
        <el-table-column label="已分配量" width="100px" align="center" >
            <template slot-scope="scope">
            	<a v-if="scope.row.allcateNum && scope.row.allcateNum>0" 
            		@click="toOpenSampleDetailDialog(scope.row, 'ACT')" class="href-class">
            		<span>{{scope.row.allcateNum}}</span>
            	</a>
            	<span v-else>{{scope.row.allcateNum}}</span>
            </template>
        </el-table-column>
        
        <el-table-column label="已删除量" width="100px" align="center" >
            <template slot-scope="scope">
            	<a v-if="scope.row.deleteNum && scope.row.deleteNum>0" 
            		@click="toOpenSampleDetailDialog(scope.row, 'DEL')" class="href-class">
            		<span>{{scope.row.deleteNum}}</span>
            	</a>
            	<span v-else>{{scope.row.deleteNum}}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>

        <el-table-column  align="center" label="操作" width="87px" fixed="right">
            <template slot-scope="scope">
            	<el-button v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog title="数据抽取" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-add-sample" :close-on-click-modal="false" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

				<div style="display: table">
	               	<el-form-item label="数据日期" prop="extractStartDate" required style="float: left;width: 360px;">
	                   	<el-date-picker type="date"  v-model="form.extractStartDate" placeholder="开始日期" 
              				 value-format="yyyy-MM-dd" style="width: 130px;">
	                   	</el-date-picker>
	                   	-
	                   	<el-date-picker type="date"  prop="extractEndDate" v-model="form.extractEndDate" placeholder="结束日期" 
              				:clearable="true" value-format="yyyy-MM-dd" style="width: 130px;">
	                   	</el-date-picker>
	               	</el-form-item>
	            </div>
	            <div style="display: table">
	            	<el-form-item label="抽检规则" prop="ruleName" required style="float: left;width: 350px;">
	                   	<el-input v-model="form.ruleName" readonly placeholder="请选择抽检规则" style="width: 225px;"></el-input>
	                   	<el-button @click="toSelectRule()" type="primary"
				        	 style="margin-top: 3px;margin-left: -3px;">选择</el-button>
	               	</el-form-item>
	            </div>
               	<div style="display: table;">
	                <el-form-item label="备注" prop="remark" style="float: left;width: 353px;">
	                    <el-input type="textarea" v-model="form.remark" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容"></el-input>
	                </el-form-item>
            	</div>
            	
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog(false)">取 消</el-button>
            <el-button :loading=submitBtnLoading @click="executeHandler()" type="primary">确 定</el-button>
        </div>
    </el-dialog>
    
    <!--任务抽检页面 抽检规则选择-->
    <el-dialog :title="'抽检结果'" v-if="resultDgVisible" :visible.sync="resultDgVisible" 
    	custom-class="result-dialog" :close-on-click-modal="false" :append-to-body="true" :modal-append-to-body="false">
      	<div class="el-dialog-panel">
      		<el-table :key='2' :data="resultList"  max-height="370" border fit highlight-current-row>
		
			    <el-table-column label="日期" width="120px" align="center">
		            <template slot-scope="scope"><span>{{scope.row.date}}</span></template>
		        </el-table-column>
		
			    <el-table-column label="提交结果" align="center" :show-overflow-tooltip='true'>
		            <template slot-scope="scope"><span>{{scope.row.msg}}</span></template>
		        </el-table-column>
		    </el-table>
      	</div>
      	<div slot="footer" class="dialog-footer">
            <el-button @click="closeResultDg()">关 闭</el-button>
        </div>
    </el-dialog>
    
    <!--任务抽检页面 抽检规则选择-->
    <el-dialog title="选择抽检规则" v-if="selectRuleVisible" :visible.sync="selectRuleVisible" 
    	top="7vh" custom-class="select-rule-dialog" :append-to-body="true" >
      	<select-rule ref="selectRule" :ruleId="form.ruleId" :close="closeSelectRuleDialog" 
      		:callback="selectRuleCallback"/>
    </el-dialog>
    
    <!--查询条件项 抽检规则选择-->
    <el-dialog title="选择抽检规则" v-if="selectQueryRuleVisible" :visible.sync="selectQueryRuleVisible" 
    	top="7vh" custom-class="select-rule-dialog" :append-to-body="true" :modal-append-to-body="false">
      	<select-rule ref="selectQueryRule" :ruleId="listQuery.ruleId" :close="closeSelectQueryRuleDialog" 
      		:callback="selectQueryRuleCallback"/>
    </el-dialog>
    
    <!--分配任务-->
    <el-dialog title="分配任务" v-if="toAllocateVisible" :visible.sync="toAllocateVisible" custom-class="to-allocate-dialog"
    	:append-to-body="true" :modal-append-to-body="false">
      	<to-allocate ref="toAllocate" :samples="multipleSelection" :close="closeAllocateDialog" 
      		:callback="toAllocateCallback"/>
    </el-dialog>
    
    <!--回收任务-->
    <el-dialog title="回收任务" v-if="toRecycleVisible" :visible.sync="toRecycleVisible" 
    	:append-to-body="true" :modal-append-to-body="false" custom-class="to-allocate-dialog">
      	<to-recycle ref="toRecycle" :samples="multipleSelection" :close="closeRecycleDialog" 
      		:callback="toRecycleCallback"/>
    </el-dialog>
    
    <!--抽检数据详情-->
    <el-dialog title="抽检数据详情" v-if="sampleDetailVisible" :visible.sync="sampleDetailVisible" 
    	top="5vh" custom-class="sample-detail-dialog" :append-to-body="true" :modal-append-to-body="false">
    	<div class="el-dialog-panel">
    		<sample-detail ref="sampleDetail" :sample="curRow" :dataType="dataType" :close="closeSampleDetailDialog" 
    			:callback="sampleDetailCallback"/>
    	</div>
    	<div slot="footer" class="dialog-footer">
            <el-button @click="closeSampleDetailDialog()">关 闭</el-button>
        </div>
    </el-dialog>
    
    <!--坐席抽检汇总详情-->
    <el-dialog title="抽检汇总" :visible.sync="sampleAgentStatVisible" 
    	top="7vh" custom-class="sample-stat-dialog" :append-to-body="true" :modal-append-to-body="false">
    	<div class="el-dialog-panel">
    		<sample-agent-stat/>
    	</div>
    	<div slot="footer" class="dialog-footer">
            <el-button @click="sampleAgentStatVisible = false;">关 闭</el-button>
        </div>
    </el-dialog>
    
</div>
</template>

<style>
.el-dialog-u-add-sample{
  width: 410px;
}
.select-rule-dialog{
  width: 400px;
}
.result-dialog{
  width: 600px;
}
.to-allocate-dialog{
  width: 600px;
}
.to-recycle-dialog{
  width: 670px;
}
.sample-detail-dialog{
  width: 1100px;
}
.sample-stat-dialog{
  width: 900px;
}

</style>

<script>
import {page, execute, getObj, delObj} from '@/views/quality/business/api/sample';
import {getBusiness, tree} from '@/views/quality/setting/api/sampleRule';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
import {getMapFromArr} from '@/utils/arrayUtil';
import {getDurationDateStr} from '@/utils/dateUtil';
export default {
  	name: 'sample',
  	components:{
  		'select-rule':() => import('./selectRule'),
  		'to-allocate':() => import('./toAllocate'),
  		'to-recycle':() => import('./toRecycle'),
  		'sample-detail':() => import('./sampleDetail'),
  		'sample-agent-stat':() => import('./sampleAgentStat')
  	},
  	data() {
    	return {
	      	metadata:{
		        ruleId: undefined,
		        ruleName: undefined,
		        extractStartDate: undefined,
		        extractEndDate: undefined,
		        remark: undefined
	      	},
	      	form: $.extend(true, {}, this.metadata),
	      	rules: {
	            ruleName: [{required: true, message: '请选择抽检规则',trigger: 'blur'}],
	            remark: creatValid(check('', 2, 500)),
	            extractStartDate: creatValid((rule, value, callback)=>{
		      			if(!value){
		      				callback(new Error("请选择数据开始日期"));
		      			}else{
		      				if(this.form.extractEndDate && this.form.extractEndDate < value){
		      					callback("结束日期不能小于开始日期");
		      				}else{
					    		callback();
		      				}
		      			}
		      		}),
	            extractEndDate: creatValid((rule, value, callback)=>{
		      			if(!this.form.extractStartDate){
		      				callback(new Error("请选择数据日期"));
		      			}else{
	      					if(value && this.form.extractStartDate > value){
		      					callback("结束日期不能小于开始日期");
		      				}else{
					    		callback();
		      				}
		      			}
		      		})            
	      	},
	      	list: null,
	      	pager:Pager(),
	      	listLoading: true,
	      	listQuery: {
		        batchNo: undefined,
		        businessCode: undefined,
		        ruleId: undefined,
		        ruleName: undefined,
		        sampleType: undefined,
		        extractDateStart: getDurationDateStr(-10),
		        extractDateEnd: undefined,
		        status: undefined,
	      	},
	      	dialogVisible: false,
	      	resultDgVisible: false,
	      	isShowBtnExe: false,
	      	isShowBtnAgentStat: false,
	      	isShowBtnAllocate: false,
	      	isShowBtnRecycle: false,
	      	isShowBtnDel: false,
	      	submitBtnLoading:false,
	      	tableKey: 0,
	      	multipleSelection:[],
	      	businessCodes:[],
	      	statusArr:[
	      		{value:0, name:'正在抽取'},
	      		{value:1, name:'抽取成功'},
	      		{value:2, name:'抽检失败'},
	      		{value:3, name:'已分配'}
	      	],
	      	selectQueryRuleVisible:false,
	      	selectRuleVisible:false,
	      	toAllocateVisible: false,
	      	toRecycleVisible: false,
	      	sampleDetailVisible: false,
	      	sampleAgentStatVisible: false,
	      	resultList: [],
	      	curRow:{},
	      	dataType:''
	    }
  	},
	created() {
	    this.pager.init(this.getList);
	    this.getList();
	    this.init();
	    this.isShowBtnAgentStat = hasPermission('sample.stat.agent');
	    this.isShowBtnExe = hasPermission('sample.execute');
	    this.isShowBtnAllocate = hasPermission('sample.allocate');
	    this.isShowBtnRecycle = hasPermission('sample.allocate');
	    this.isShowBtnDel= hasPermission('sample.delete');
	},
  	computed: {
  		...mapGetters(['tenantId']),
  		statusMapping(){
  			return getMapFromArr(this.statusArr);
  		}
  	},
  	methods: {
	  	init(){
	    	getBusiness().then(response => {this.businessCodes = response.data;});
	    	tree().then(response => {
	        	this.treeData = response.data;
	      	});
	    },
	    getList() {
	      this.listLoading = true;
	      $.extend(this.listQuery, this.pager.getPage());
	      page(this.listQuery).then(response => {
	        this.list = response.data.list;
	        this.pager.render(response.data.totalSize);
	        this.listLoading = false;
	      })
	    },
	    handleSelectionChange(val) {
		    this.multipleSelection = val;
		},
		clickRow(row, event, column) {
		    this.$refs['resTable'].toggleRowSelection(row, this.multipleSelection.indexOf(row)<0);
	    },
	    openResultDg(){
	    	this.resultDgVisible = true;
	    },
	    closeResultDg(){
	      this.resultDgVisible = false;
	      this.resultList = [];
	    },
	    openDialog(){
	      this.dialogVisible = true;
	    },
	    closeDialog(){
	      this.dialogVisible = false;
	      this.$refs['form'].resetFields();
	      this.resetForm();
	    },
	    toSelectRule(){
	    	this.selectRuleVisible = true;
	    },
	    closeSelectRuleDialog(){
	    	this.selectRuleVisible = false;
	    },
	    selectRuleCallback(rule){
	    	if(!rule.ruleId){
	    		this.form.ruleId = '';
	    		this.form.ruleName = '';
	    	}else if(this.form.ruleId != rule.ruleId){
	    		this.form.ruleId = rule.ruleId;
	    		this.form.ruleName = rule.ruleName;
	    	}
	    },
	    toSelectQueryRule(){
	    	this.selectQueryRuleVisible = true;
	    },
	    closeSelectQueryRuleDialog(){
	    	this.selectQueryRuleVisible = false;
	    },
	    selectQueryRuleCallback(rule){
	    	if(!rule.ruleId){
	    		this.listQuery.ruleId = '';
	    		this.listQuery.ruleName = '';
	    	}else if(this.listQuery.ruleId != rule.ruleId){
	    		this.listQuery.ruleId = rule.ruleId;
	    		this.listQuery.ruleName = rule.ruleName;
	    	}
	    },
	    clearRule(){
	    	this.listQuery.ruleId = '';
	    	this.listQuery.ruleName = '';
	    },
	    toExecute() {
	        this.openDialog();
	    },
	    toAllocate() {
	    	if(!this.multipleSelection || !this.multipleSelection.length){
	    		this.$message.warning({message: '请选择要分配的抽检批次',showClose: true});
	    		return;
	    	}
	    	let breakFlag = false;
	    	this.multipleSelection.forEach((item, i)=>{
				if((item.status != 3 && item.status != 1) || item.assignableNum < 1){//已分配，抽取成功,没有可分配任务
					this.$message.warning({message: '请选择可分配的抽检批次',showClose: true});
					breakFlag = true;
					return false;
				}
			});
			if(breakFlag){
				return ;
			}
	        this.toAllocateVisible = true;
	    },
	    closeAllocateDialog(){
	    	this.toAllocateVisible = false;
	    },
	    toAllocateCallback(){
	    	this.getList();
	    },
	    toRecycle() {
	    	if(!this.multipleSelection || !this.multipleSelection.length){
	    		this.$message.warning({message: '请选择要回收的抽检批次',showClose: true});
	    		return;
	    	}
	    	let breakFlag = false;
			this.multipleSelection.forEach((item, i)=>{
				if(item.status != 3){//已分配
					this.$message.warning({message: '请选择已分配的抽检批次',showClose: true});
					breakFlag = true;
					return false;
				}
			});
			if(breakFlag){
				return ;
			}
	        this.toRecycleVisible = true;
	    },
	    closeRecycleDialog(){
	    	this.toRecycleVisible = false;
	    },
	    toRecycleCallback(){
	    	this.getList();
	    },
	    toOpenSampleDetailDialog(row, dataType) {
	    	this.curRow = row;
	    	this.dataType = dataType;
	        this.sampleDetailVisible = true;
	    },
	    closeSampleDetailDialog(){
	    	this.curRow = {};
	    	this.dataType = '';
	    	this.sampleDetailVisible = false;
	    },
	    sampleDetailCallback(){
	    	this.getList();
	    },
	    deleteHandler(row) {
	      this.$confirm('确认要删除该记录?', '提示', {
	        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
	      }).then(() => {
	          delObj(row.id).then((response) => {
	              if(response && response.rel){
	                this.$message({message: '删除成功',showClose: true,type: 'success'});
	                this.getList();
	              }else{
	                this.$message({message: response.msg ? response.msg : '删除失败',showClose: true,type: 'error'});
	              }
	            });
	        }).catch(()=>{});
	    },
	    executeHandler() {
	      this.$refs['form'].validate(valid => {
	        if (valid) {
	          this.submitBtnLoading = true;
	          execute(this.form).then(response => {
	              if(response && response.rel && response.data){
	                this.closeDialog(true);
	                this.resultList = response.data;
	                this.openResultDg();
	                this.getList();
	              } else{
	              	this.$message({message: response.msg ? response.msg : '抽检失败',showClose: true,type: 'error'});
	              }
	              this.submitBtnLoading = false;
	          });
	        } else {
	          return false;
	        }
	      });
	    },
	    resetForm() {
	      this.form = $.extend(true, {}, this.metadata);
	    }    
  	}
}
</script>