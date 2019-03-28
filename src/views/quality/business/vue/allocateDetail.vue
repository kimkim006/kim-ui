<template>
  <div>
    <div class="el-dialog-panel">
      <div class="app-container calendar-list-container">
        <div class="filter-container">
          <el-form :inline="true" :model="listQuery">
            <el-form-item class="el-form-item-u">
              <el-form-item class="el-form-item-u" label="抽检批次号">
                <el-input v-model="listQuery.batchNo" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"></el-input>
              </el-form-item>
              <el-form-item class="el-form-item-u" label="质检员">
                <el-input v-model="listQuery.inspector" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="getList" class="filter-item"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item class="el-form-item-u">
              <el-button class="filter-item" type="primary" size="small" v-waves icon="search" @click="getList"
                         style="margin-bottom: 3px;">搜索
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  max-height="300" current-row-key="code">
          <el-table-column label="抽检批次号" width="180px" align="center">
            <template slot-scope="scope"><span>{{scope.row.batchNo}}</span></template>
          </el-table-column>

          <el-table-column label="质检员" width="180px" align="center">
            <template slot-scope="scope"><span>{{scope.row.inspector}}</span></template>
          </el-table-column>

          <el-table-column label="备注" align="center" :show-overflow-tooltip='true'>
            <template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
          </el-table-column>

          <el-table-column label="操作时间" width="180px" align="center">
            <template slot-scope="scope"><span>{{scope.row.operTime}}</span></template>
          </el-table-column>

          <el-table-column label="操作人" width="150px" align="center">
            <template slot-scope="scope"><span>{{scope.row.operName}}</span></template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination :current-page.sync="pager.curPage" :page-size="pager.pageSize" :total="pager.totalSize"
                         :layout="pager.layout" :page-sizes="pager.sizes"
                         @size-change="function(val){pager.sizeChangeHandler(val)}"
                         @current-change="pager.currentChangeHandler()"></el-pagination>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer dialog-footer-u">
      <el-button @click="closeDialog(true)">取 消</el-button>
    </div>
  </div>
</template>

<style>
  .filter-container .filter-item {
    margin-bottom: 6px;
  }

</style>
<script>
  import {detailListByPage} from '@/views/quality/business/api/allocate';
  import $ from 'jquery';
  import {hasPermission} from '@/utils/permissionUtil';
  import {Pager} from '@/components/pager/index';
  import {mapGetters} from 'vuex';

  export default {
    name: 'allocateDetail',
    props: {
      currActBatchNo:String,
      close: {
        type: Function,
        default: () => {
        }
      }
    },
    data() {
      return {
        metadata: {
          tenantId: undefined
        },
        list: null,
        pager: Pager(),
        listLoading: true,
        listQuery: {
          actBatchNo: this.currActBatchNo,
          batchNo: undefined,
          mainTaskId: undefined,
          inspector: undefined,
          remark: undefined
        },
        submitBtnLoading: false,
        tableKey: 0
      }
    },
    created() {
      this.pager.init(this.getList);
      this.getList();
    },
    computed: {
      ...mapGetters(['tenantId']),
    },
    methods: {
      getList() {
        this.pager.init(this.getList);
        this.listLoading = true;
        $.extend(this.listQuery, this.pager.getPage());
        detailListByPage(this.listQuery).then(response => {
          this.list = response.data.list;
          this.pager.render(response != null ? response.data.totalSize : null);
          this.listLoading = false;
        })
      },
      closeDialog(toClear) {
        this.close();
      }
    }
  }
</script>
