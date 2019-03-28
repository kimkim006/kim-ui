<template>
<div class="app-container" style="height: calc(100% - 50px); overflow-y: auto;">
	<div class="el-box">
		<div class="call-screen-box" style="width: 68%;">
			<fieldset class="el-dialog-panel task-item">
  				<legend>来电信息</legend>
	            <el-form :model="form" ref="form" label-width="100px" class="cs-form-body-u">
	            	<div style="display: table">
		               	<el-form-item label="来电IVR路径" label-width="100px" class="cs-form-item-u">
		               		<span style="color: red; font-weight: bold;">{{form.ivrPath}}</span>
		              	 </el-form-item>
		            </div>
	            	
	            	<div style="display: table">
		               	<el-form-item label="来电号码" class="cs-form-item-u">
		                   	<el-input v-model="form.phoneNum" readonly ></el-input>
		               	</el-form-item>
		               	<el-form-item label="来电时间" class="cs-form-item-u">
		                   	<el-input v-model="form.phoneDate" readonly ></el-input>
		               	</el-form-item>
		               	<el-form-item label="是否预留电话" class="cs-form-item-u2">
		                   	<el-input v-model="form.isReserve" readonly ></el-input>
		               	</el-form-item>
		            </div>
	            	<div style="display: table">
		               	<el-form-item label="客户姓名" class="cs-form-item-u">
		                   	<el-input v-model="form.customerName" readonly ></el-input>
		               	</el-form-item>
		               	<el-form-item label="身份证号码" class="cs-form-item-u">
		                   	<el-input v-model="form.certId" readonly ></el-input>
		               	</el-form-item>
		               	<el-form-item label="性别" prop="sex" class="cs-form-item-u2">
		                   	<el-input v-model="form.sex" readonly ></el-input>
		               	</el-form-item>
		            </div>
	            	
	            	<div style="display: table">
		               	<el-form-item label="是否白名单" prop="isWhite" class="cs-form-item-u">
		                   	<el-input v-model="form.isWhite" readonly ></el-input>
		               	</el-form-item>
		               	<el-form-item label="是否合伙人" prop="isPartner"  class="cs-form-item-u">
		                   	<el-input v-model="form.isPartner" readonly ></el-input>
		               	</el-form-item>
		            </div>
	            	
	            	<div style="display: table">
		               	<el-form-item label="是否绑定微信公众号" prop="isFollowMMLGOffAcc" label-width="140px" class="cs-form-item-u">
		                   	<el-input v-model="form.isFollowMMLGOffAcc" readonly ></el-input>
		               	</el-form-item>
		               	<el-form-item label="是否注册买买乐购app" prop="isRegister"  label-width="150px" class="cs-form-item-u">
		                   	<el-input v-model="form.isRegister" readonly ></el-input>
		               	</el-form-item>
	            	</div>
	            </el-form>
	        </fieldset>
	        <div>
	        	<div class="filter-container" style="margin-top: 10px;">
			        <el-form :inline="true" :model="listQuery">
			          	<el-form-item class="el-form-item-u" label="身份证号">
			                <el-input v-model="listQuery.idCard" style="width: 180px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
			           	</el-form-item>
			          	<el-form-item class="el-form-item-u" label="合同编号">
			                <el-input v-model="listQuery.contractNo" style="width: 180px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
			           	</el-form-item>
			           	<el-form-item class="el-form-item-u" >
			                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getContractList">搜索</el-button>
			           	</el-form-item>
			           	<el-form-item class="el-form-item-u" >
			                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getContractList">联络历史查询</el-button>
			           	</el-form-item>
			        </el-form>
			    </div>
			    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border
			    	 fit highlight-current-row max-height='90%'>
			
				    <el-table-column label="合同编号" width="180px" align="center" >
			            <template slot-scope="scope"><span>{{scope.row.contractNo}}</span></template>
			        </el-table-column>
			
				    <el-table-column label="客户编码" width="180px" align="center" :show-overflow-tooltip='true'> 
			            <template slot-scope="scope"><span>{{scope.row.custId}}</span></template>
			        </el-table-column>
			
				    <el-table-column label="分期时间" width="150px" align="center" >
			            <template slot-scope="scope"><span>{{scope.row.registerDate}}</span></template>
			        </el-table-column>
			
				    <el-table-column label="订单类型" width="100px" align="center" >
			            <template slot-scope="scope"><span>{{scope.row.loanType}}</span></template>
			        </el-table-column>
			
			        <el-table-column label="分期期数" width="100" align="center" >
			            <template slot-scope="scope"><span>{{scope.row.loanTerm}}</span></template>
			        </el-table-column>
			
			        <el-table-column label="分期金额" width="100" align="center" >
			            <template slot-scope="scope"><span>{{scope.row.loanPrin}}</span></template>
			        </el-table-column>
			        
			        <el-table-column label="每期应还金额" width="140" align="center" >
			            <template slot-scope="scope"><span>{{scope.row.loanFixedPrin}}</span></template>
			        </el-table-column>
			        
			        <el-table-column label="账单日" width="100" align="center" >
			            <template slot-scope="scope"><span>{{scope.row.dueDate}}</span></template>
			        </el-table-column>
			        
			        <el-table-column label="系统编码" width="100" align="center" >
			            <template slot-scope="scope"><span>{{scope.row.systemCode}}</span></template>
			        </el-table-column>
			    </el-table>
			
			    <div v-show="!listLoading" class="pagination-container">
			        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
			    </div>
	        </div>
		</div>
		<div class="call-screen-box" style="width: 32%;">
			<div>
		        <div class="filter-container" style="margin-left: 2px;">
		          <el-button :loading="treeLoading" type="primary" icon="search" style="width: 15%" @click="getTreeData">刷新</el-button>
		          <el-input placeholder="输入关键字" clearable style="width: 83%" v-model="filterText" ></el-input>
		        </div>
		
		      	<div style="margin: 1px 2px 1px 2px;">
			        <el-tree :data="treeData" node-key="id" highlight-current v-loading.body="treeLoading"
			            :props="defaultProps" ref="tree"
			            :default-expand-all="true"
			            :filter-node-method="filterNode" class="filter-tree"
			            :expand-on-click-node="true"
			            @current-change="currentChangeHandler"
			            style="min-height: 200px;max-height: 400px;overflow:auto;">
			        </el-tree>
		      	</div>
		    </div>
		    <div class="call-screen-box">
		    	<el-form :model="submitForm" ref="submitForm" :rules="submitFormRules" label-width="80px" class="form-body-u">
	               	<el-form-item label="合同号" prop="contractNo" style="margin-bottom: 6px !important;">
	               		<el-input v-model="submitForm.contractNo" ></el-input>
	              	</el-form-item>
	               	<el-form-item label="服务结果" prop="result" required style="margin-bottom: 0px !important;">
  						<el-radio-group v-model="submitForm.result">
						    <el-radio label="1">完成</el-radio>
						    <el-radio label="2">预约</el-radio>
						</el-radio-group>
	              	</el-form-item>
	              	<template v-if="submitForm.result == 2">
	              		<el-form-item label="预约时间" prop="bookingTime" required>
		               		<el-date-picker type="datetime" v-model="submitForm.bookingTime" 
	                			style="width: 170px;" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
	                		<el-checkbox v-model="submitForm.isRemind">系统提醒</el-checkbox>
		              	</el-form-item>
	              	</template>
	               	<el-form-item label="服务记录" prop="serviceLog" required >
	                    <el-input type="textarea" v-model="submitForm.serviceLog" :autosize="{minRows: 2, maxRows: 8}"></el-input>
	                </el-form-item>
		    	</el-form>
		    	<div class="dialog-footer" style="text-align: center;">
		    		<el-button :loading="submitBtnLoading" @click="submitHandler()" type="primary">提  交</el-button>
		            <el-button @click="resetForm()">重  置</el-button>
		        </div>
		    </div>
		</div>
    </div>
