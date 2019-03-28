<template>
<div class="calendar-list-container">
	
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row 
    	max-height="400" ref="resTable" >

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
import {listSampleDetail} from '@/views/quality/business/api/mainTask';
import $ from 'jquery';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
export default {
  	name: 'sampleStatDetail',
  	props: {
	    startTime:{
	    	type: String,
      		required: true
	    },
	    endTime:{
	    	type: String,
      		required: true
	    },
	    busiGroupCode:{
	    	type: String,
      		required: true
	    },
	    agentId:{
	    	type: String,
      		required: true
	    }
  	},
  	data() {
	    return {
	      	list: [],
	      	pager:Pager(),
	      	listLoading: true,
	      	listQuery: {
		        dataType: 'ALL',
		        startTime: this.startTime,
		        endTime: this.endTime,
		        busiGroupCode: this.busiGroupCode,
		        agentId: this.agentId
	      	},
	      	tableKey: 0,
	    }
  	},
	created() {
	    this.pager.init(this.getList);
	    this.getList();
	},
  	computed: {
  		...mapGetters(['tenantId'])
  	},
  	methods: {
	    getList() {
	      this.listLoading = true;
	      $.extend(this.listQuery, this.pager.getPage());
	      listSampleDetail(this.listQuery).then(response => {
	        this.list = response.data.list;
	        this.pager.render(response.data.totalSize);
	        this.listLoading = false;
	      })
	    }
  	}
}
</script>