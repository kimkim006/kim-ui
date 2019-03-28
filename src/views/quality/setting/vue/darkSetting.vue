<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">
			
			<el-form-item class="el-form-item-u" label="业务小组">
				<el-select v-model="listQuery.busiGroup" placeholder="选择业务小组" clearable @keyup.enter.native="getList" style="width: 150px;" class="filter-item">
                  <el-option v-for="item in groupArr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
			</el-form-item>
            <el-form-item class="el-form-item-u" label="工号">
                <el-input v-model="listQuery.username" placeholder="输入关键字" clearable style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="是否启用">
                <el-select v-model="listQuery.active" placeholder="选择" clearable @keyup.enter.native="getList" style="width: 100px;" class="filter-item">
                  <el-option v-for="item in activeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
                <el-button class="filter-item"  v-if="isShowBtnAdd" @click="toCreate" type="primary" icon="edit">添加</el-button>
                <el-button v-if="isShowBtnDel" size="small" type="success" @click="activeHandler(1)">启用</el-button>
                <el-button v-if="isShowBtnDel" size="small" type="danger" @click="activeHandler(0)">停用</el-button>
                <el-button v-if="isShowBtnDel" size="small" type="danger" @click="deleteHandler()">删除</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @row-click="clickRow" 
    	border fit highlight-current-row ref="resTable" @selection-change="selectionChangeHandler">
    	
		<el-table-column type="selection" width="47" fixed="left"></el-table-column>
	    <el-table-column label="工号" width="150px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
        </el-table-column>
        
        <el-table-column label="姓名" width="150px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>
        
	    <el-table-column label="业务小组" width="150px" align="center">
            <template slot-scope="scope"><span>{{scope.row.groupName}}</span></template>
        </el-table-column>

	    <el-table-column label="开始时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.startTime}}</span></template>
        </el-table-column>

	    <el-table-column label="结束时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.endTime}}</span></template>
        </el-table-column>

	    <el-table-column label="是否启用" width="100px" align="center" >
            <template slot-scope="scope"><span>{{activeMapping[scope.row.active]}}</span></template>
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
            <el-button v-if="isShowBtnEdit" size="small" type="success" @click="toUpdate(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" class="dailog-body-u" top="7vh"
    	custom-class="el-dialog-u-add-darkSetting" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-body-u">

            	<div style="display: table;">
	               <el-form-item label="开始时间" prop="startTime" required style="float: left;width: 270px;">
	                   <el-date-picker  type="date"  v-model="form.startTime" placeholder="开始时间"
              			value-format="yyyy-MM-dd"></el-date-picker>
	               </el-form-item>
	               <el-form-item label="结束时间" prop="endTime" required style="float: left;width: 270px;">
	                   <el-date-picker  type="date"  v-model="form.endTime" placeholder="结束时间"
              			value-format="yyyy-MM-dd"></el-date-picker>
	               </el-form-item>
            	</div>
                <div style="display: table;">
	                <el-form-item label="备注" prop="remark" style="float: left;width: 540px;">
	                    <el-input type="textarea" v-model="form.remark" :autosize="{minRows: 1, maxRows: 5}" placeholder="请输入内容"></el-input>
	                </el-form-item>
                </div>
                
                <div v-if="dialogStatus == 'create'" style="display: table;">
                	<fieldset class="el-dialog-panel" style="margin-left: 10px;margin-bottom: 6px;">
                		<legend>
                			<span>坐席</span>
                		</legend>
                		<el-form :inline="true" :model="dgListQuery" class="form-body-u" style="margin-top:0px;">
                			<el-form-item class="el-form-item-u">
	                			<el-select v-model="dgListQuery.groupCode" placeholder="选择业务小组">
				                  <el-option v-for="item in groupArr" :key="item.code" :label="item.name" :value="item.code"></el-option>
				                </el-select>
			                </el-form-item>
			                <el-form-item class="el-form-item-u" style="width: 120px;">
			                	<el-input v-model="dgListQuery.username" placeholder="输入关键字"></el-input>
			                </el-form-item>
			                <el-form-item class="el-form-item-u">
			                	<el-button class="filter-item" type="primary" v-waves icon="search" @click="dgGetList">查询</el-button>
			                	<span style="color: blue;">{{selectedMsg}}</span>
			                </el-form-item>
                		</el-form>
                		<el-table :key='1' ref="dgTable" @row-click="dgClickRow" :data="dgList" @selection-change="dgSelectionChangeHandler"
                			v-loading.body="dgListLoading" border fit highlight-current-row style="width: 515px;" max-height="240">
    	
							<el-table-column type="selection" width="45" ></el-table-column>
						    <el-table-column label="工号" width="180px" align="center">
					            <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
					        </el-table-column>
					        
					        <el-table-column label="姓名" align="center">
					            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
					        </el-table-column>
					        
					    </el-table>
					    <div v-show="!dgListLoading" class="pagination-container">
					        <el-pagination :current-page.sync="dgPager.curPage" :page-size="dgPager.pageSize" :total="dgPager.totalSize" :layout="dgPager.layout" :page-sizes="dgPager.sizes" @size-change="function(val){dgPager.sizeChangeHandler(val)}" @current-change="dgPager.currentChangeHandler()" ></el-pagination>
					    </div>
                	</fieldset>
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
.el-dialog-u-add-darkSetting{
  width: 600px;
}
</style>

