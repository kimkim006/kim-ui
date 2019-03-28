<template>
  <div>
    <div class="el-dialog-panel">
      <div style="margin: 3px; ">
        <el-input placeholder="输入关键字" v-model="filterText"></el-input>
      </div>
      <div class="el-dialog-panel">
        <el-tree :data="treeData" node-key="id" highlight-current v-loading.body="listLoading"
                 :props="defaultProps" ref="tree" show-checkbox
                 :default-expand-all="false" :default-checked-keys=checkedKeys
                 @check-change="checkChangeHandler" :check-strictly="false"
                 :filter-node-method="filterNode" class="filter-tree"
                 :default-expanded-keys="openKeys"
                 style="height: 300px;overflow:auto;">
        		<span class="custom-tree-node" slot-scope="{ node, data }">
	        		<span v-if="data.type == 2"><i class="icm icon-iconcreditrule node-i_page"></i></span>
	        		<span v-else><i class="icm icon-folder_icon node-i_dir"></i></span>
	        		<span class="node-i_text">{{node.label}}</span>
	        	</span>
        </el-tree>
      </div>
    </div>
    <div slot="footer" class="dialog-footer dialog-footer-u">
      <el-button @click="closeDialog()">取 消</el-button>
      <el-button :loading=submitBtnLoading @click="addEvaluationHandler()" type="primary">确 定</el-button>
      <span v-if="selectedDataCount > 0">已选{{selectedDataCount}}个评分项</span>
      <span v-else>未选择</span>
    </div>
  </div>
</template>
<script>
  import {tree, listForCom} from '@/views/quality/setting/api/evaluationSetting';
  import {subtraction} from '@/utils/arrayUtil';
  import $ from 'jquery';

  export default {
    name: 'evaluationTree',
    props: {
      username: undefined,
      checkedKeys:{
        type:Array,
        default:[]
      },
      close: {
        type: Function,
        default: () => {
        }
      },
      callback: {
        type: Function,
        default: () => {
        }
      }
    },
    data() {
      return {
        filterText: '',
        treeData: null,
        // checkedKeys: [],
        selfOwnedKeys: [],
        defaultProps: {
          children: 'dirChildren',
          label: 'name',
          disabled: 'disabled'
        },
        listLoading: true,
        openKeys: [],
        submitBtnLoading: false,
        selectedData: [],
        selectedDataCount: 0
      };
    },
    watch: {
      filterText(val) {
        this.$refs['tree'].filter(val);
      }
    },
    created() {
      	this.getList();
    },
    methods: {
	      getList() {
		        this.listLoading = true;
		        tree().then((response) => {
			          if (response && response.rel && response.data) {
			            	this.treeData = response.data;
			            	this.calcDisabledNode();
			            	this.checkChangeHandler();
			          } else {
			            	this.$message({message: '评分项加载失败', showClose: true, type: 'error'});
			          }
			          this.listLoading = false;
		        });
	      },
	      calcDisabledNode(){
	      		if(this.checkedKeys && this.checkedKeys.length 
	      				&& this.treeData && this.treeData.length){
	      				this.treeData.forEach(item => {
	      						this.calc(item);
	      				});
	      		}
	      },
	      calc(item){
	      		if(item.type == 2 && this.checkedKeys.indexOf(item.id) > -1){
	      				item.disabled = true;
	      				return ;
	      		}
	      		if(item.dirChildren && item.dirChildren.length){
	      				item.dirChildren.forEach(it => {
	      						this.calc(it);
	      				});
	      		}
	      },
	      filterNode(value, data) {
	        if (!value) return true;
	        return data.name.indexOf(value) !== -1;
	      },
	      closeDialog() {
	        this.close();
	      },
	      checkChangeHandler() {
		      	let data = this.$refs.tree.getCheckedNodes(true);
		        if(data && data.length){
			        	this.selectedData = [];
			        	data.forEach((item)=>{
			        			if(item.type == 2 && this.checkedKeys.indexOf(item.id)<0){
			        					this.selectedData.push(item);
			        			}
			        	});
		        }
		        this.selectedDataCount = this.selectedData.length;
	      },
	      addEvaluationHandler() {
	        if(this.selectedData && this.selectedData.length && this.callback){
	          	this.callback(this.selectedData);
	        }
	        this.closeDialog();
	      }
    }
  }
</script>
