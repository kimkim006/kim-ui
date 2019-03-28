<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" ref="listQuery" :model="listQuery">
        	<el-form-item class="el-form-item-u">
				<el-select v-model="listQuery.approvalType" style="width: 100px;" @keyup.enter.native="getList" class="filter-item">
					<el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item class="el-form-item-u" label="录音日期">
                <el-date-picker type="date"  v-model="listQuery.startTime" placeholder="开始日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
                -
                <el-date-picker  type="date" v-model="listQuery.endTime" placeholder="结束日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="抽检批次号">
                  <el-input v-model="listQuery.batchNo" placeholder="输入批次号" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	      	<el-form-item class="el-form-item-u" label="业务线">
				<el-select v-model="listQuery.businessCode" placeholder="选择业务线" :clearable='true' style="width: 100px;" @keyup.enter.native="getList" class="filter-item">
					<el-option v-for="item in businessCodes" :key="item.code" :label="item.name" :value="item.code"></el-option>
				</el-select>
			</el-form-item>
            <el-form-item v-if="listQuery.approvalType == 1" class="el-form-item-u" label="质检员">
                <el-input v-model="listQuery.agentId" placeholder="输入工号" style="width: 133px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item v-else class="el-form-item-u" label="坐席">
                <el-input v-model="listQuery.agentId" placeholder="输入工号" style="width: 133px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="审核结果">
                <el-select v-model="listQuery.approvalStatus" clearable filterable placeholder="选择结果" style="width: 110px;">
                  <el-option v-for="item in approvalStatusAllArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="状态">
                <el-select v-model="listQuery.status" clearable filterable placeholder="选择状态" style="width: 110px;">
                  <el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="客户电话">
                <el-input v-model="listQuery.custPhone" clearable style="width: 120px;" placeholder="输入电话"  @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="操作时间">
                <el-date-picker type="datetime"  v-model="listQuery.operTimeStart" placeholder="操作开始时间" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 150px;"></el-date-picker>
                -
                <el-date-picker  type="datetime" v-model="listQuery.operTimeEnd" placeholder="操作结束时间" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 150px;"></el-date-picker>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                  <el-button class="filter-item" type="primary" v-waves @click="getList">搜索</el-button>
                  <el-button class="filter-item" v-if="isShowBtnBatchAudit" type="success" @click="toBatchAudit()">批量审核</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row 
    	@selection-change="handleSelectionChange">
    	
        <el-table-column type="selection" width="47" fixed="left"></el-table-column>
        
	    <el-table-column label="审批类型" width="150px" align="center" >
            <template slot-scope="scope"><span>{{typeArrMapping[scope.row.approvalType]}}</span></template>
        </el-table-column>
        
	    <el-table-column label="抽检批次号" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.batchNo}}</span></template>
        </el-table-column>

	    <el-table-column label="业务线" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.businessCode}}</span></template>
        </el-table-column>
        
        <el-table-column label="录音流水" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.serialNumber}}</span></template>
        </el-table-column>
        
        <el-table-column label="客户电话" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.custPhone}}</span></template>
        </el-table-column>
        
        <el-table-column label="录音时长" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.recordTime}}</span></template>
        </el-table-column>

	    <el-table-column label="开始时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.startTime}}</span></template>
        </el-table-column>

	    <el-table-column label="结束时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.endTime}}</span></template>
        </el-table-column>

	    <el-table-column label="小组" width="140px" align="center" >
	    	<template slot-scope="scope"><span>{{scope.row.groupName}}</span></template>
        </el-table-column>

	    <el-table-column label="提交人" width="150px" align="center" >
	    	<template slot-scope="scope"><span>{{scope.row.submitterName}}</span></template>
        </el-table-column>
        
	    <el-table-column label="提交时间" width="180px" align="center" >
	    	<template slot-scope="scope"><span>{{scope.row.submitTime}}</span></template>
        </el-table-column>
        
	    <el-table-column label="当前处理人" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.curProcesserName}}</span></template>
        </el-table-column>
        
        <el-table-column label="得分" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.score}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>
        
        <el-table-column label="状态" width="120px" align="center" fixed="right">
        	<template slot-scope="scope"><span>{{scope.row.statusName}}</span></template>
      	</el-table-column>
        
        <el-table-column align="center" label="操作" width="87px" fixed="right">
        	<template slot-scope="scope">
          		<el-button v-if="isShowBtnAudit && (scope.row.status == 3 || scope.row.status == 6)" size="small" type="success" @click="toDetail(scope.row)">审核</el-button>
          		<el-button v-else-if="isShowBtnAudit" size="small" type="primary" @click="toDetail(scope.row)">详情</el-button>
        	</template>
      	</el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="batchDialogVisible" custom-class="el-dialog-batch-audit"
    		:append-to-body="true" :modal-append-to-body="false">
		<div class="el-dialog-panel">
		    <el-form :model="form" ref="form" :rules="rules" label-width="85px" class="form-body-u">
		
				<div style="display: table;">
					<el-form-item label="审核意见" prop="status" required style="float: left;">
			            <el-select v-model="form.status" placeholder="选择状态" style="width: 110px;" @change="approvalStatusChangeHandler">
			              <el-option v-for="item in approvalStatusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
			            </el-select>
			        </el-form-item>
					<el-form-item label="是否记错" prop="mistake" style="float: left;">
			          	<el-checkbox v-model="form.mistake" :disabled="form.status != 2"></el-checkbox>
			        </el-form-item>
				</div>
				<div style="display: table;">
			        <el-form-item label="意见内容" prop="content" required style="width: 440px;">
			          	<el-input type="textarea" v-model="form.content" :autosize="{minRows: 2, maxRows: 5}" placeholder ="请输入审核意见"></el-input>
			        </el-form-item>
		        </div>
		    </el-form>
	    </div>
		<div slot="footer" class="dialog-footer">
	        <el-button @click="closeBatchDialog()">取 消</el-button>
	        <el-button :loading="submitBtnLoading" @click="batchAuditHandler()" type="primary">提 交</el-button>
	    </div>
    </el-dialog>

    <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-approval-detail" top="3vh" :center="true" :append-to-body="true" :modal-append-to-body="false">
        <main-task-detail :taskId="curRow.id" :stage="stage" :close="closeDialog" :callback="detailCallback"></main-task-detail>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-batch-audit{
  	width: 500px;
}
.el-dialog-u-approval-detail{
	width: 1000px;
}

