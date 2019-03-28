<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

            <el-form-item class="el-form-item-u" label="任务编号">
                <el-input v-model="listQuery.taskId" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="审批类型">
                <el-input v-model="listQuery.type" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="提交人">
                <el-input v-model="listQuery.submitter" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="提交时间">
                <el-input v-model="listQuery.submitTime" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="审批时间">
                <el-input v-model="listQuery.approvalTime" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="是否质检差错">
                <el-input v-model="listQuery.mistake" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="状态">
                <el-input v-model="listQuery.status" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row @selection-change="handleSelectionChange">

	    <el-table-column label="任务编号" width="200px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.taskId}}</span></template>
        </el-table-column>

	    <el-table-column label="审批类型" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.type}}</span></template>
        </el-table-column>

	    <el-table-column label="提交人" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.submitter}}</span></template>
        </el-table-column>

	    <el-table-column label="提交时间" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.submitTime}}</span></template>
        </el-table-column>

	    <el-table-column label="审核人" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.auditor}}</span></template>
        </el-table-column>

	    <el-table-column label="审批时间" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.approvalTime}}</span></template>
        </el-table-column>

	    <el-table-column label="审批意见" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.content}}</span></template>
        </el-table-column>

	    <el-table-column label="是否质检差错" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.mistake}}</span></template>
        </el-table-column>

	    <el-table-column label="状态" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.status}}</span></template>
        </el-table-column>

        <el-table-column label="备注" align="center">
            <template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="100" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>

        <el-table-column  align="center" label="操作" width="130px" fixed="right">
            <template slot-scope="scope">
            <el-button v-if="isShowBtnEdit" size="small" type="success" @click="toUpdate(scope.row)">编辑</el-button>
            <el-button v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" class="dailog-body-u"
    	custom-class="el-dialog-u-add-approval" :append-to-body="true" :modal-append-to-body="false">

        <div style="border-style:ridge;">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

            	<div style="display: table">
	               <el-form-item label="任务id" prop="taskId" style="float: left;width: 270px;">
	                   <el-input v-model="form.taskId" placeholder="请输入任务id"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="坐席工号" prop="agentId" style="float: left;width: 270px;">
	                   <el-input v-model="form.agentId" placeholder="请输入坐席工号"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="质检员" prop="inspector" style="float: left;width: 270px;">
	                   <el-input v-model="form.inspector" placeholder="请输入质检员"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="审批类型, 1评分审批, 2申诉审批" prop="type" style="float: left;width: 270px;">
	                   <el-input v-model="form.type" placeholder="请输入审批类型, 1评分审批, 2申诉审批"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="评分/申诉记录" prop="upstreamId" style="float: left;width: 270px;">
	                   <el-input v-model="form.upstreamId" placeholder="请输入评分/申诉记录"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="提交人" prop="submitter" style="float: left;width: 270px;">
	                   <el-input v-model="form.submitter" placeholder="请输入提交人"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="提交时间" prop="submitTime" style="float: left;width: 270px;">
	                   <el-input v-model="form.submitTime" placeholder="请输入提交时间"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="审核人" prop="auditor" style="float: left;width: 270px;">
	                   <el-input v-model="form.auditor" placeholder="请输入审核人"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="审批时间" prop="approvalTime" style="float: left;width: 270px;">
	                   <el-input v-model="form.approvalTime" placeholder="请输入审批时间"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="审批意见" prop="content" style="float: left;width: 270px;">
	                   <el-input v-model="form.content" placeholder="请输入审批意见"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="是否质检差错" prop="mistake" style="float: left;width: 270px;">
	                   <el-input v-model="form.mistake" placeholder="请输入是否质检差错"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="状态, 0待审批, 1通过, 2驳回" prop="status" style="float: left;width: 270px;">
	                   <el-input v-model="form.status" placeholder="请输入状态, 0待审批, 1通过, 2驳回"></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="租户ID" prop="tenantId" style="float: left;width: 270px;">
	                   <el-input v-model="form.tenantId" placeholder="请输入租户ID"></el-input>
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
            <el-button :loading=submitBtnLoading v-if="dialogStatus=='create'" @click="createHandler()" type="primary">确 定</el-button>
            <el-button :loading=submitBtnLoading v-else @click="updateHandler()" type="primary">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-add-approval{
  width: 600px;
}
</style>