</div>
</template>

<style>
.call-screen-box{
	border: 1px solid #dfe6ec;
	padding: 5px;
}
.cs-form-body-u{
  margin-top: 1px;
  margin-bottom: 1px;
  padding-bottom: 1px;
}
.cs-form-item-u{
	margin-bottom: 2px !important;
	float: left;
	width: 280px;
}
.cs-form-item-u2{
	margin-bottom: 2px !important;
	float: left;
	width: 180px;
}
</style>

<script>
import {contractList} from './callScreenApi';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';

export default {
	name: "callScreenDetail",
	props: {
      	serviceId:{
	    	type: String,
	    	required: true
	    }
	},
	data() {
	  	return {
	    	form: {
	    		ivrPath: "买买提来电弹屏",
	    		phoneNum: "",
	    		phoneDate: "",
	    		isReserve: "",
	    		customerName: "",
	    		certId: "",
	    		sex: "",
	    		isWhite: "",
	    		isFollowMMLGOffAcc: "",
	    		isRegister: "",
	    		isPartner: ""
	    	},
	    	list: [],
	      	pager:Pager(),
	      	listLoading: false,
	      	listQuery: {
		        idCard: undefined,
		        contractNo: undefined
	      	},
	      	tableKey: 0,
	      	treeData:[],
	      	treeLoading: false,
	      	defaultProps: {
		        children: 'children',
		        label: 'name'
		    },
		    filterText: "",
			metadata:{
		       	contractNo: "",
		    	result: '1',
		    	bookingTime: '',
		    	isRemind: true,
		    	serviceLog: ""
	      	},
		    submitForm: $.extend({}, this.metadata),
		    submitFormRules: {
	            contractNo: creatValid(check('合同号', 1, 100)),
	            result: [{required: true, message: '请选择服务结果',trigger: 'blur'}],
	            bookingTime: [{required: true, message: '请选择预约时间',trigger: 'blur'}],
	            serviceLog: creatValid(checkRequire('服务记录', 1, 10000))
	      },
	      submitBtnLoading: false
	  	}
	},
	watch: {
	    filterText(val) {
	      this.$refs['tree'].filter(val);
	    }
	},
	computed: {
    },
    created(){
    	
    },
	methods: {
		getContractList(){
			this.listLoading = true;
		    $.extend(this.listQuery, this.pager.getPage());
		    contractList(this.listQuery).then(response => {
		    	this.list = response.data.list;
		        this.pager.render(response.data.totalSize);
		        this.listLoading = false;
		    })
		},
		getTreeData(){
			this.treeLoading = true;
		    tree().then(response => {
		        this.treeData = response.data;
		        this.treeLoading = false;
		    });
		},
		filterNode(value, data) {
	      	if (!value) return true;
	      	return data.name.indexOf(value) !== -1;
	    },
	    currentChangeHandler(data, node) {
	      	if(this.curNodeData.code == data.code){
	        	return;
	      	}
	      	this.curNodeData = data;
	    },
	    submitHandler(){
	    	this.$refs['submitForm'].validate(valid => {
		        if (valid) {
		          	this.submitBtnLoading = true;
		          	addObj(this.submitForm).then(response => {
		              	if(response && response.rel){
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
	    resetForm() {
	      	this.submitForm = $.extend(true, {}, this.metadata);
	    }
	  	
	}
}
</script>

<style>
</style>