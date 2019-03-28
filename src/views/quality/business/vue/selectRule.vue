<template>
	<div>
	  <div class="el-dialog-panel" style="width: 100%;">
	      <div style="margin: 3px; ">
	        <div class="filter-container">
	          <el-button :loading='listLoading' type="primary" icon="search" style="width: 15%" @click="getList">刷新</el-button>
	          <el-input placeholder="输入关键字" style="width: 83%" v-model="filterText" ></el-input>
	        </div>
	
	      </div>
	      <div style="margin-top: 1px; margin-left: 3px; margin-right: 2px;">
	        <el-tree :data="treeData" node-key="digest" highlight-current show-checkbox 
	                 :props="defaultProps" ref="tree" :accordion="false" v-loading.body="listLoading"
	                 :default-expand-all="true" :check-strictly="true" :check-on-click-node="true"
	                 :filter-node-method="filterNode" class="filter-tree"
	                 @check="handleCheck" style="min-height: 300px;max-height: 420px;overflow: auto;">
	        	<span class="custom-tree-node" slot-scope="{ node, data }">
	        		<span v-if="data.type == 4">
	        			<i v-if="data.active" class="icm icon-iconcreditrule node-i_page" ></i>
	        			<i v-else class="icm icon-iconcreditrule node-i_page_unactive"></i>
	        		</span>
	        		<span v-else><i class="icm icon-folder_icon node-i_dir"></i></span>
	        		<span class="node-i_text">{{node.label}}</span>
	        	</span>
	        </el-tree>
	      </div>
	  </div>
	
	  <div slot="footer" class="dialog-footer dialog-footer-u">
	    <el-button @click="closeDialog()">取 消</el-button>
	    <el-button @click="ok()" type="primary">确定</el-button>
	  </div>
	</div>
</template>

<script>
import {ruleRree} from '@/views/quality/business/api/sample';
import $ from 'jquery';
export default {
  name: 'selectRule',
  props: {
    ruleId:'',
    callback:{
      type:Function,
      default:()=>{}
    },
    close:{
      type:Function,
      default:()=>{}
    },
    initFunc:{
      type:Function,
      default: ruleRree
    }
  },
  data() {
    return {
      filterText: '',
      curNodeDataId: '',
      curNodeDataName: '',
      treeData: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      listLoading:false
    }
  },
  watch: {
    filterText(val) {
      this.$refs['tree'].filter(val);
    },
    ruleId: function(oldVal, newVal){
  		if(oldVal){
  			this.getList();
  		}
  	}
  },
  created() {
    this.getList();
  },
  methods: {
  	getList() {
      this.listLoading = true;
      this.initFunc({active:1}).then(response => {
        this.treeData = response.data;
        this.$refs.tree.setCheckedKeys([]);
        if(this.ruleId){
        	this.$refs.tree.setCheckedKeys([this.ruleId]);
    		  this.curNodeDataId = this.ruleId;
        }
        this.listLoading = false;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleCheck(data,checked, node) {
	    if(checked){//交叉点击节点
	    	if(data.type != 4){//4具体的质检规则 
	    		var arr = this.$refs.tree.getCheckedNodes();
	    		var cks = [];
	    		arr.forEach((item, index)=>{
	    			if(data.type != item.type || data.id != item.id){
	    				cks.push(item);
	    			}
	    		});
	    		this.$refs.tree.setCheckedNodes([]);
	    		this.$refs.tree.setCheckedNodes(cks);
	    		return ;
	    	}
	        this.$refs.tree.setCheckedNodes([]);
	        this.$refs.tree.setCheckedNodes([data]);
	        
	        this.curNodeDataId = data.id;
	        this.curNodeDataName = data.name;
	    }else{//点击已经选中的节点，置空
	        this.$refs.tree.setCheckedNodes([]);
	        
	        if(this.curNodeDataId == data.id){
		    	this.curNodeDataId = '';
		      	this.curNodeDataName = '';
		    }
	    }
    },
    closeDialog(){
      this.close();
    },
    ok(){
    	if(this.callback){
    		this.callback({
    			ruleId: this.curNodeDataId,
    			ruleName: this.curNodeDataName
    		});
    	}
      this.closeDialog();
    }
  }
}
</script>
