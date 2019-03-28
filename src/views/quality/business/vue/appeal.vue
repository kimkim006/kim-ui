<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="任务编号">
                <el-input v-model="listQuery.taskId" placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="质检员">
                <el-input v-model="listQuery.inspector" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="申诉人">
                <el-input v-model="listQuery.appealer" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
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

	    <el-table-column label="任务编号" width="280px" align="center" :show-overflow-tooltip='true'>
            <template slot-scope="scope"><span>{{scope.row.taskId}}</span></template>
        </el-table-column>
        
        <el-table-column label="质检员" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.inspector}}</span></template>
        </el-table-column>

	    <el-table-column label="申诉人" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.appealer}}</span></template>
        </el-table-column>
        
	    <el-table-column label="申诉时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.appealTime}}</span></template>
        </el-table-column>

	    <el-table-column label="申诉原因" width="200px" align="center" :show-overflow-tooltip='true'>
            <template slot-scope="scope"><span>{{scope.row.content}}</span></template>
        </el-table-column>

	    <el-table-column label="状态" width="100px" align="center" >
            <template slot-scope="scope"><span>{{statusMapping[scope.row.status]}}</span></template>
        </el-table-column>

        <el-table-column label="备注" align="center" :show-overflow-tooltip='true'>
            <template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>

        <el-table-column  align="center" label="操作" width="87px" fixed="right">
            <template slot-scope="scope">
            <el-button v-if="isShowBtnDetail" size="small" type="primary" @click="toDetail(scope.row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

	<el-dialog title="申诉详情" v-if="dialogVisible" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-appeal-detail" top="3vh" :center="true" :append-to-body="true" :modal-append-to-body="false">
        <main-task-detail :taskId="curRow.taskId" :stage="'view'" :itemStatus="'view'" :close="closeDialog" ></main-task-detail>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-appeal-detail{
  width: 1000px;
}
</style>

<script>
import {page} from '@/views/quality/business/api/appeal';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
import {getMapFromArr} from '@/utils/arrayUtil';
export default {
  name: 'appeal',
  components: {
      'main-task-detail': () => import('./mainTaskDetail/mainTaskDetail')
  },
  data() {
    return {
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        taskId: undefined,
	        appealer: undefined,
	        status: undefined
      },
      dialogVisible: false,
      isShowBtnDetail: false,
      tableKey: 0,
      curRow: {},
      statusArr:[
      	{value: 0, name:'待审批'},
      	{value: 1, name:'处理中'},
      	{value: 2, name:'已通过'},
      	{value: 3, name:'已驳回'}
      ]
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnDetail = hasPermission('appeal.detail');
  },
  computed: {
  	...mapGetters(['tenantId']),
  	statusMapping(){
  		return getMapFromArr(this.statusArr);
  	}
  },
  methods: {
    getList() {
      this.listLoading = true;
      $.extend(this.listQuery, this.pager.getPage());
      page(this.listQuery).then(response => {
        this.list = response.data.list;
        this.pager.render(response.data.totalSize);
        this.listLoading = false;
      })
    },
    openDialog(status){
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    toDetail(row) {
    	this.curRow = row;
        this.openDialog();
    }
    
  }
}
</script>