<script>
import {page, addObj, getObj, delObj, updObj, activeObj} from '@/views/quality/setting/api/darkSetting';
import {listBsGroup} from '@/views/admin/api/group';
import {pageByGroup} from '@/views/admin/api/user';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
import {getMapFromArr} from '@/utils/arrayUtil';
export default {
  name: 'darkSetting',
  data() {
    return {
      metadata:{
	        username: undefined,
	        startTime: undefined,
	        endTime: undefined,
	        active: undefined,
	        remark: undefined,
	        username: []
      },
      form: $.extend(true, {}, this.metadata),
      rules: {
            startTime: [{required: true, message: '请选择开始时间',trigger: 'blur'}],
            endTime: [{required: true, message: '请选择结束时间',trigger: 'blur'}],
            remark: creatValid(check('', 2, 200))
      },
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
	        username: undefined,
	        busiGroup: undefined,
	        active: undefined,
	        remark: undefined
      },
      dialogVisible: false,
      dialogStatus: '',
      isShowBtnEdit: false,
      isShowBtnDel: false,
      isShowBtnAdd: false,
      submitBtnLoading:false,
      textMap: {
        update: '修改',
        create: '添加'
      },
      tableKey: 0,
      selected:[],
      groupArr: [],
      activeArr:[{value:1, name:'启用'}, {value:0, name:'停用'}],
      dgListQuery:{
      	groupCode:undefined,
      	username:undefined
      },
      dgList:[],
      dgPager:Pager(),
      dgListLoading:false,
      selectedMsg:''
    }
  },
  created() {
    this.pager.init(this.getList);
    this.dgPager.init(this.dgGetList);
    this.getList();
    this.isShowBtnAdd = hasPermission('darkSetting.insert');
    this.isShowBtnEdit = hasPermission('darkSetting.update');
    this.isShowBtnDel = hasPermission('darkSetting.delete');
    this.init();
  },
  computed: {
  	...mapGetters(['tenantId']),
  	activeMapping(){
  		return getMapFromArr(this.activeArr);
  	}
  },
  methods: {
  	init(){
  		listBsGroup().then(response => {
	        this.groupArr = response.data;
	    });
  	},
    getList() {
      this.listLoading = true;
      $.extend(this.listQuery, this.pager.getPage());
      page(this.listQuery).then(response => {
        this.list = response.data.list;
        this.pager.render(response.data.totalSize);
        this.listLoading = false;
      });
    },
    dgGetList(){
    	this.dgListLoading = true;
	    $.extend(this.dgListQuery, this.dgPager.getPage());
	    pageByGroup(this.dgListQuery).then(response => {
	        this.dgList = response.data.list;
	        this.dgPager.render(response.data.totalSize);
	        this.dgListLoading = false;
	    });
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
        if(this.groupArr && this.groupArr.length){
        	this.dgListQuery.groupCode = this.groupArr[0].code;
        	this.dgList = [];
        }
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
    deleteHandler() {
    	if(!this.selected || !this.selected.length){
    		this.$message({message: '请选择记录',showClose: true,type: 'warn'});
    		return ;
    	}
      this.$confirm('确认要删除该记录?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
      	let ids = [];
      	this.selected.forEach(item=>{
      		ids.push(item.id);
      	});
          delObj(ids.join()).then((response) => {
              if(response && response.rel){
                this.$message({message: '删除成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : '删除失败',showClose: true,type: 'error'});
              }
            });
        }).catch(()=>{});
    },
    activeHandler(active) {
    	if(!this.selected || !this.selected.length){
    		this.$message({message: '请选择记录',showClose: true,type: 'warn'});
    		return ;
    	}
    	let activeTip = active?'启用':'停用';
      	this.$confirm('确认要'+activeTip+'该记录?', '提示', {
        	confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      	}).then(() => {
      		let ids = [];
	      	this.selected.forEach(item=>{
	      		ids.push(item.id);
	      	});
          	activeObj(ids.join(), active).then((response) => {
              if(response && response.rel){
                this.$message({message: activeTip+'成功',showClose: true,type: 'success'});
                this.getList();
              }else{
                this.$message({message: response.msg ? response.msg : activeTip+'失败',showClose: true,type: 'error'});
              }
            });
        }).catch(()=>{});
    },
    createHandler() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if(!this.form.username || !this.form.username.length){
          		this.$message({message: '请选择坐席',showClose: true,type: 'warn'});
          		return ;
          }
          this.submitBtnLoading = true;
          let unameArr = [];
          this.form.username.forEach((item)=>{
          	unameArr.push(item.username);
          });
          this.form.username = unameArr.join();
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
    },
    dgSelectionChangeHandler(val) {
        this.form.username = val;
        this.selectedMsg = val && val.length > 0 ? '已选择' + val.length + '个人员' : '未选择';
    },
    dgClickRow(row, event, column) {
	    this.$refs['dgTable'].toggleRowSelection(row, this.form.username.indexOf(row)<0);
    },
    selectionChangeHandler(val) {
        this.selected = val;
    },
    clickRow(row, event, column) {
	    this.$refs['resTable'].toggleRowSelection(row, this.selected.indexOf(row)<0);
    }
  }
}
</script>