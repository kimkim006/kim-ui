<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

	    	<el-form-item class="el-form-item-u" label="通知单编号">
                <el-input v-model="listQuery.recordNo" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	    	<el-form-item class="el-form-item-u" label="名称">
                <el-input v-model="listQuery.name" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	    	<el-form-item class="el-form-item-u" label="主题">
                <el-input v-model="listQuery.subject" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	    	<el-form-item class="el-form-item-u" label="类型 ">
                <el-input v-model="listQuery.type" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	    	<el-form-item class="el-form-item-u" label="状态">
                <el-input v-model="listQuery.status" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	    	<el-form-item class="el-form-item-u" label="提交人">
                <el-input v-model="listQuery.submitter" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
	    	<el-form-item class="el-form-item-u" label="提交时间">
		    	<el-date-picker type="datetime"  v-model="listQuery.submitTimeStart" placeholder="开始时间" @keyup.enter.native="getList" class="filter-item"
	              	:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 110px;"></el-date-picker>
	                -
	            <el-date-picker  type="datetime" v-model="listQuery.submitTimeEnd" placeholder="结束时间" @keyup.enter.native="getList" class="filter-item"
	          		:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 110px;"></el-date-picker>
	    	</el-form-item>
	    	<el-form-item class="el-form-item-u" label="处理时间">
		    	<el-date-picker type="datetime"  v-model="listQuery.processTimeStart" placeholder="开始时间" @keyup.enter.native="getList" class="filter-item"
	              	:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 110px;"></el-date-picker>
	                -
	            <el-date-picker  type="datetime" v-model="listQuery.processTimeEnd" placeholder="结束时间" @keyup.enter.native="getList" class="filter-item"
	          		:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 110px;"></el-date-picker>
	    	</el-form-item>
	    	<el-form-item class="el-form-item-u" label="任务编号">
                <el-input v-model="listQuery.taskId" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

	    <el-table-column label="通知单编号" width="150px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.recordNo}}</span></template>
        </el-table-column>

	    <el-table-column label="名称" width="250px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>

	    <el-table-column label="主题" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.subject}}</span></template>
        </el-table-column>

	    <el-table-column label="类型 " width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.type}}</span></template>
        </el-table-column>

	    <el-table-column label="状态" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.status}}</span></template>
        </el-table-column>

	    <el-table-column label="提交人" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.submitter}}</span></template>
        </el-table-column>

	    <el-table-column label="提交人姓名" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.submitterName}}</span></template>
        </el-table-column>

	    <el-table-column label="提交时间" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.submitTime}}</span></template>
        </el-table-column>

	    <el-table-column label="处理人" width="170px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.processer}}</span></template>
        </el-table-column>

	    <el-table-column label="处理人姓名" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.processerName}}</span></template>
        </el-table-column>

	    <el-table-column label="处理时间" width="170px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.processTime}}</span></template>
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
            	<el-button size="small" type="success" @click="toShow(scope.row)">查看</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog title="查看通知信息" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-add-notice">

        <div class="el-dialog-panel">
            <el-form ref="form" label-width="80px" class="form-body-u">

            	<div style="display: table">
	               <el-form-item label="通知单编号" prop="recordNo" style="float: left;width: 270px;">
	                   <el-input v-model="form.recordNo" placeholder="请输入通知单编号"></el-input>
	               </el-form-item>
	               <el-form-item label="主题" prop="subject" style="float: left;width: 270px;">
	                   <el-input v-model="form.subject" placeholder="请输入主题"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="名称" prop="name" style="float: left;width: 540px;">
	                   <el-input v-model="form.name" placeholder="请输入名称"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="类型  1评分 2审核 3查看 4其他" prop="type" style="float: left;width: 270px;">
	                   <el-input v-model="form.type" placeholder="请输入类型  1评分 2审核 3查看 4其他"></el-input>
	               </el-form-item>
	               <el-form-item label="状态  0草稿  1待处理  2已阅读  3已处理  4已撤回  5废弃" prop="status" style="float: left;width: 270px;">
	                   <el-input v-model="form.status" placeholder="请输入状态  0草稿  1待处理  2已阅读  3已处理  4已撤回  5废弃"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="提交人" prop="submitter" style="float: left;width: 270px;">
	                   <el-input v-model="form.submitter" placeholder="请输入提交人"></el-input>
	               </el-form-item>
	               <el-form-item label="提交人姓名" prop="submitterName" style="float: left;width: 270px;">
	                   <el-input v-model="form.submitterName" placeholder="请输入提交人姓名"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="提交时间" prop="submitTime" style="float: left;width: 270px;">
	                   <el-input v-model="form.submitTime" placeholder="请输入提交时间"></el-input>
	               </el-form-item>
	               <el-form-item label="处理时间" prop="processTime" style="float: left;width: 270px;">
	                   <el-input v-model="form.processTime" placeholder="请输入处理时间"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="处理人" prop="processer" style="float: left;width: 270px;">
	                   <el-input v-model="form.processer" placeholder="请输入处理人"></el-input>
	               </el-form-item>
	               <el-form-item label="处理人姓名" prop="processerName" style="float: left;width: 270px;">
	                   <el-input v-model="form.processerName" placeholder="请输入处理人姓名"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="任务编号" prop="taskId" style="float: left;width: 270px;">
	                   <el-input v-model="form.taskId" placeholder="请输入任务编号"></el-input>
	               </el-form-item>
	               <el-form-item label="数据id" prop="dataId" style="float: left;width: 270px;">
	                   <el-input v-model="form.dataId" placeholder="请输入数据id"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="动作类型" prop="actionType" style="float: left;width: 270px;">
	                   <el-input v-model="form.actionType" placeholder="请输入动作类型"></el-input>
	               </el-form-item>
	               <el-form-item label="动作参数" prop="actionParam" style="float: left;width: 270px;">
	                   <el-input v-model="form.actionParam" placeholder="请输入动作参数"></el-input>
	               </el-form-item>
            	</div>
                <div style="display: table;">
	                <el-form-item label="备注" prop="remark" style="float: left;width: 540px;">
	                    <el-input type="textarea" v-model="form.remark" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容"></el-input>
	                </el-form-item>
                </div>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog(false)">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-add-notice{
  width: 600px;
}
</style>

