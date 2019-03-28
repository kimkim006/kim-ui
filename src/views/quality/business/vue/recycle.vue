<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">
          	<el-form-item class="el-form-item-u" label="日期">
	            <el-date-picker type="date" v-model="listQuery.operTimeStart" placeholder="开始日期" @keyup.enter.native="getList" class="filter-item"
	                :clearable="true" value-format="yyyy-MM-dd"  style="width: 110px;"></el-date-picker>
            	-
            	<el-date-picker type="date" v-model="listQuery.operTimeEnd" placeholder="结束日期" @keyup.enter.native="getList" class="filter-item"
                	:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
          	</el-form-item>
          	<el-form-item class="el-form-item-u" label="回收批次号">
                <el-input v-model="listQuery.rcyBatchNo" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
           	</el-form-item>
           	<el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
           	</el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

	    <el-table-column label="回收批次号" width="180px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.rcyBatchNo}}</span></template>
        </el-table-column>

	    <el-table-column label="回收详情" width="300px" align="center" :show-overflow-tooltip='true'> 
            <template slot-scope="scope"><span>{{scope.row.detail}}</span></template>
        </el-table-column>

	    <el-table-column label="人员数量" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.userCount}}</span></template>
        </el-table-column>

	    <el-table-column label="任务数量" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.totalCount}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>

        <el-table-column  align="center" label="操作" width="87px" fixed="right">
            <template slot-scope="scope">
            	<el-button v-if="isShowBtnDetailList" size="small" type="success" @click="openDetailDialog(scope.row)">详情</el-button>
            </template>
        </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>
  <!-- 详情列表弹出框 -->
  <el-dialog :title="detailDialogTitle" :visible.sync="detailDialogVisible" custom-class="detail-dialog"
  		:append-to-body="true" :modal-append-to-body="false">
    <detail-table ref="recycleDetail" :currRcyBatchNo="currRcyBatchNo" :close="closeDetailDialog"></detail-table>
  </el-dialog>
</div>
</template>

<style>
.detail-dialog{
  width: 900px;
}
</style>

<script>
import {page} from '@/views/quality/business/api/recycle';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
import {getDurationDateStr} from '@/utils/dateUtil';
export default {
	name: 'recycle',
	components: {
	    'detail-table': () => import('./recycleDetail')
	},
	data() {
	    return {
	      	list: null,
	      	pager:Pager(),
	      	listLoading: false,
	      	listQuery: {
		        rcyBatchNo: undefined,
		        detail: undefined,
		        userCount: undefined,
		        totalCount: undefined,
		        remark: undefined,
	          	//operTimeStart: getDurationDateStr(-7),
	          	operTimeStart: undefined,
	          	operTimeEnd: undefined
	      	},
	      	submitBtnLoading:false,
	      	isShowBtnDetailList: false,
	      	detailDialogVisible:false,
	      	tableKey: 0,
	     	currRcyBatchNo:'',
	      	detailDialogTitle:'详情列表'
	    }
	},
	created() {
		this.pager.init(this.getList);
		//this.getList();
		this.isShowBtnDetailList = hasPermission('recycle.detailList');
	},
	computed: {
	  	...mapGetters(['tenantId']),
	},
	methods: {
	    getList() {
	    	if(!this.listQuery.operTimeStart){
		    	this.$message.error({message: '开始时间不能为空',showClose: true});
		    	return ;
		    }
	     	this.listLoading = true;
		    $.extend(this.listQuery, this.pager.getPage());
		    page(this.listQuery).then(response => {
		    	this.list = response.data.list;
		        this.pager.render(response.data.totalSize);
		        this.listLoading = false;
		    })
	    },
	    closeDetailDialog() {
	      	this.detailDialogVisible = false;
	    },
	    openDetailDialog(row) {
	      	if (!row || !row.id) {
	        	this.$message.warning({message: '请先刷新列表后再查看', showClose: true, type: 'warning', center: true});
	        	return;
	      	}
	      	this.currRcyBatchNo=row.rcyBatchNo;
	      	this.detailDialogTitle = "【"+row.rcyBatchNo+"】详情列表";
	     	if (this.$refs['recycleDetail'] && this.$refs['recycleDetail'].listQuery) {
	        	this.$refs['recycleDetail'].listQuery.rcyBatchNo = row.rcyBatchNo;
	        	this.$refs['recycleDetail'].getList();
	      	}
	      	this.detailDialogVisible = true;
	    }
	}
}
</script>