<script>
import {page, getObj} from '@/views/quality/business/api/approval';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
  name: 'approval',
  data() {
    return {
      metadata:{
	        taskId: undefined,
	        agentId: undefined,
	        inspector: undefined,
	        type: undefined,
	        upstreamId: undefined,
	        submitter: undefined,
	        submitTime: undefined,
	        auditor: undefined,
	        approvalTime: undefined,
	        content: undefined,
	        mistake: undefined,
	        status: undefined,
	        tenantId: undefined,
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      rules: {
            taskId: creatValid(check('任务id', 2, 50)),
            agentId: creatValid(check('坐席工号', 2, 50)),
            inspector: creatValid(check('质检员', 2, 50)),
            type: creatValid(checkNumber('审批类型, 1评分审批, 2申诉审批', 2, 1000)),
            submitter: creatValid(check('提交人', 2, 50)),
            submitTime: creatValid(check('提交时间', 2, 0)),
            auditor: creatValid(check('审核人', 2, 50)),
            approvalTime: creatValid(check('审批时间', 2, 0)),
            content: creatValid(check('审批意见', 2, 500)),
            mistake: creatValid(checkNumber('是否质检差错', 2, 1000)),
            status: creatValid(checkNumber('状态, 0待审批, 1通过, 2驳回', 2, 1000)),
            tenantId: creatValid(check('租户ID', 2, 50)),
            remark: creatValid(check('', 2, 200))
      },
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        taskId: undefined,
	        agentId: undefined,
	        inspector: undefined,
	        type: undefined,
	        upstreamId: undefined,
	        submitter: undefined,
	        submitTime: undefined,
	        auditor: undefined,
	        approvalTime: undefined,
	        content: undefined,
	        mistake: undefined,
	        status: undefined,
	        tenantId: undefined,
	        remark: undefined
      },
      dialogVisible: false,
      dialogStatus: '',
      isShowBtnEdit: false,
      isShowBtnDel: false,
      isShowBtnAdd: false,
      submitBtnLoading:false,
      multipleSelection: undefined,
      textMap: {
        update: '修改',
        create: '添加'
      },
      tableKey: 0
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
    this.isShowBtnAdd = hasPermission('approval.insert');
    this.isShowBtnEdit = hasPermission('approval.update');
    this.isShowBtnDel = hasPermission('approval.delete');
  },
  computed: {
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
    handleSelectionChange(val) {
       this.multipleSelection = val;
    },
    openDialog(status){
      this.dialogStatus = status;
      this.dialogVisible = true;
    },
    closeDialog(toClear){
      this.dialogVisible = false;
      if(toClear || this.dialogStatus == 'update'){
        this.$refs['form'].resetFields();
      }
    },
    toCreate() {
        this.resetForm();
        this.openDialog('create');
    },
    toUpdate(row) {
        getObj(row.id).then(response => {
            if(response.data){
              this.form = response.data;
              this.openDialog('update');
              if(this.$refs['form'] && this.$refs['form'].validate){
                let func = (obj)=>{setTimeout(()=>{obj.validate();}, 200);};
                func(this.$refs['form']);
              }
            }else{
              this.getList();
              this.$message({message: '该记录已不存在',showClose: true,type: 'warn'});
            }
        });
    },
    deleteHandler(row) {
      this.$confirm('确认要删除该记录?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
          delObj(row.id).then((response) => {
              if(response && response.rel){
                this.$message({message: '删除成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : '删除失败',showClose: true,type: 'error'});
              }
            });
        });
    },
    createHandler() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitBtnLoading = true;
          addObj(this.form).then(response => {
              if(response && response.rel){
                this.closeDialog(true);
                this.$message({message: '新增成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : '新增失败',showClose: true,type: 'error'});
              }
              this.submitBtnLoading = false;
          });
        } else {
          return false;
        }
      });
    },
    updateHandler() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitBtnLoading = true;
          updObj(this.form).then((response) => {
            if(response && response.rel){
              this.closeDialog(true);
              this.getList();
              this.$message({message: '修改成功',showClose: true,type: 'success'});
            }else{
              this.$message({message: response.msg ? response.msg : '修改失败',showClose: true,type: 'error'});
            }
            this.submitBtnLoading = false;
          });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.form = $.extend(true, {}, this.metadata);
    }
  }
}
</script>
