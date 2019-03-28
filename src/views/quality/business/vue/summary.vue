<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="父编码">
                <el-input v-model="listQuery.parentCode" placeholder="输入关键字" clearable style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="编码">
                <el-input v-model="listQuery.code" placeholder="输入关键字" clearable style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="层级">
                <el-input-number v-model="listQuery.level" clearable :min='0' :max='4' style="width: 100px;" @keyup.enter.native="getList" class="filter-item"> </el-input-number>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="来源">
                <el-select v-model="listQuery.source" clearable placeholder="选择来源" style="width: 120px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in sourceArr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

	    <el-table-column label="父编码" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.parentCode}}</span></template>
        </el-table-column>

	    <el-table-column label="编码" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.code}}</span></template>
        </el-table-column>

	    <el-table-column label="名称" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>

	    <el-table-column label="原始父编码" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.originParentCode}}</span></template>
        </el-table-column>

	    <el-table-column label="原始编码" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.originCode}}</span></template>
        </el-table-column>

	    <el-table-column label="层级" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.level}}</span></template>
        </el-table-column>
        
        <el-table-column label="来源" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.source}}</span></template>
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

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

</div>
</template>

<style>
</style>

<script>
import {page, getObj, listSource} from '@/views/quality/business/api/summary';
import $ from 'jquery';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
export default {
  name: 'summary1',
  data() {
    return {
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        parentCode: undefined,
	        code: undefined,
	        source: undefined,
	        level: undefined
      },
      dialogVisible: false,
      submitBtnLoading:false,
      tableKey: 0,
      sourceArr:[]
    }
  },
  created() {
  	this.init();
    this.pager.init(this.getList);
    this.getList();
  },
  computed: {
  	...mapGetters(['tenantId']),
  },
  methods: {
  	init(){
  		listSource().then(response => {
	        this.sourceArr = response.data;
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
    }
  }
}
</script>