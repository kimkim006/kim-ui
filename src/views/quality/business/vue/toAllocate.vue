<template>
	<div>
	  	<div class="el-dialog-panel">
	  		<div class="filter-container">
  				<el-tag type="primary" style="margin: 10px; text-align: center;">
	  				<span>已选择【</span>
		  			<span style="color: red;">{{batchNum}}</span>
		  			<span>】个批次, 共计任务数【</span>
		  			<span style="color: red;">{{taskNum}}</span><span> 】个</span>
	  			</el-tag>
	  			<div style="margin-left: 10px;">
	  				<span>质检小组</span>
	  				<el-select v-model="listQuery.groupCode" :loading="listLoading" placeholder="选择质检小组"  
						@change="getList" @keyup.enter.native="getList" class="filter-item">
	                  <el-option v-for="item in groupArr" :key="item.code" :label="item.name" :value="item.code"></el-option>
	                </el-select>
	                <span>{{selectedMsg}}</span>
	                <el-button v-if="0" style="float:right;margin-right: 10px;" @click="average()" type="primary">平均分配</el-button>
	  			</div>
			</div>
			<el-table :key='tableKey' :data="dataList" v-loading.body="listLoading" ref="allocateTable" border fit highlight-current-row
				max-height="370" @select="handleSelectionChange" @select-all="handleSelectionChange">
		
				<el-table-column type="selection" width="45" ></el-table-column>
			    <el-table-column label="姓名" width="150px" align="center" fixed="left">
		            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
		        </el-table-column>
		        
			    <el-table-column label="工号" width="160px" align="center" >
		            <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
		        </el-table-column>
		        
			    <el-table-column label="数量" align="center">
		            <template slot-scope="scope">
		            	<el-input-number v-if="scope.row.show" class="tb-cell-number-input" :min="1" :max="100000"
		            		v-model="list[scope.$index].num" :controls="false"></el-input-number>
		            </template>
		        </el-table-column>
		
		    </el-table>
		    <div v-show="!listLoading" class="pagination-container">
				<el-pagination :current-page.sync="pager.curPage" :page-size="10" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" 
					@current-change="pager.currentChangeHandler()"></el-pagination>
			</div>
	  	</div>
	
		<div slot="footer" class="dialog-footer dialog-footer-u">
		    <el-button @click="closeDialog()">取 消</el-button>
		    <el-button @click="ok()" :loading="listLoading" type="primary">确定</el-button>
		</div>
	</div>
</template>

<style>
.tb-cell-number-input{
	width: 201px;
    margin-left: -18px;
}

	
</style>

<script>
import {allocate} from '@/views/quality/business/api/allocate';
import {listQtGroup} from '@/views/admin/api/group';
import {pageByGroup } from '@/views/admin/api/user';
import {Pager} from '@/components/pager/index';
import {getMapFromArr, copyArr} from '@/utils/arrayUtil';
import $ from 'jquery';
export default {
  name: 'toAllocate',
  props: {
    callback:{
      type:Function,
      default:()=>{}
    },
    close:{
      type:Function,
      default:()=>{}
    },
    samples:{
      type:Array,
      required: true
    }
  },
  data() {
    return {
    	listQuery:{
    		groupCode:undefined,
    		groupUserType: 0
    	},
    	pager:Pager(),
	    tableKey:0,
	    list:[],
	    listLoading:false,
	    groupArr:[],
	    batchNum:0,
	    taskNum:0,
	    multipleSelection: [],
	    selectedMsg:''
    }
  },
  computed:{
	groupMapping(){
		return getMapFromArr(this.groupArr);
	},
	dataList(){
		return this.list;
	}
  },
  created() {
  	this.pager.init(this.getList);
  	this.init();
    this.getList();
  },
  methods: {
  	init(){
  		if(this.samples && this.samples.length){
  			let num = 0;
  			this.batchNum = this.samples.length;
  			this.samples.forEach((item, i)=>{
  				num += item.assignableNum;
  			});
  			this.taskNum = num;
  		}
  		listQtGroup().then(response => {
	        this.groupArr = response.data;
	    });
  	},
  	getList() {
      this.listLoading = true;
      $.extend(this.listQuery, this.pager.getPage());
      pageByGroup(this.listQuery).then(response => {
        this.list = response.data.list;
        this.pager.render(response.data.totalSize);
        this.listLoading = false;
      })
    },
    handleSelectionChange(val, row) {
    	if(val && val.length){
    		if(this.taskNum < val.length){
    			this.$message.warning({message: '质检员数量不能超过任务总数量',showClose: true});
    			if(row){
    				this.$refs['allocateTable'].toggleRowSelection(row, false);
    			}else{
    				this.$refs['allocateTable'].clearSelection();
    				this.list.forEach((item, i)=>{
						item.show = false;
		    		});
		    		this.multipleSelection = [];
		    		this.selectedMsg = '';
    			}
    			return false;
    		}
    		val.forEach((item, i)=>{
    			item.show = true;
    			if(!item.num){
    				item.num = 1;
    			}
    		});
    		this.list.forEach((item, i)=>{
    			if(val.indexOf(item)<0){
    				item.show = false;
    			}
    		});
    		this.selectedMsg = '已选 '+val.length+' 个';
    	}else{
    		this.list.forEach((item, i)=>{
				item.show = false;
    		});
    		this.selectedMsg = '';
    	}
        this.multipleSelection = val;
    },
    average(){
    	if(!this.multipleSelection.length){
    		this.$message.warning({message: '请先选择质检员',showClose: true});
    		return ;
    	}
		if(this.taskNum < this.multipleSelection.length){
			this.$message.warning({message: '人均不足一条任务，无法均分',showClose: true});
			return ;
		}
		let lf = this.taskNum % this.multipleSelection.length;
		let every = parseInt(this.taskNum / this.multipleSelection.length);
		this.multipleSelection.forEach((item, i)=>{
			item.num = i<lf? every+1 : every;
		});
		this.list = copyArr(this.list);
		setTimeout(()=>{
			this.multipleSelection.forEach((item, i)=>{
				this.$refs['allocateTable'].toggleRowSelection(item, true);
			});
		}, 50);
		this.$message.success({message: '已按照平均分配',showClose: true});
    },
    closeDialog(){
      this.close();
    },
    ok(){
    	if(!this.multipleSelection || !this.multipleSelection.length){
    		this.$message.warning({message: '请先选择质检员',showClose: true});
    		return ;
    	}
    	let userList = [];
    	let totol = 0;
    	this.multipleSelection.forEach((item, i)=>{
    		totol+=item.num;
    		userList.push({
    			username:item.username,
    			num:item.num
    		});
    	});
    	if(this.taskNum < totol){
    		this.$message.warning({message: '分配任务数量总和不能超过【 '+this.taskNum+" 】个",showClose: true});
    		return ;
    	}
    	
    	let batchNoArr = [];
		this.samples.forEach((item, i)=>{
			batchNoArr.push(item.batchNo);
		});
		let data = {
			taskNum: this.taskNum,
			batchNo: batchNoArr.join(),
			users: userList
		};
		this.listLoading = true;
		allocate(data).then(response => {
			if(response && response.rel){
                this.closeDialog();
                this.callback();
                this.$message.success({message: '分配成功【 '+ response.data+ ' 】条',showClose: true});
	        }else{
	            this.$message.error({message: response.msg ? response.msg : '分配失败',showClose: true});
	        }
	        this.listLoading = false;
	    });
    }
  }
}
</script>
