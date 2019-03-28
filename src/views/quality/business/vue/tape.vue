<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listQuery">

			<el-form-item class="el-form-item-u" label="日期">
                <el-date-picker type="date"  v-model="listQuery.startTime" placeholder="开始日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
                -
                <el-date-picker  type="date"  v-model="listQuery.endTime" placeholder="结束日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="流水号">
                <el-input v-model="listQuery.serialNumber" clearable placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="工号">
                <el-input v-model="listQuery.agentId" clearable placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="思科工号">
                <el-input v-model="listQuery.agentNo" clearable placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="呼叫类型">
                <el-select v-model="listQuery.type" clearable placeholder="选择呼叫类型" style="width: 100px;" @keyup.enter.native="getList" class="filter-item">
                  <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="客户电话">
                <el-input v-model="listQuery.custPhone" clearable placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="服务号码">
                <el-input v-model="listQuery.serviceNo" clearable placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" >
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

	    <el-table-column label="流水号" width="150px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.serialNumber}}</span></template>
        </el-table-column>

	    <el-table-column label="呼叫类型" width="100px" align="center" fixed="left">
            <template slot-scope="scope"><span>{{scope.row.direction}}</span></template>
        </el-table-column>
        
        <el-table-column label="服务号码" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.serviceNo}}</span></template>
        </el-table-column>

	    <el-table-column label="客户电话" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.custPhone}}</span></template>
        </el-table-column>

	    <el-table-column label="分机号" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentPhone}}</span></template>
        </el-table-column>

	    <el-table-column label="坐席工号" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentId}}</span></template>
        </el-table-column>
        
	    <el-table-column label="坐席" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentName}}</span></template>
        </el-table-column>

	    <el-table-column label="思科工号" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentNo}}</span></template>
        </el-table-column>

	    <el-table-column label="录音时长" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.recordTime+'s'}}</span></template>
        </el-table-column>

	    <el-table-column label="开始时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.startTime}}</span></template>
        </el-table-column>

	    <el-table-column label="结束时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.endTime}}</span></template>
        </el-table-column>
        
        <el-table-column label="满意类型" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.satisfactionType}}</span></template>
        </el-table-column>

	    <el-table-column label="合同号" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.contractNo}}</span></template>
        </el-table-column>

	    <el-table-column label="挂断方式" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.hangupType}}</span></template>
        </el-table-column>

	    <el-table-column label="录音平台" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.platform}}</span></template>
        </el-table-column>

	    <el-table-column label="媒体类型" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.mediaType}}</span></template>
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

        <el-table-column  align="center" label="操作" width="85px" fixed="right">
            <template slot-scope="scope">
            <el-button size="small" type="success" @click="toShow(scope.row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog :title="'查看录音详情'" :visible.sync="dialogVisible" class="dailog-body-u" 
    	custom-class="el-dialog-u-add-tape" top="3vh" :append-to-body="true" :modal-append-to-body="false">

        <div class="el-dialog-panel" style="max-height: 480px;">
            <el-form :model="form" ref="form" label-width="80px" class="form-body-u">

            	<div style="display: table">
	               <el-form-item label="录音流水号" prop="serialNumber"  class="form-item-tape-u">
	                   <el-input v-model="form.serialNumber"  readonly></el-input>
	               </el-form-item>
	               <el-form-item label="呼叫类型" prop="type"  class="form-item-tape-u">
	                   <el-input v-model="form.direction"  readonly></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="客户姓名" prop="custName"  class="form-item-tape-u">
	                   <el-input v-model="form.custName"  readonly></el-input>
	               </el-form-item>
	               <el-form-item label="客户电话" prop="custPhone"  class="form-item-tape-u">
	                   <el-input v-model="form.custPhone"  readonly></el-input>
	               </el-form-item>
            	</div>
            	
            	<div style="display: table">
            		<el-form-item label="身份证号" class="form-item-tape-u">
	                   	<el-input v-model="form.ivrInfo.custIdCard" readonly ></el-input>
	                </el-form-item>
	                <el-form-item label="身份证验证 " class="form-item-tape-u">
	                   	<el-input v-model="form.ivrInfo.ivrVerify" readonly ></el-input>
	                </el-form-item>
            	</div>
            	
            	<div style="display: table">
	               <el-form-item label="坐席分机号" prop="agentPhone"  class="form-item-tape-u">
	                   <el-input v-model="form.agentPhone"  readonly></el-input>
	               </el-form-item>
	               <el-form-item label="坐席姓名" prop="agentName"  class="form-item-tape-u">
	                   <el-input v-model="form.agentName"  readonly></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="思科工号" prop="agentNo"  class="form-item-tape-u">
	                   <el-input v-model="form.agentNo"  readonly></el-input>
	               </el-form-item>
	               <el-form-item label="录音时长" prop="recordTime"  class="form-item-tape-u">
	                   <el-input v-model="form.recordTime+'s'"  readonly></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="录音时间" prop="startTime" class="form-item-tape-u" style="width: 540px;">
	                   <el-input v-model="form.startTime" style="width: 190px;"  readonly></el-input>
	                   <span>-</span>
	                   <el-input v-model="form.endTime" style="width: 190px;"  readonly></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="服务号码" prop="serviceNo"  class="form-item-tape-u">
	                   <el-input v-model="form.serviceNo"  readonly></el-input>
	               </el-form-item>
	               <el-form-item label="录音平台" prop="platForm"  class="form-item-tape-u">
	                   <el-input v-model="form.platform"  readonly></el-input>
	               </el-form-item>
            	</div>
            	
            	<div style="display: table">
            		<el-form-item label="服务类型 " class="form-item-tape-u">
		                <el-input v-model="form.summary.typeName" readonly ></el-input>
	                </el-form-item>
	                <el-form-item label="来电一级 " class="form-item-tape-u">
	                   	<el-input v-model="form.summary.firstName" readonly ></el-input>
	                </el-form-item>
	            </div>
            	
            	<div style="display: table">
	                <el-form-item label="来电二级 " class="form-item-tape-u">
	                   	<el-input v-model="form.summary.secondName" readonly ></el-input>
	                </el-form-item>
	                <el-form-item label="来电三级 " class="form-item-tape-u">
	                   	<el-input v-model="form.summary.thirdName" readonly ></el-input>
	                </el-form-item>
	            </div>
            	
            	<div style="display: table">
	                <el-form-item label="来电四级 " class="form-item-tape-u">
	                   	<el-input v-model="form.summary.forthName" readonly ></el-input>
	                </el-form-item>
	            </div>
            	
            	<div style="display: table">
	               <el-form-item label="满意类型" prop="satisfactionType"  class="form-item-tape-u">
	                   <el-input v-model="form.satisfactionType" readonly></el-input>
	               </el-form-item>
	               <el-form-item label="合同号" prop="contractNo"  class="form-item-tape-u">
	                   <el-input v-model="form.contractNo"  readonly></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="挂断方式" prop="hangupType"  class="form-item-tape-u">
	                   <el-input v-model="form.hangupType"  readonly></el-input>
	               </el-form-item>
	               <el-form-item label="媒体类型" prop="mediaType"  class="form-item-tape-u">
	                   <el-input v-model="form.mediaType"  readonly></el-input>
	               </el-form-item>
            	</div>
            	<div style="display: table">
	               <el-form-item label="录音地址" prop="address" class="form-item-tape-u" style="width: 540px;">
	               		<el-input v-model="form.address" style="width: 360px;" readonly></el-input>
	                   	<el-button type="primary" :disabled="!form.address" @click="openNewTab()" 
	                   	style="float:right;" icon="icm icon-down">下载打开</el-button>
	               </el-form-item>
            	</div>
                <div style="display: table;">
	                <el-form-item label="备注" prop="remark" class="form-item-tape-u" style="width: 540px;">
	                    <el-input type="textarea" v-model="form.remark" readonly :autosize="{minRows: 2, maxRows: 5}" ></el-input>
	                </el-form-item>
                </div>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog()">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<style>