</style>

<script>
import {listStatus, listApproval} from '@/views/quality/business/api/mainTask';
import {auditBatch} from '@/views/quality/business/api/approval';
import {getBusiness} from '@/views/quality/setting/api/sampleRule';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {getMapFromArr} from '@/utils/arrayUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
	name: 'mainTaskApproval',
	components: {
	    'main-task-detail': () => import('./mainTaskDetail/mainTaskDetail')
	},
	data() {
	    return {
	      	list: null,
	      	pager:Pager(),
	      	listLoading: false,
	     	listQuery: {
	     		approvalStatus: '',
		  		approvalType: 1,
		        batchNo: undefined,
		        businessCode: undefined,
		        agentId: undefined,
		        qualityGroupCode: undefined,
		        inspector: undefined,
		        status: undefined,
		        custPhone: undefined,
		        operTimeStart: undefined,
		        operTimeEnd: undefined
		  	},
		  	rules: {
				status: [{required: true, message: '请选择审核意见',trigger: 'blur'}],
				content: creatValid(checkRequire('意见内容', 2, 500))
			},
			metadata:{
		  		status: 1,
		  		content:"",
		  		mistake: 0
		  	},
		  	form: $.extend(true, {}, this.metadata),
		  	title: '详情',
		  	dialogVisible: false,
		  	batchDialogVisible: false,
		  	submitBtnLoading: false,
		  	isShowBtnAudit: false,
		  	isShowBtnBatchAudit: false,
		  	tableKey: 0,
		  	curRow: '',
		  	stage: "APPROVAL",//stage=APPROVAL审核阶段的状态
		  	statusArr: [],
		  	approvalStatusArr:[{value: 1,name: '通过'},{value: 2,name: '驳回'}],
		  	businessCodes:[],
		  	typeArr:[{value:1, name:'评分审批'}, {value:2, name:'申诉审批'}],
		  	approvalStatusAllArr:[
		  		{value:0, name:'待审批'}, 
		  		{value:1, name:'审批通过'}, 
		  		{value:2, name:'审批驳回'}
	      	],
	      	selectedArr: [],
	    }
	},
	created() {
		this.pager.init(this.getList);
		this.init();
		//this.getList();
	    this.isShowBtnAudit = hasPermission('mainTaskApproval.audit');
	    this.isShowBtnBatchAudit = hasPermission('mainTaskApproval.batchAudit');
	},
	computed: {
	    ...mapGetters(['elements']),
	    typeArrMapping(){
	    	return getMapFromArr(this.typeArr);
	    },
	    approvalStatusAllMapping(){
	    	return getMapFromArr(this.approvalStatusAllArr);
	    }
	},
	methods: {
	  	init(){
	  		getBusiness().then(response => {this.businessCodes = response.data;});
	  		listStatus(this.stage).then(response => {
		      	this.statusArr = response.data;
		    });
	  	},
	    getList() {
	      	this.listLoading = true;
	      	$.extend(this.listQuery, this.pager.getPage());
	      	listApproval(this.listQuery).then(response => {
	      		this.listLoading = false;
	        	this.list = response.data.list;
	        	this.pager.render(response.data.totalSize);
	      	});
	    },
	    openBatchDialog(){
	    	this.title = '批量审批任务';
			this.batchDialogVisible = true;
		},
		closeBatchDialog(toClear){
		  this.batchDialogVisible = false;
		  this.resetForm();
		},
		closeDialog(){
		  this.dialogVisible = false;
		},
		openDialog(){
			this.title = '审批任务';
			this.dialogVisible = true;
		},
		toDetail(row) {
			this.curRow = row;
			this.openDialog();
		},
		toBatchAudit(){
			if(!this.selectedArr || !this.selectedArr.length){
				this.$message.warning({message: '请选择要审批的任务',showClose: true});
				return ;
			}
			this.openBatchDialog();
		},
		handleSelectionChange(val) {
		  	this.selectedArr = val;
		},
		approvalStatusChangeHandler(val) {
		  if(val == 1 && !this.form.content){
		    this.form.content = '批量通过';
		  }
		},
		batchAuditHandler() {
			this.$refs['form'].validate(valid => {
		    	if (valid) {
		    		this.$confirm('确定要批量审核?', '提示', {
				        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				    }).then(() => {
		        		this.submitBtnLoading = true;
				      	let taskIds = [];
				      	let approvalIds = [];
					    for (var i = 0; i < this.selectedArr.length; i++) {
					        taskIds.push(this.selectedArr[i].id);
					        approvalIds.push(this.selectedArr[i].approvalId);
					    }
				      	let data = {
					    	type: this.listQuery.approvalType,
				      		status: this.form.status,
							content: this.form.content,
							taskId: taskIds.join(),
							id: approvalIds.join(),
							mistake: this.form.mistake?1:0
				      	};
				      	auditBatch(data).then(response => {
				        	if (response && response.rel) {
				          		this.closeBatchDialog();
				          		this.$message({message: '审批成功【'+response.data+'】条', showClose: true, type: 'success'});
				          		this.getList();
					        } else {
					          	this.$message.error({message: response.msg ? response.msg : '审批失败', showClose: true});
					        }
				        	this.submitBtnLoading = false;
				      	});
				    }).catch(()=>{});
	    		} else {
		          	return false;
		        }
		    });
	    },
	    detailCallback() {
	      	this.getList();
	    },
	    resetForm() {
	      	this.form = $.extend(true, {}, this.metadata);
	    },
	}
}
</script>
