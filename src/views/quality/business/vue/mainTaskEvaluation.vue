<template>
<div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-form :inline="true" ref="listQuery" :model="listQuery">
        	
        	<el-form-item class="el-form-item-u" label="录音日期">
                <el-date-picker type="date"  v-model="listQuery.startTime" placeholder="开始日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
                -
                <el-date-picker  type="date" v-model="listQuery.endTime" placeholder="结束日期" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd" style="width: 110px;"></el-date-picker>
            </el-form-item>
          	<el-form-item class="el-form-item-u" label="抽检批次号">
              	<el-input v-model="listQuery.batchNo" placeholder="输入批次号" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
          	</el-form-item>
            <el-form-item class="el-form-item-u" label="业务线">
				<el-select v-model="listQuery.businessCode" placeholder="选择业务线" :clearable='true' style="width: 100px;" @keyup.enter.native="getList" class="filter-item">
					<el-option v-for="item in businessCodes" :key="item.code" :label="item.name" :value="item.code"></el-option>
				</el-select>
			</el-form-item>
            <el-form-item class="el-form-item-u" label="质检员">
                <el-input v-model="listQuery.inspector" placeholder="输入工号" clearable style="width: 120px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="客户电话">
                <el-input v-model="listQuery.custPhone" clearable style="width: 120px;" placeholder="输入电话" @keyup.enter.native="getList" class="filter-item"> </el-input>
            </el-form-item>
            <el-form-item class="el-form-item-u" label="操作时间">
                <el-date-picker type="datetime"  v-model="listQuery.operTimeStart" placeholder="操作开始时间" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 150px;"></el-date-picker>
                -
                <el-date-picker  type="datetime" v-model="listQuery.operTimeEnd" placeholder="操作结束时间" @keyup.enter.native="getList" class="filter-item"
              		:clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 150px;"></el-date-picker>
            </el-form-item>
              <!--<el-form-item class="el-form-item-u" label="坐席工号">
                  <el-input v-model="listQuery.agentId" placeholder="输入关键字" style="width: 133px;" @keyup.enter.native="getList" class="filter-item"> </el-input>
              </el-form-item>-->
              <!--<el-form-item class="el-form-item-u" label="状态">
                <el-select v-model="listQuery.status" clearable filterable placeholder="选择状态" style="width: 130px;">
                  <el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item class="el-form-item-u" >
                  <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
              </el-form-item>
        </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column label="序号" width="65" v-if=false align="center">
            <template slot-scope="scope"><span>{{scope.row.id}}</span></template>
        </el-table-column>

	    <el-table-column label="抽检批次号" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.batchNo}}</span></template>
        </el-table-column>

	    <el-table-column label="业务线" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.businessCode}}</span></template>
        </el-table-column>
        
        <el-table-column label="客户电话" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.custPhone}}</span></template>
        </el-table-column>
        
        <el-table-column label="录音流水" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.serialNumber}}</span></template>
        </el-table-column>
        
        <el-table-column label="坐席" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentName}}</span></template>
        </el-table-column>
        
	    <el-table-column label="坐席工号" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.agentId}}</span></template>
        </el-table-column>
        
        <el-table-column label="录音时长" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.recordTime}}</span></template>
        </el-table-column>

	    <el-table-column label="开始时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.startTime}}</span></template>
        </el-table-column>

	    <el-table-column label="结束时间" width="180px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.tape.endTime}}</span></template>
        </el-table-column>

	    <el-table-column label="质检小组" width="150px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.qualityGroupName}}</span></template>
        </el-table-column>

	    <el-table-column label="质检员" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.inspector}}</span></template>
        </el-table-column>

	    <el-table-column label="当前处理人" width="120px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.curProcesser}}</span></template>
        </el-table-column>

	    <el-table-column label="得分" width="100px" align="center" >
            <template slot-scope="scope"><span>{{scope.row.score}}</span></template>
        </el-table-column>

        <el-table-column label="备注" align="center">
            <template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
        </el-table-column>

        <el-table-column label="操作时间" width="180" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
        </el-table-column>

        <el-table-column label="操作人" width="150" align="center" >
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
        </el-table-column>
        
        <el-table-column label="状态" width="120px" align="center" fixed="right">
        	<template slot-scope="scope"><span>{{scope.row.statusName}}</span></template>
      	</el-table-column>
      
        <el-table-column  align="center" label="操作" width="110px" fixed="right">
	        <template slot-scope="scope">
	          <el-button v-if="isShowBtnEdit && (scope.row.status == 2 ||scope.row.status == 5)" type="success" @click="toEvaluation(scope.row)"><span>质检评分</span></el-button>
	          <el-button v-else-if="isShowBtnEdit && scope.row.status == 7" type="success" @click="toEvaluation(scope.row)"><span>申诉评分</span></el-button>
	          <el-button v-else type="primary" @click="toEvaluation(scope.row)"><span>详情</span></el-button>
	        </template>
	    </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}" @current-change="pager.currentChangeHandler()" ></el-pagination>
    </div>

    <el-dialog title="评分详情" v-if="evaluationMainTaskVisible" :visible.sync="evaluationMainTaskVisible" class="dailog-body-u"
               custom-class="el-dialog-evalution-mta" top="3vh" :center="true" :append-to-body="true" >
      	<main-task-detail :taskId="curRow.id" :stage="stage" :close="closeDialog" :callback="evaluationMainTaskCallback"></main-task-detail>
    </el-dialog>