<script>
import {myPage, getObj, delObj} from '@/views/notify/api/notice';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
export default {
  	name: 'notice',
  	data() {
    	return {
      		metadata:{
	        	recordNo: undefined,
	        	name: undefined,
	        	subject: undefined,
	        	type: undefined,
	        	status: undefined,
	        	submitter: undefined,
	        	submitterName: undefined,
	        	submitTime: undefined,
	        	processer: undefined,
	        	processerName: undefined,
	        	processTime: undefined,
	        	taskId: undefined,
	        	dataId: undefined,
	        	actionType: undefined,
	        	actionParam: undefined,
	        	tenantId: undefined,
	        	remark: undefined
      		},
      		form: $.extend(true, {}, this.metadata),
      		list: null,
      		pager:Pager(),
      		listLoading: true,
      		listQuery: {
	        	name: undefined,
	        	subject: undefined,
	        	type: undefined,
	        	status: undefined,
	        	submitter: undefined,
	        	submitTimeStart: undefined,
	        	submitTimeEnd: undefined,
	        	processer: undefined,
	        	processTimeStart: undefined,
	        	processTimeEnd: undefined,
	        	taskId: undefined,
	        	actionType: undefined
      		},
      		dialogVisible: false,
      		tableKey: 0
    	}
  	},
  	created() {
    	this.pager.init(this.getList);
    	this.getList();
  	},
  	computed: {
  		...mapGetters(['tenantId']),
  	},
 	methods: {
    	getList() {
      		this.listLoading = true;
      		$.extend(this.listQuery, this.pager.getPage());
      		myPage(this.listQuery).then(response => {
	        	this.list = response.data.list;
	       		this.pager.render(response.data.totalSize);
	        	this.listLoading = false;
	      	})
    	},
	    openDialog(){
	      	this.dialogVisible = true;
	    },
	    closeDialog(toClear){
	      	this.dialogVisible = false;
        	this.$refs['form'].resetFields();
	    },
	    toShow(row) {
	        getObj(row.id).then(response => {
	            if(response.data){
	              	this.form = response.data;
	              	this.openDialog();
	            }else{
	              	this.getList();
	              	this.$message.warn({message: '该记录已不存在',showClose: true});
	            }
	        });
	    },
	    resetForm() {
	      	this.form = $.extend(true, {}, this.metadata);
	    }
  	}
}
</script>