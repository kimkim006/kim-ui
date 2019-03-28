<template>
<div class="calendar-list-container">
    <div class="filter-container" style="margin: 3px 0 0 6px;">
        <el-form :inline="true" :model="listQuery">

			<el-form-item class="el-form-item-u" label="日期">
                <el-date-picker type="date"  v-model="listQuery.startTime" placeholder="开始日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
                -
                <el-date-picker  type="date"  v-model="listQuery.endTime" placeholder="结束日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="业务小组">
                <el-select v-model="listQuery.busiGroupCode" clearable placeholder="选择业务小组" style="width: 150px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in bsGroupArr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="坐席工号">
                <el-input v-model="listQuery.agentId" clearable style="width: 100px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            </el-form-item>
            <el-form-item v-if="list" class="el-form-item-u" >
                <span>共计</span>
                <span style="color: blue;font-weight: bold;">{{list && list.length ? list.length:0}}</span>
                <span>个坐席</span>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row 
    	    	max-height="360" ref="resTable">
    	
		<el-table-column label="开始日期" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.startTime}}</span></template>
        </el-table-column>
        
        <el-table-column label="结束日期" width="120px" align="center">
            <template slot-scope="scope"><span>{{scope.row.endTime}}</span></template>
        </el-table-column>
        
	    <el-table-column label="坐席工号" width="130px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentId}}</span></template>
        </el-table-column>
        
        <el-table-column label="坐席姓名" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentName}}</span></template>
        </el-table-column>
        
        <el-table-column label="业务小组" width="200px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.busiGroupName}}</span></template>
        </el-table-column>

	    <el-table-column label="已抽取数量" width="120px" align="center" >
            <template slot-scope="scope">
            	<a v-if="scope.row.num && scope.row.num>0" @click="toOpenSampleStatDetailDialog(scope.row)" class="href-class">
            		<span>{{scope.row.num}}</span>
            	</a>
            	<span v-else>{{scope.row.num}}</span>
            </template>
        </el-table-column>

    </el-table>
    
    <!--坐席抽检汇总详情-->
    <el-dialog title="坐席抽检详情" v-if="sampleStatDetailVisible" :visible.sync="sampleStatDetailVisible"
    	top="9vh" custom-class="sample-stat-detail-dialog" :append-to-body="true">
    	<div class="el-dialog-panel" style="overflow: hidden;">
    		<sample-stat-detail :startTime="listQuery.startTime" :endTime="listQuery.endTime" 
    				:busiGroupCode="listQuery.busiGroupCode" :agentId="agentId" />
    	</div>
    	<div slot="footer" class="dialog-footer">
            <el-button @click="closeSampleStatDetailDialog()">关 闭</el-button>
        </div>
    </el-dialog>

</div>
</template>

<style>
.sample-stat-detail-dialog{
  width: 1100px;
}
</style>

<script>
import {listSampleAgentStat} from '@/views/quality/business/api/mainTask';
import {listBsGroup} from '@/views/admin/api/group';
import {getMonthFirstDate, formatDate} from '@/utils/dateUtil';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
export default {
  	name: 'sampleAgentStat',
  	components:{
  		'sample-stat-detail':() => import('./sampleStatDetail')
  	},
  	data() {
	    return {
	      	list: null,
	      	listLoading: true,
	      	listQuery: {
		        startTime: formatDate(getMonthFirstDate(new Date()), 'yyyy-MM-dd'),
		        endTime: "",
		        busiGroupCode: "",
		        agentId: ""
	      	},
	      	stage:'ALL',
	      	tableKey: 0,
	      	bsGroupArr:[],
	      	agentId: "",
	      	sampleStatDetailVisible: false
	    }
  	},
	created() {
	    this.getList();
	    this.init();
	},
  	computed: {
  		...mapGetters(['tenantId'])
  	},
  	methods: {
  		init(){
  			listBsGroup().then(response => { this.bsGroupArr = response.data; });
  		},
	    getList() {
	    	if(!this.listQuery.startTime){
	    		this.$message.error({message: '开始日期不能为空',showClose: true});
	    		return ;
	    	}
	      	this.listLoading = true;
	      	listSampleAgentStat(this.listQuery).then(response => {
	        	this.list = response.data;
	        	this.listLoading = false;
	      	});
	    },
	    toOpenSampleStatDetailDialog(row) {
	    	this.agentId = row.agentId;
	        this.sampleStatDetailVisible = true;
	    },
	    closeSampleStatDetailDialog(){
	    	this.agentId ="";
	    	this.sampleStatDetailVisible = false;
	    },
	    
  	}
}
</script>