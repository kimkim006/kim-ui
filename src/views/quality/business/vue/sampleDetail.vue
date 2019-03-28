<template>
<div class="calendar-list-container">
    <div class="filter-container" style="margin: 3px 0 0 6px;">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="类别">
              	<el-select v-model="listQuery.dataType" @change="getList()" style="width: 130px;">
                	<el-option v-for="item in dataTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
              	</el-select>
            </el-form-item>
            <el-form-item v-if="listQuery.dataType == 'ALL' || listQuery.dataType == 'ACT'" class="el-form-item-u" label="状态">
              	<el-select v-model="listQuery.status" clearable filterable placeholder="选择状态" style="width: 130px;">
                	<el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
              	</el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="业务小组">
                <el-select v-model="listQuery.busiGroupCode" clearable placeholder="选择业务小组" style="width: 120px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in bsGroupArr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="坐席工号">
                <el-input v-model="listQuery.agentId" placeholder="输入关键字" clearable style="width: 100px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item v-if="listQuery.dataType == 'ALL' || listQuery.dataType == 'ACT'" class="el-form-item-u" label="质检员工号">
                <el-input v-model="listQuery.inspector" placeholder="输入关键字" clearable style="width: 100px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
                <el-button v-if="isShowBtnDel && listQuery.dataType == 'ASSG'" class="filter-item" type="danger" v-waves 
                	:loading="submitBtnLoading" @click="deleteHandler">删除任务</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row 
    	max-height="380" ref="resTable" @selection-change="handleSelectionChange" @row-click="clickRow">

		<el-table-column type="selection" width="47" fixed="left"></el-table-column>
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
        
        <el-table-column label="服务类型" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.summary.typeName}}</span></template>
        </el-table-column>
        
        <el-table-column label="来电一级" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.summary.firstName}}</span></template>
        </el-table-column>
        
        <el-table-column label="来电二级" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.summary.secondName}}</span></template>
        </el-table-column>
        
        <el-table-column label="来电三级" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.summary.thirdName}}</span></template>
        </el-table-column>
        
        <el-table-column label="来电四级" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.summary.forthName}}</span></template>
        </el-table-column>
        
	    <el-table-column label="状态" width="120px" align="center" fixed="right">
            <template slot-scope="scope"><span>{{scope.row.statusName}}</span></template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>
    
</div>
</template>

<style>
</style>

<script>
import {listSampleDetail, listStatus} from '@/views/quality/business/api/mainTask';
import {delSampleDetal} from '@/views/quality/business/api/sample';
import {listBsGroup} from '@/views/admin/api/group';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
export default {
  	name: 'sampleDetail',
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
	    sample:{
	    	type: Object,
      		required: true
	    },
	    dataType:{
	    	type: String,
	    	default:'ALL'
	    }
  	},
  	data() {
	    return {
	      	list: [],
	      	pager:Pager(),
	      	listLoading: true,
	      	listQuery: {
		        batchNo: this.sample.batchNo,
		        dataType: this.dataType,
		        status: undefined,
		        busiGroupCode: undefined,
		        agentId: undefined,
		        inspector: undefined
	      	},
	      	stage:'ALL',
	      	tableKey: 0,
	      	statusArr:[],
	      	bsGroupArr:[],
	      	dataTypeArr:[
	      		{value:'ALL', name: '全部数据'},
	      		{value:'ASSG', name: '可分配数据'},
	      		{value:'ACT', name: '已分配数据'},
	      		{value:'DEL', name: '已删除的数据'},
	      	],
	      	isShowBtnDel: false,
	      	multipleSelection:[],
	      	submitBtnLoading:false,
	    }
  	},
	created() {
		this.listQuery.batchNo = this.sample.batchNo;
		this.listQuery.dataType = this.dataType;
	    this.pager.init(this.getList);
	    this.getList();
	    this.init();
	    this.isShowBtnDel= hasPermission('sample.deleteDetail');
	},
  	computed: {
  		...mapGetters(['tenantId'])
  	},
  	methods: {
  		init(){
  			listStatus(this.stage).then(response => {
  				this.statusArr = response.data;
  			});
  			listBsGroup().then(response => {
		        this.bsGroupArr = response.data;
		    });
  		},
	    getList() {
	      this.listLoading = true;
	      $.extend(this.listQuery, this.pager.getPage());
	      listSampleDetail(this.listQuery).then(response => {
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
	    deleteHandler(){
	    	if(!this.multipleSelection || !this.multipleSelection.length){
	    		this.$message.warning({message: '请选择要删除的任务数据',showClose: true});
	    		return;
	    	}
	    	let taskIdArr = [];
	    	let breakFlag = false;
			this.multipleSelection.forEach((item, i)=>{
				if(item.status != 0 && item.status != 1){//0待分配，1已回收
					this.$message.warning({message: '请选择可分配的任务数据',showClose: true});
					breakFlag = true;
					return false;
				}
				taskIdArr.push(item.id);
			});
			if(breakFlag){
				return ;
			}
			
	    	this.$confirm('确认要删除这'+taskIdArr.length+'个任务数据?', '提示', {
		        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
		    }).then(() => {
		    	this.submitBtnLoading = true;
		    	let data = {
		    		batchNo: this.sample.batchNo,
		    		taskId: taskIdArr.join()
		    	};
		        delSampleDetal(data).then((response) => {
		            if(response && response.rel){
		                this.$message({message: '删除成功',showClose: true,type: 'success'});
		                this.getList();
		                this.callback()
		            }else{
		                this.$message({message: response.msg ? response.msg : '删除失败',showClose: true,type: 'error'});
		            }
		            this.submitBtnLoading = false;
		        });
		    }).catch(()=>{});
	    }
  	}
}
</script>