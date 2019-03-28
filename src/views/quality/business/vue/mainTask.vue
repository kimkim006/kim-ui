<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

			<el-form-item class="el-form-item-u" label="录音日期">
                <el-date-picker type="date"  v-model="listQuery.startTime" placeholder="开始日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
                -
                <el-date-picker  type="date" v-model="listQuery.endTime" placeholder="结束日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="抽检批次号">
                <el-input v-model="listQuery.batchNo" clearable placeholder="输入批次号" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="业务线">
                <el-select v-model="listQuery.businessCode" clearable placeholder="选择业务线" style="width: 120px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in businessCodes" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="业务小组">
                <el-select v-model="listQuery.busiGroupCode" clearable placeholder="选择业务小组" style="width: 120px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in bsGroupArr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="坐席">
                <el-input v-model="listQuery.agentId" placeholder="输入工号" clearable style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="质检小组">
                <el-select v-model="listQuery.qualityGroupCode" clearable placeholder="选择质检小组" style="width: 120px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in qtGroupArr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="质检员">
                <el-input v-model="listQuery.inspector" placeholder="输入工号" clearable style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="当前处理人">
                <el-input v-model="listQuery.curProcesser" placeholder="输入工号" clearable style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="状态">
              	<el-select v-model="listQuery.status" clearable filterable placeholder="选择状态" style="width: 130px;">
                	<el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
              	</el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="录音损坏">
              	<el-select v-model="listQuery.damaged" clearable filterable placeholder="选择" style="width: 80px;">
                	<el-option v-for="item in damagedArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
              	</el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="客户电话">
                <el-input v-model="listQuery.custPhone" clearable style="width: 120px;" placeholder="输入电话" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="操作时间">
                <el-date-picker type="datetime"  v-model="listQuery.operTimeStart" placeholder="操作开始时间" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 150px;"></el-date-picker>
                -
                <el-date-picker  type="datetime" v-model="listQuery.operTimeEnd" placeholder="操作结束时间" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 150px;"></el-date-picker>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
                <el-popover v-if="isShowBtnExport" placement="bottom-start" width="160" v-model="visible1">
  					<p>确定要导出任务数据?</p>
				  	<div style="text-align: center; ">
				    	<el-button size="mini" @click="visible1 = false;">取消</el-button>
				    	<el-button type="primary" size="mini" @click="toExport" >确定</el-button>
				  	</div>
				  	<el-button slot="reference" class="filter-item"  v-waves :loading="downloadBtnLoading"
	                	type="primary">导出</el-button>
				</el-popover>
                <el-popover v-if="isShowBtnExportResult" placement="bottom-start" width="160" v-model="visible2">
  					<p>确定要导出任务数据?</p>
				  	<div style="text-align: center;">
				    	<el-button size="mini"  @click="visible2 = false;">取消</el-button>
				    	<el-button type="primary" size="mini" @click="toExportTask" >确定</el-button>
				  	</div>
	                <el-button slot="reference" class="filter-item" v-waves :loading="downloadBtnLoading"
	                	type="primary">导出结果</el-button>
				</el-popover>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

		<el-table-column label="录音流水" width="120px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.tape.serialNumber}}</span></template>
        </el-table-column>
        
        <el-table-column label="客户电话" width="150px" align="center">
            <template slot-scope="scope"><span>{{scope.row.tape.custPhone}}</span></template>
        </el-table-column>
        
	    <el-table-column label="抽检批次号" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.batchNo}}</span></template>
        </el-table-column>
        
        <el-table-column label="业务线" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.businessCode}}</span></template>
        </el-table-column>
        
        <el-table-column label="录音时长" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.recordTime+'s'}}</span></template>
        </el-table-column>

	    <el-table-column label="开始时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.startTime}}</span></template>
        </el-table-column>

	    <el-table-column label="结束时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.endTime}}</span></template>
        </el-table-column>

	    <el-table-column label="业务小组" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.busiGroupName}}</span></template>
        </el-table-column>

	    <el-table-column label="坐席" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentName}}</span></template>
        </el-table-column>
        
	    <el-table-column label="坐席工号" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentId}}</span></template>
        </el-table-column>

	    <el-table-column label="质检小组" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.qualityGroupName}}</span></template>
        </el-table-column>

	    <el-table-column label="质检员" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.inspectorName}}</span></template>
        </el-table-column>
        
	    <el-table-column label="质检员工号" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.inspector}}</span></template>
        </el-table-column>

	    <el-table-column label="当前处理人" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.curProcesserName}}</span></template>
        </el-table-column>

	    <el-table-column label="状态" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.statusName}}</span></template>
        </el-table-column>

	    <el-table-column label="录音损坏" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.damagedName}}</span></template>
        </el-table-column>
        
	    <el-table-column label="得分" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.score}}</span></template>
        </el-table-column>
        
	    <el-table-column label="得分明细" width="300px" align="center" :show-overflow-tooltip='true'>
            <template slot-scope="scope"><span>{{scope.row.scoreDetail}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>

        <el-table-column  align="center" label="操作" min-width="87px" fixed="right" class-name="operHeader">
            <template slot-scope="scope">
            <el-button type="primary" @click="toDetail(scope.row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>
    
    <el-dialog title="任务详情" v-if="dialogVisible" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-mainTask" top="3vh" :center="true" :append-to-body="true" >
        <main-task-detail :taskId="curRow.id" :stage="stage" :close="closeDialog" ></main-task-detail>
    </el-dialog>
    
</div>
</template>

<style>
.el-dialog-u-mainTask{
  width: 1000px;
}
</style>

<script>
import {page, listStatus, download, downloadTask} from '@/views/quality/business/api/mainTask';
import {getBusiness} from '@/views/quality/setting/api/sampleRule';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
import {getMapFromArr} from '@/utils/arrayUtil';
import {listQtGroup, listBsGroup} from '@/views/admin/api/group';
import {getDurationDateStr} from '@/utils/dateUtil';
export default {
	name: 'mainTask',
	components: {
	      'main-task-detail': () => import('./mainTaskDetail/mainTaskDetail')
	},
	data() {
	    return {
	      	metadata:{
		        batchNo: undefined,
		        businessCode: undefined,
		        busiGroupCode: undefined,
		        agentId: undefined,
		        qualityGroupCode: undefined,
		        inspector: undefined,
		        curProcesser: undefined,
		        lastProcesser: undefined,
		        lastProcessTime: undefined,
		        status: undefined
	      	},
	      	form: $.extend(true, {}, this.metadata),
	      	list: null,
	      	pager:Pager(),
	      	listLoading: false,
	      	downloadBtnLoading:false,
	      	visible1: false,
	      	visible2: false,
	      	listQuery: {
	      		//startTime: getDurationDateStr(-3),
	      		startTime: undefined,
		        endTime: undefined,
		        batchNo: undefined,
		        businessCode: undefined,
		        busiGroupCode: undefined,
		        agentId: undefined,
		        qualityGroupCode: undefined,
		        inspector: undefined,
		        status: undefined,
		        damaged: undefined,
		        custPhone: undefined,
		        operTimeStart: undefined,
		        operTimeEnd: undefined
	      	},
	      	dialogVisible: false,
	      	dialogStatus: '',
	      	isShowBtnExport: false,
	      	isShowBtnExportResult: false,
	      	tableKey: 0,
	      	stage: "ALL",
	      	statusArr:[],
	      	businessCodes:[],
	      	qtGroupArr:[],
	      	bsGroupArr:[],
	      	curRow:{},
	      	damagedArr:[{value:1, name:'是'}, {value:0, name:'否'}]
	      
	    }
	},
	created() {
	    this.pager.init(this.getList);
	    //this.getList();
	    this.init();
	    this.isShowBtnExport = hasPermission('mainTask.export');
	    this.isShowBtnExportResult = hasPermission('mainTask.exportResult');
	},
	computed: {
	  	...mapGetters(['tenantId'])
	},
	methods: {
	  	init(){
	  		getBusiness().then(response => {this.businessCodes = response.data;});
	  		//stage=1申诉阶段的状态
	  		listStatus(this.stage).then(response => {
	  			this.statusArr = response.data;
	  		});
	  		listQtGroup().then(response => {
		        this.qtGroupArr = response.data;
		    });
	  		listBsGroup().then(response => {
		        this.bsGroupArr = response.data;
		    });
	  	},
	    getList() {
	    	if(!this.listQuery.startTime){
	    		this.$message.error({message: '录音开始日期不能为空',showClose: true});
	    		return ;
	    	}
	      	this.listLoading = true;
	      	$.extend(this.listQuery, this.pager.getPage());
	      	page(this.listQuery).then(response => {
	        	this.list = response.data.list;
	        	this.pager.render(response.data.totalSize);
	        	this.listLoading = false;
	      	});
	    },
	    toDetail(row) {
	    	this.curRow = row;
	        this.openDialog();
	    },
	    openDialog(){
	      this.dialogVisible = true;
	    },
	    closeDialog(){
	      this.dialogVisible = false;
	    },
	    toExport(){
//		  	this.$confirm('确定要导出这些任务数据?', '提示', {
//		      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
//		    }).then(() => {
		        this.downloadBtnLoading = true;
			  	download(this.listQuery, ()=>{
			  		this.downloadBtnLoading = false;
			  	});
//		    }).catch(()=>{});
		},
	    toExportTask(){
//		  	this.$confirm('确定要导出这些任务数据?', '提示', {
//		      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
//		    }).then(() => {
		        this.downloadBtnLoading = true;
			  	downloadTask(this.listQuery, ()=>{
			  		this.downloadBtnLoading = false;
			  	});
//		    }).catch(()=>{});
		}
	}
}
</script>