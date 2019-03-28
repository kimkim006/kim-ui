<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="日期">
                <el-date-picker v-model="listQuery.timeDate" type="date" placeholder="选择日期" 
                	value-format="yyyy-MM-dd" @keyup.enter.native="getList" class="filter-item"></el-date-picker>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="呼叫类型">
                <el-select v-model="listQuery.type" clearable placeholder="选择呼叫类型" style="width: 100px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="状态">
                <el-select v-model="listQuery.status" clearable placeholder="选择状态" style="width: 100px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

	    <el-table-column label="日期" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.timeDate}}</span></template>
        </el-table-column>
        
        <el-table-column label="呼叫类型" width="100px" align="center">
            <template slot-scope="scope"><span>{{typeMapping[scope.row.type]}}</span></template>
        </el-table-column>

	    <el-table-column label="开始时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.startTime}}</span></template>
        </el-table-column>

	    <el-table-column label="结束时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.endTime}}</span></template>
        </el-table-column>

	    <el-table-column label="数据量" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.totalCount}}</span></template>
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

        <el-table-column  align="center" label="操作" width="100px" fixed="right">
            <template slot-scope="scope">
            <el-button size="small" type="primary" @click="toShow(scope.row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="'查看详情'" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-add-tapeSync" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" ref="form" label-width="80px" class="form-body-u">

            	<div style="display: table">
	               <el-form-item label="日期" prop="timeDate" style="float: left;width: 230px;">
	                   <el-input v-model="form.timeDate" readonly></el-input>
	               </el-form-item>
	               <el-form-item label="呼叫类型" prop="type" style="float: left;width: 230px;">
	                   <el-input v-model="typeMapping[form.type]" readonly></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="开始时间" prop="startTime" style="float: left;width: 230px;">
	                   <el-input v-model="form.startTime" readonly></el-input>
	               </el-form-item>
	               <el-form-item label="结束时间" prop="endTime" style="float: left;width: 230px;">
	                   <el-input v-model="form.endTime" readonly></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="状态" prop="status" style="float: left;width: 230px;">
	                   <el-input v-model="statusMapping[form.status]" readonly></el-input>
	               </el-form-item>
	               <el-form-item label="数据量" prop="totalCount" style="float: left;width: 230px;">
	                   <el-input v-model="form.totalCount" readonly></el-input>
	               </el-form-item>
            	</div>
                <div style="display: table;">
	                <el-form-item label="备注" prop="remark" style="float: left;width: 460px;">
	                    <el-input type="textarea" v-model="form.remark" readonly :autosize="{minRows: 3, maxRows: 6}" ></el-input>
	                </el-form-item>
                </div>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog()">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-add-tapeSync{
  width: 540px;
}
</style>

<script>
import {page, getObj} from '@/views/quality/business/api/tapeSync';
import $ from 'jquery';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
import {getMapFromArr} from '@/utils/arrayUtil';
import {getDurationDateStr} from '@/utils/dateUtil';
export default {
  name: 'tapeSync',
  data() {
    return {
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        timeDate: getDurationDateStr(-1),
	        type: undefined,
	        status: undefined
      },
      form:{},
      dialogVisible: false,
      submitBtnLoading:false, 
      statusArr:[
      	{value:0, name:'成功'},
      	{value:1, name:'正在同步'},
      	{value:2, name:'失败'},
      	{value:3, name:'异常中断'}
      ],
      types:[{value:1, name:'呼入'},{value:2, name:'呼出'}],
      tableKey: 0
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
  },
  computed: {
  	...mapGetters(['tenantId']),
  	statusMapping() {
      return getMapFromArr(this.statusArr);
    },
    typeMapping(){
		return getMapFromArr(this.types);
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
    openDialog(){
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    toShow(row) {
    	this.form = row;
    	this.openDialog();
    }
  }
}
</script>