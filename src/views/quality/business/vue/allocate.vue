<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item class="el-form-item-u" label="操作时间">
          <el-date-picker type="datetime" v-model="listQuery.operTimeStart" placeholder="开始时间" @keyup.enter.native="getList" class="filter-item"
                          :clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 160px;"></el-date-picker>
          -
          <el-date-picker type="datetime" v-model="listQuery.operTimeEnd" placeholder="结束时间" @keyup.enter.native="getList" class="filter-item"
                          :clearable="true" value-format="yyyy-MM-dd HH:mm:ss" style="width: 160px;"></el-date-picker>
        </el-form-item>
        <el-form-item class="el-form-item-u" label="分配批次号">
          <el-input v-model="listQuery.actBatchNo" placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="getList" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item-u">
          <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row>

      <el-table-column label="分配批次号" width="180px" align="center" fixed="left">
        <template slot-scope="scope"><span>{{scope.row.actBatchNo}}</span></template>
      </el-table-column>

      <el-table-column label="分配详情" width="500px" align="center" :show-overflow-tooltip='true'> 
        <template slot-scope="scope"><span>{{scope.row.detail}}</span></template>
      </el-table-column>

      <el-table-column label="人员数量" width="100px" align="center">
        <template slot-scope="scope"><span>{{scope.row.userCount}}</span></template>
      </el-table-column>

      <el-table-column label="任务数量" width="100px" align="center">
        <template slot-scope="scope"><span>{{scope.row.totalCount}}</span></template>
      </el-table-column>

      <el-table-column label="操作时间" width="180" align="center">
        <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
      </el-table-column>

      <el-table-column label="操作人" width="150" align="center">
        <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="87px" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="isShowBtnDetailList" size="small" type="success" @click="openDetailDialog(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize" :layout="pager.layout" :page-sizes="pager.sizes" @size-change="function(val){pager.sizeChangeHandler(val)}"
                     @current-change="pager.currentChangeHandler()"></el-pagination>
    </div>
    <!-- 详情列表弹出框 -->
    <el-dialog :title="detailDialogTitle" :visible.sync="detailDialogVisible" custom-class="detail-dialog"
    		:append-to-body="true" :modal-append-to-body="false">
      <detail-table ref="allocateDetail" :currActBatchNo="currActBatchNo" :close="closeDetailDialog"></detail-table>
    </el-dialog>
  </div>
</template>

<style>
  .detail-dialog {
    width: 800px;
  }
</style>

<script>
import {page} from '@/views/quality/business/api/allocate';
import $ from 'jquery';
import {hasPermission} from '@/utils/permissionUtil';
import {Pager} from '@/components/pager/index';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import {mapGetters} from 'vuex';
import {getDurationDateStr} from '@/utils/dateUtil';
export default {
    name: 'allocate',
    components: {
      'detail-table': () => import('./allocateDetail')
    },

    data() {
	      return {
		        metadata: {
			          actBatchNo: undefined,
			          detail: undefined,
			          userCount: undefined,
			          totalCount: undefined,
			          tenantId: undefined,
			          remark: undefined
		        },
		        form: $.extend(true, {}, this.metadata),
		        rules: {
			          actBatchNo: creatValid(check('分配批次号', 2, 50)),
			          detail: creatValid(check('分配详情', 2, 1000)),
			          userCount: creatValid(checkNumber('人员数量', 2, 1000)),
			          totalCount: creatValid(checkNumber('分配总数量', 2, 1000)),
			          remark: creatValid(check('', 2, 200))
		        },
		        list: null,
		        pager: Pager(),
		        listLoading: false,
		        listQuery: {
			          actBatchNo: undefined,
			          detail: undefined,
			          userCount: undefined,
			          totalCount: undefined,
			          remark: undefined,
			          //operTimeStart: getDurationDateStr(-7),
			          operTimeStart: undefined,
			          operTimeEnd: undefined
		        },
		        submitBtnLoading: false,
		        isShowBtnDetailList: false,
		        detailDialogVisible: false,
		        tableKey: 0,
		        currActBatchNo:'',
		        detailDialogTitle:'详情列表'
		    }
		},
	  created() {
	      this.pager.init(this.getList);
	      //this.getList();
	      this.isShowBtnDetailList = hasPermission('allocate.detailList');
	  },
	  computed: {
	      ...mapGetters(['tenantId']),
	  },
	  methods: {
	      getList() {
		      	if(!this.listQuery.operTimeStart){
			    			this.$message.error({message: '开始时间不能为空',showClose: true});
			    			return ;
			    	}
		        this.listLoading = true;
		        $.extend(this.listQuery, this.pager.getPage());
		        page(this.listQuery).then(response => {
			          this.list = response.data.list;
			          this.pager.render(response.data.totalSize);
			          this.listLoading = false;
		        })
	      },
	      closeDetailDialog() {
	        	this.detailDialogVisible = false;
	      },
	      openDetailDialog(row) {
		        if (!row || !row.id) {
			          this.$message.warning({message: '请先刷新列表后再查看', showClose: true, type: 'warning', center: true});
			          return;
		        }
		        this.currActBatchNo=row.actBatchNo;
		        this.detailDialogTitle = "【"+row.actBatchNo+"】详情列表";
		        if (this.$refs['allocateDetail'] && this.$refs['allocateDetail'].listQuery) {
			          this.$refs['allocateDetail'].listQuery.actBatchNo = row.actBatchNo;
			          this.$refs['allocateDetail'].getList();
		        }
		        this.detailDialogVisible = true;
	      }
	  }
}
</script>
