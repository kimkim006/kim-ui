<template>
	<div>
	  	<div class="el-dialog-panel">
	  		<div class="filter-container">
  				<el-tag type="primary" style="margin: 10px; text-align: center;">
	  				<span>已选择【</span>
		  			<span style="color: red;">{{batchNum}}</span>
		  			<span>】个批次,  包含质检员【</span>
		  			<span style="color: red;">{{totalSize}}</span>
		  			<span>】个,  已分配【</span>
		  			<span style="color: red;">{{taskNum}}</span>
		  			<span>】个,  可回收任务【</span>
		  			<span style="color: red;">{{available}}</span><span> 】个</span>
	  			</el-tag>
	  			<div style="display: inline;">
	                <span>{{selectedMsg}}</span>
	                <el-button v-if="0" style="float:right;margin-right: 10px;" @click="average()" type="primary">平均分配</el-button>
	  			</div>
			</div>
			<el-table :key='tableKey' :data="list" v-loading.body="listLoading" ref="recycleTable" border fit highlight-current-row
				@select="handleSelectionChange" @select-all="handleSelectionChange">
		
				<el-table-column type="selection" width="45" ></el-table-column>
			    <el-table-column label="质检员" width="150px" align="center" fixed="left">
		            <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
		        </el-table-column>
		        
			    <el-table-column label="质检员工号" width="160px" align="center" >
		            <template slot-scope="scope"><span>{{scope.row.inspector}}</span></template>
		        </el-table-column>
		        
			    <el-table-column label="可回收量" width="100px" align="center" >
		            <template slot-scope="scope"><span>{{scope.row.count}}</span></template>
		        </el-table-column>
		        
			    <el-table-column label="数量" align="center">
		            <template slot-scope="scope">
		            	<el-input-number v-if="scope.row.show" class="tb-cell-number-input" :min="1" :max="10000"
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
	width: 101px;
    margin-left: -18px;
}

</style>

<script>
import {listUserByBacth, recycle} from '@/views/quality/business/api/recycle';
import {Pager} from '@/components/pager/index';
import $ from 'jquery';
export default {
  name: 'toRecycle',
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
    		batchNo:undefined
    	},
    	pager:Pager(),
	    tableKey:0,
	    list:[],
	    listLoading:false,
	    groupArr:[],
	    batchNum:0,
	    taskNum:0,
	    totalSize: 0,
	    available: 0,
	    multipleSelection: [],
	    selectedMsg:''
    }
  },
  computed:{
	
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
  			var batchNo = "";
  			this.samples.forEach((item, i)=>{
  				num += (item.extractNum - item.assignableNum);
  				batchNo+=item.batchNo +","
  			});
  			if(batchNo.length > 0){
  				batchNo = batchNo.substring(0, batchNo.length-1);
  			}
  			this.listQuery.batchNo = batchNo;
  			this.taskNum = num;
  		}
  	},
  	getList() {
      this.listLoading = true;
      $.extend(this.listQuery, this.pager.getPage());
      listUserByBacth(this.listQuery).then(response => {
        this.list = response.data.list;
        this.pager.render(response.data.totalSize);
        this.totalSize = response.data.totalSize;
        this.available = 0;
        if(this.list && this.list.length){
        	this.list.forEach((item, i)=>{
        		this.available += item.count;
        	});
        }
        this.listLoading = false;
      })
    },
    handleSelectionChange(val, row) {
    	if(val && val.length){
    		val.forEach((item, i)=>{
    			item.show = true;
    			if(!item.num){
    				item.num = item.count;
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
    closeDialog(){
      this.close();
    },
    ok(){
    	if(!this.multipleSelection || !this.multipleSelection.length){
    		this.$message.warning({message: '请选择质检员',showClose: true});
    		return ;
    	}
    	let userList = [];
    	let totol = 0;
    	let arr = this.multipleSelection;
    	for(let i=0;i<arr.length;i++){
    		if(arr[i].num > arr[i].count){
    			this.$message.warning({message: "【"+arr[i].name+'】的回收数量不能超过【'+arr[i].count+"】个",showClose: true});
    			return;
    		}
    		totol+=arr[i].num;
    		userList.push({
    			username:arr[i].inspector,
    			num:arr[i].num
    		});
    	}
    	if(this.taskNum < totol){
    		this.$message.warning({message: '回收任务数量总和不能超过【 '+this.taskNum+" 】个",showClose: true});
    		return ;
    	}
		let batchNoArr = [];
		this.samples.forEach((item, i)=>{
			batchNoArr.push(item.batchNo);
		});
		let data = {
			taskNum: totol,
			available: this.available,
			batchNo: batchNoArr.join(),
			users: userList
		};
		this.listLoading = true;
		recycle(data).then(response => {
			if(response && response.rel){
                this.closeDialog();
                this.callback();
                this.$message.success({message: '回收成功【 '+ response.data+ ' 】条',showClose: true});
	        }else{
	            this.$message.error({message: response.msg ? response.msg : '回收失败',showClose: true});
	        }
	        this.listLoading = false;
	    });
    }
  }
}
</script>
