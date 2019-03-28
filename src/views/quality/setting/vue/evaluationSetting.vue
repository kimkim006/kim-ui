<template>
<div class="app-container calendar-list-container">

    <div class="el-box">
      <div class="el-dialog-panel" style="width: 40%">
        <div style="margin: 3px;">
          <div class="filter-container">
            <el-button :loading='listLoading' type="primary" icon="search" style="width: 15%" @click="getList">刷新</el-button>
            <el-input placeholder="输入关键字" style="width: 83%" v-model="filterText" ></el-input>
          </div>
        </div>
        <div style="margin-top: 1px; margin-left: 3px; margin-right: 2px;">
          <el-tree :data="treeData" node-key="id" highlight-current v-loading.body="listLoading"
                   :props="defaultProps" ref="tree"
                   :default-expand-all="false"
                   :filter-node-method="filterNode" class="filter-tree"
                   :expand-on-click-node="true"
                   @node-click="currentChangeHandler"
                   style="min-height: 515px;max-height: 600px;overflow:auto;">
	        	<span class="custom-tree-node" slot-scope="{ node, data }">
	        		<span v-if="data.type == 2"><i class="icm icon-iconcreditrule node-i_page"></i></span>
	        		<span v-else><i class="icm icon-folder_icon node-i_dir"></i></span>
	        		<span class="node-i_text">{{node.label}}</span>
	        		<span class="el-tree-node-button-u">
	        			<el-button v-if="isShowBtnDel" size="mini" type="danger"
                          	@click="deleteHandler(data)">删除</el-button>
	        		</span>
	        	</span>
          </el-tree>
        </div>
      </div>
      <div style="margin-left: 8px;width: 60%;">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span class="el-card-header-text">{{editTitle}}</span>
            <div style="float: right;">
	              <el-button type="primary" v-if="isShowBtnAdd" :disabled="editStatus != 'view'" @click="toCreate">新增</el-button>
	              <el-button type="primary" v-if="isShowBtnEdit" :disabled="editStatus != 'view'" @click="toUpdate">修改</el-button>
            </div>
          </div>
          <div v-if="editContentVisible">
            <div class="el-dialog-panel" v-loading.body="detailLoading">
              	<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form-body-u">
              	
              		<div style="display: table;">
              			<el-form-item label="父节点" prop="parentId" style="float: left; width: 270px;">
		                  <el-select v-model="form.parentId" filterable clearable :disabled="editStatus != 'update'" 
		                  	@change="parentIdChangeHandler" placeholder="选择父节点">
		                      <el-option v-for="item in allEvalSets" :key="item.id" :label="item.name" :value="item.id"></el-option>
		                  </el-select>
		                </el-form-item>
		                
		                <el-form-item label="选项类型" required prop="type" style="float: left; width: 270px;">
		                    <el-radio-group v-model="form.type" :disabled="editStatus != 'create'">
		                      <el-radio v-for="item in typeArr" :key="item.value" :label="item.value" >{{item.name}}</el-radio>
		                    </el-radio-group>
		                </el-form-item>
              		</div>

					<div style="display: table;">
						<el-form-item label="名称" required prop="name" style="float: left;width: 540px;">
		                    <el-input v-model="form.name" placeholder="请输入名称" :readonly="isReadOnly"></el-input>
		                </el-form-item>
		            </div>
	                
	                <div style="display: table;">
		                <el-form-item v-if="form.type==2"label="评分类型" required prop="evalType" style="float: left; width: 270px;">
		                    <el-radio-group v-model="form.evalType" :disabled="isReadOnly" >
		                      <el-radio v-for="item in evalTypeArr" :key="item.value" :label="item.value" >{{item.name}}</el-radio>
		                    </el-radio-group>
		                </el-form-item>
		                <el-form-item v-if="form.type==2" label="分值" required prop="score" style="float: left; width: 270px;">
		                    <el-input v-model="form.score" placeholder="请输入分值" :readonly="isReadOnly" @keyup.native="number"></el-input>
		                </el-form-item>
	                </div>
              	</el-form>
            </div>
            <div slot="footer" class="dialog-footer dialog-footer-u">
              <el-button v-if="editStatus=='view'" @click="closeEditContent()">关 闭</el-button>
              <el-button v-else @click="closeEditContent()">取 消</el-button>
              <el-button :loading=submitBtnLoading v-if="editStatus=='create'" @click="createHandler()" type="primary">确 定</el-button>
              <el-button :loading=submitBtnLoading v-else-if="editStatus=='update'" @click="updateHandler()" type="primary">确 定</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

</div>
</template>

<style>
.el-dialog-u-add-evaluationSetting{
  width: 600px;
}
</style>