.el-dialog-u-add-tape{
  width: 610px;
}
.form-item-tape-u{
	margin-bottom: 2px !important;
	float: left;
	width: 270px;
}
</style>

<script>
import {page, getObj} from '@/views/quality/business/api/tape';
import $ from 'jquery';
import {Pager} from '@/components/pager/index';
import { mapGetters } from 'vuex';
import {getMapFromArr} from '@/utils/arrayUtil';
import {getDurationDateStr} from '@/utils/dateUtil';
export default {
  name: 'tape',
  data() {
    return {
      form: {
      	summary:{},
      	ivrInfo:{}
      },
      list: null,
      pager:Pager(),
      listLoading: true,
      listQuery: {
      		startTime: getDurationDateStr(-1),
      		endTime: undefined,
	        serialNumber: undefined,
	        type: undefined,
	        custPhone: undefined,
	        agentId: undefined,
	        agentNo: undefined,
	        recordTime: undefined,
	        direction: undefined,
	        serviceNo: undefined
      },
      dialogVisible: false,
      types:[{value:1, name:'呼入'},{value:2, name:'呼出'}],
      tableKey: 0
    }
  },
  created() {
    this.pager.init(this.getList);
    this.getList();
  },
  computed: {
  	...mapGetters(['tenantId']),
  	typeMapping(){
		return getMapFromArr(this.types);
	},
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
    openNewTab(){
  		window.open(this.form.address, "_blank");
  	},
    openDialog(){
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    toShow(row) {
    	this.form  = row;
    	this.openDialog();
        getObj(row.id).then(response => {
            if(response.data){
              this.form = response.data;
              this.openDialog();
            }else{
              this.getList();
              this.$message({message: '该记录已不存在',showClose: true,type: 'warn'});
            }
        });
    }
  }
}
</script>