<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

			<el-form-item class="el-form-item-u" label="抽检批次号">
                <el-input v-model="listQuery.batchNo" clearable placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="状态">
              	<el-select v-model="listQuery.status" clearable filterable placeholder="选择状态" style="width: 130px;">
                	<el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
              	</el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

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

	    <el-table-column label="业务小组" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.busiGroupName}}</span></template>
        </el-table-column>

	    <el-table-column label="坐席工号" width="130px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentId}}</span></template>
        </el-table-column>

	    <el-table-column label="当前处理人" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.curProcesserName}}</span></template>
        </el-table-column>

	    <el-table-column label="申诉次数" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.appealCount}}</span></template>
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

        <el-table-column  align="center" label="操作" width="87px" fixed="right">
            <template slot-scope="scope">
            	<el-button v-if="isShowBtnDetail && (scope.row.status == 4 || scope.row.status == 8 || scope.row.status == 9)" size="small" type="success" @click="toDetail(scope.row)">申诉</el-button>
            	<el-button v-else-if="isShowBtnDetail" size="small" type="primary" @click="toDetail(scope.row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog title="录音评分详情" v-if="dialogVisible" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-cur-result" top="3vh" :center="true" :append-to-body="true" :modal-append-to-body="false">
        <main-task-detail :taskId="curRow.id" :stage="stage" :close="closeDialog" :callback="detailCallback"></main-task-detail>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-cur-result{
  width: 1000px;
}
</style>

<script>
import {listResult, listStatus} from '@/views/quality/business/api/mainTask';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
  name: 'mainTaskResult',
  components: {
      'main-task-detail': () => import('./mainTaskDetail/mainTaskDetail')
  },
  data() {
    return {
      list: [],
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        batchNo: undefined,
	        status: undefined
      },
      dialogVisible: false,
      isShowBtnDetail: false,
      isShowBtnToAppeal: false,
      submitBtnLoading:false,
      tableKey: 0,
      stage: "APPEAL",
      statusArr:[],
      curRow:{}
    }
  },
  created() {
  	this.init();
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnDetail = hasPermission('curResult.detail');
    this.isShowBtnToAppeal = hasPermission('curResult.toAppeal');
  },
  computed: {
  	...mapGetters(['tenantId']),
  },
  methods: {
  	init(){
  		//stage=1申诉阶段的状态
  		listStatus(this.stage).then(response => {
  			this.statusArr = response.data;
  		});
  	},
    getList() {
      this.listLoading = true;
      $.extend(this.listQuery, this.pager.getPage());
      listResult(this.listQuery).then(response => {
        this.list = response.data.list;
        this.pager.render(response.data.totalSize);
        this.listLoading = false;
      })
    },
    openDialog(){
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    detailCallback(){
    	this.getList();
    },
    toDetail(row) {
    	this.curRow = row;
        this.openDialog();
    }
  }
}
</script>