<script>
import {tree, listForCom, addObj, getObj, delObj, updObj} from '@/views/quality/setting/api/evaluationSetting';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
export default {
  name: 'evaluationSetting',
  data() {
    return {
      filterText: '',
      treeData: null,
      score: '',
      allEvalSets: [],
      defaultProps: {
        children: 'dirChildren',
        label: 'name'
      },
      editContentVisible:false,
      editTitle: '选择一个评分选项查看详情',
      editStatus:'view',
      detailLoading: false,
      curNodeData:{id:undefined, name:''},
      evalTypeArr:[{value:1, name:'加分'},{value:2, name:'减分'}],
      typeArr:[{value:1, name:'目录'},{value:2, name:'选项'}],

      metadata:{
	        parentId: undefined,
	        name: undefined,
	        type: 2,
	        evalType: 1,
	        score: undefined,
	        tenantId: undefined,
	        remark: undefined
      },
      form: $.extend(true, {}, this.metadata),
      rules: {
            name: creatValid(check('名称', 2, 50)),
            type: {required: true, message: '请选择评分选项类型', trigger: 'blur'},
            score: {required: true, message: '请输入分值', trigger: 'blur'},
            evalType: creatValid(checkNumber('评分类型, 加分, 减分')),
            remark: creatValid(check('', 2, 200))
      },
      list: null,
      parentId:undefined,
      pager:Pager(),
      listLoading: true,
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
      tableKey: 0
    }
  },
  watch: {
    filterText(val) {
      this.$refs['tree'].filter(val);
    },
    curRowData(data){
      this.form = data;
    }
  },
  created() {
    this.getList();
    this.initAllEvalSets(null);
    this.isShowBtnAdd = hasPermission('evaluationSetting.insert');
    this.isShowBtnEdit = hasPermission('evaluationSetting.update');
    this.isShowBtnDel = hasPermission('evaluationSetting.delete');
  },
  computed: {
    ...mapGetters(['tenantId']),
    isReadOnly() {
      return this.editStatus == 'view';
    }
  },
  methods: {
    initAllEvalSets(id){
      listForCom(id).then(response => {
        this.allEvalSets = response.data;
      });
    },
    parentIdChangeHandler(val){
      if(!val) {
        return;
      }
      for(var i = 0;i< this.allEvalSets.length;i++){
        if(this.allEvalSets[i].id == val){
          this.form.parentId = this.allEvalSets[i].id;
          break;
        }
      }
    },
    setAllEvalSets(data){
      if(this.allEvalSets){
        if(data && data.id){
          for(var i=0;i<this.allEvalSets.length;i++){
            this.allEvalSets[i].disabled = this.allEvalSets[i].id == data.id;
          }
        }else{
          for(var i=0;i<this.allEvalSets.length;i++){
            this.allEvalSets[i].disabled = false;
          }
        }
      }
    },
    getList() {
      this.listLoading = true;
      tree().then(response => {
        this.treeData = response.data;
        this.listLoading = false;
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
        if(this.form.type == 2) {
          this.$message.error({message: '具体评分下面不允许新增子类',showClose: true});
          return false;
        }
        this.setAllEvalSets();
        this.openContent('create');
    },
    toUpdate() {
      if(!this.curNodeData || !this.curNodeData.id){
        this.$message.error({message: '请先在左侧选择一个评分选项',showClose: true});
        return false;
      }
      this.initAllEvalSets(this.curNodeData.id);
      this.openContent('update', this.curNodeData.id);
    },
    deleteHandler(row) {
      this.$confirm('确认要删除该记录?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
          delObj(row.id).then((response) => {
              if(response && response.rel){
                this.$message({message: '删除成功',showClose: true,type: 'success'});
                this.getList();
                this.closeEditContent();
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
		                this.closeEditContent(true);
		                this.getList();
		                this.$message({message: '新增成功',showClose: true,type: 'success'});
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
              this.closeEditContent(true);
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
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    openContent(editStatus, id){
      this.editStatus = editStatus;
      if(this.editStatus == 'update' || this.editStatus == 'view'){
        this.detailLoading = true;
        getObj(id).then(response => {
          if(response.data){
            this.setAllEvalSets(response.data);
            this.showEditContent(response.data);
          }else{
            this.getList();
            this.$message.warning({message: '该记录已不存在',showClose: true});
          }
          this.detailLoading = false;
        });
      }else{
        this.showEditContent($.extend(true, {}, this.metadata));
      }
    },
    initCurRowData(data){
      this.form = data;
      if(this.editStatus == 'create' && this.curNodeData && this.curNodeData.id) {
        this.form.parentId = this.curNodeData.id;
      }
    },
    showEditContent(data){
      if(data && data.name){
        if(this.editStatus == 'update'){
          this.editTitle = "修改评分选项【"+data.name+'】';
        }else{
          this.editTitle = '【'+data.name+"】评分选项详情";
        }
      }else{
        this.editTitle = "添加新评分选项";
      }
      this.curRowData = data;
      this.initCurRowData(data);
      this.editContentVisible = true;
    },
    currentChangeHandler(data, node) {
      if(this.curNodeData.id == data.id ||this.editStatus == 'update' || this.editStatus =='create'){
        return;
      }
      this.curNodeData = data;
      this.openContent('view', data.id);
    },
    closeEditContent(isDone){
      if(this.editStatus == 'create' && isDone){
        this.editStatus = 'view';
        this.$refs['form'].clearValidate();
      }else if(this.editStatus == 'update'){
        this.editStatus = 'view';
        this.$refs['form'].clearValidate();
        this.openContent('view',this.curRowData.id);
      }else{
        this.hideEditContent();
      }
    },
    hideEditContent(){
      this.editTitle = '选择一个评分选项查看详情';
      this.editContentVisible = false;
      this.editStatus = 'view';
      this.form.type = '';
      this.$refs['tree'].setCurrentKey(null);
      this.curNodeData={id:undefined, name:''};
      this.curRowData = $.extend(true, {}, this.metadata);
    },
    number(){
      this.form.score = this.form.score.replace(/[^\.\d]/g,'');
      this.form.score = this.form.score.replace('.','');
      this.form.score = this.form.score == 0 ? '' : this.form.score;
    }
  }
}
</script>