</div>
</template>

<style>
.el-dialog--batch-update-mta{
  width: 380px;
}
 .el-dialog-evalution-mta{
   width: 1000px;
 }
</style>

<script>
import {listStatus, listEvaluation} from '@/views/quality/business/api/mainTask';
import {getBusiness} from '@/views/quality/setting/api/sampleRule';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import { mapGetters } from 'vuex';
import {getMapFromArr} from '@/utils/arrayUtil';
export default {
	name: 'mainTask',
	components: {
	    'main-task-detail': () => import('./mainTaskDetail/mainTaskDetail')
	},
	data() {
	    return {
	      	statusArr:[],
	      	toAdds: [],
	      	evaluationStatus: 1,
	      	content: '批量通过',
	      	mistake: '',
	     	submitBtnLoading: false,
	      	evaluationMainTaskVisible: false,
	      	evaluationIds: [],
	      	businessCodes:[],
	      	taskId: '',
	      	metadata:{
			    batchNo: undefined,
		        modeCode: undefined,
		        businessCode: undefined,
		        ruleId: undefined,
		        sampleType: undefined,
		        itemType: undefined,
		        agentId: undefined,
		        qualityGroupCode: undefined,
		        inspector: undefined,
		        extractTime: undefined,
		        allocateTime: undefined,
		        curProcesser: undefined,
		        lastProcesser: undefined,
		        lastProcessTime: undefined,
		        status: undefined,
		        score: undefined
		    },
		    form: $.extend(true, {}, this.metadata),
		    rules: {
		
		    },
		    list: null,
		    pager:Pager(),
		    listLoading: false,
		    listQuery: {
		        batchNo: undefined,
		        businessCode: undefined,
		        agentId: undefined,
		        qualityGroupCode: undefined,
		        inspector: undefined,
		        curProcesser: undefined,
		        status: undefined
		    },
		    batchDialogVisible: false,
		    dialogStatus: '',
		    isShowBtnEdit: false,
		    tableKey: 0,
		    dialogTitle:'',
		    stage: 'EVAL',
		    curRow:{}
	    }
	},
	created() {
		this.init();
	    this.pager.init(this.getList);
	    //this.getList();
	    this.isShowBtnEdit = hasPermission('mainTaskEvaluation.update');
	},
	computed: {
	    ...mapGetters(['elements']),
	    statusMapping() {
	      return getMapFromArr(this.statusArr);
	    }
	},
	methods: {
		init(){
	  		getBusiness().then(response => {this.businessCodes = response.data;});
	  		listStatus(this.stage).then(response => {
		      	this.statusArr = response.data;
		    });
	  	},
	    getList() {
		    this.listLoading = true;
		    $.extend(this.listQuery, this.pager.getPage());
		    listEvaluation(this.listQuery).then(response => {
		        this.list = response.data.list;
		        this.pager.render(response.data.totalSize);
		        this.listLoading = false;
		    })
	    },
	    handleSelectionChange(val) {
	      this.toAdds = val;
	    },
	    closeDialog(toClear){
	      this.batchDialogVisible = false;
	      this.evaluationMainTaskVisible = false;
	      if(toClear || this.dialogStatus == 'update'){
	        this.$refs['form'].resetFields();
	      }
	    },
	    toEvaluation(row) {
	      this.curRow = row;
	      this.evaluationMainTaskVisible = true;
	    },
	    selectionChangeHandler(val) {
	      this.toAdds = val;
	    },
	    evaluationMainTaskCallback() {
	      	this.getList();
	    }
	}
}
</script>
