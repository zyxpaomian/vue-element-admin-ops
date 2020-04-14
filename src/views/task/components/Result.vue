<template>
  <el-form ref="searchForm" >
    <div class="detail-container">
      <div class="search-container">
        <el-select v-model="listQuery.user" placeholder="操作用户" clearable style="width: 150px" class="filter-item">
          <el-option v-for="user in userList" :key="user" :label="user" :value="user" />
        </el-select>
        <el-date-picker
          v-model="listQuery.picktime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>

        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>             
      </div>

      <el-table
        :data="taskHistoryData"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column
          prop="taskid"
          label="任务id"
          min-width="3.5%">
        </el-table-column>
        <el-table-column
          prop="execuser"
          label="操作人"
          min-width="4.5%" >             
        </el-table-column>
        <el-table-column
          prop="exectime"
          label="操作时间"
         min-width="3.5%">
        </el-table-column>
        <el-table-column
          prop="execmethod"
          label="操作媒介"
          min-width="3.5%">
        </el-table-column>                  
        <el-table-column
          prop="exectype"
          label="任务类型"
          min-width="3.5%">
        </el-table-column>
        <el-table-column
          prop="execcmd"
          label="任务命令"
          min-width="14.5%">
        </el-table-column>        
        <el-table-column
          prop="execstatus"
          label="任务状态"
          min-width="4.5%">
          <template slot-scope="{row,$index}">
          <el-button v-if="row.execstatus==='finish'" class="success-button" @click="handleDetail(row)">操作完成</el-button>
          <el-tag v-if="row.execstatus==='executing'" class="executing-button">
            <span class="span-middle">操作中...</span>
          </el-tag>
          <el-button v-if="row.execstatus==='failed'" class="failed-button" @click="handleDetail(row)">操作失败</el-button>
          </template>           
        </el-table-column>
      </el-table>
       <pagination 
        v-show="total>0" 
        :total="total" 
        :pageSizes= [10,30,50,100]
        :page.sync="currentPage" 
        :limit.sync="pageLimit" 
        @pagination="getHistoryList" />

      <el-dialog title="操作详情" :visible.sync="dialogDetailVisible" fullscreen>
        <sticky :class-name="'sub-navbar'">
          <el-button @click="exportToExcel">导出</el-button>
        </sticky>

        <el-table
          :data="taskDetailHistoryData"
          border
          fit
          highlight-current-row
          class="detail-tb"
          style="width: 100%">
        <el-table-column
          prop="execip"
          label="操作对象"
          min-width="2.5%" >             
        </el-table-column>
        <el-table-column
          prop="output"
          label="OutPut"
         min-width="13.5%">
        </el-table-column>       
        <el-table-column
          prop="status"
          label="任务结果"
          min-width="4.5%"
          :filters="[{ text: '操作完成', value: 'success' }, { text: '操作失败', value: 'failed' }]"
          :filter-method="filterTaskStatus"
          filter-placement="bottom-end">
          <template slot-scope="{row,$index}">
          <el-tag v-if="row.status==='success'" class="success-button">操作完成</el-tag>
          <el-tag v-if="row.status==='failed'" class="failed-button">操作失败</el-tag>
          </template>           
        </el-table-column>
       </el-table>
       <pagination 
        v-show="detailTotal>0" 
        :total="detailTotal" 
        :pageSizes= [10,30,50,100]
        :page.sync="detailCurrentPage" 
        :limit.sync="detailPageLimit" 
        @pagination="getHistoryDetail" />               
      </el-dialog>
    </div>
  </el-form>
</template>

<script>
import Pagination from '@/components/Pagination'
import Sticky from '../../../components/Sticky'

export default {
  components: { Pagination, Sticky },
  data() {
    return {
      loading: false,
      userList : ["admin","barney"],
      listQuery:{
        user : '',
        picktime:'',
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
        },
        taskHistoryData: [],
        total: 0,
        currentPage: 1,
        pageLimit: 10,
        dialogDetailVisible:false,
        taskDetailHistoryData: [],
        detailTotal: 0,
        detailCurrentPage: 1,
        detailPageLimit: 10,        

    }
  },
  created() {
    this.getHistoryList()
    
  },
  methods: {
    historyGet(param) {
      var url = '/mgt/api/v1/task/historyinfo'
      this.loading = true
      this.$post(url, param, '获取任务历史信息失败').then((response)=> {
        this.loading = false
        this.taskHistoryData = response.Msg.slice((this.currentPage -1 ),this.currentPage - 1 + this.pageLimit)
        this.total = response.Total
      })       
    },
    historyDetailGet(param) {
      var url = '/mgt/api/v1/task/taskdetail'
      this.loading = true
      this.$post(url, param, '获取任务细节失败').then((response)=> {
        this.loading = false
        this.taskDetailHistoryData = response.Msg.slice((this.detailCurrentPage -1 ),this.detailCurrentPage - 1 + this.detailPageLimit)
        this.detailTotal = response.Total
      }) 
    },    
    getHistoryList() {
      var param= {"user":"all","starttime":"all","endtime":"all"}
      this.historyGet(param)
    },
    getHistoryDetail(taskid) {
      var param = {"taskid": taskid}
      this.historyDetailGet(param)
    },     
    handleFilter() {
      var user = "all"
      var starttime = "all"
      var endtime = "all"
      if ((this.listQuery.picktime == undefined || this.listQuery.picktime.length == 0 ) && (this.listQuery.user == undefined || this.listQuery.user == "")){
        var param= {"user":user,"starttime":starttime,"endtime":endtime}
        this.historyGet(param)
      } else if ((this.listQuery.picktime == undefined || this.listQuery.picktime.length == 0 ) && (this.listQuery.user != undefined || this.listQuery.user != "")) {
        user = this.listQuery.user
        var param= {"user":user,"starttime":starttime,"endtime":endtime}
        this.historyGet(param)
      } else if ((this.listQuery.picktime != undefined || this.listQuery.picktime.length != 0 ) && (this.listQuery.user == undefined || this.listQuery.user == "")) {
        starttime = this.listQuery.picktime[0]
        endtime = this.listQuery.picktime[1]
        var param= {"user":user,"starttime":starttime,"endtime":endtime}
        this.historyGet(param)
      } else {
        user = this.listQuery.user
        starttime = this.listQuery.picktime[0]
        endtime = this.listQuery.picktime[1]
        var param= {"user":user,"starttime":starttime,"endtime":endtime}
        this.historyGet(param)
      }
    }, 
    handleDetail(row) {
      this.dialogDetailVisible = true
      this.getHistoryDetail(row.taskid)
    },
    exportToExcel() {
      require.ensure([], () => {
      const {
        export_json_to_excel
      } = require('../../../utils/Export2Excel');
      const tHeader = ['操作对象','输出', '状态'];
      const filterVal = ['execip','output', 'status'];
      const data = this.formatJson(filterVal, this.taskDetailHistoryData);
      export_json_to_excel(tHeader, data, '任务执行结果');
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    filterTaskStatus(value, row) {
      return row.status === value
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-container {
    padding: 40px 50px 20px;

    .preview-img {
      width: 200px;
      height: 270px;
    }
    .search-container {
      margin-top: 20px;
      margin-bottom: 15px;
    }
  }  
	.success-tag {
		color: white;
		margin-top: 10px;
    width: 80px;
		background-Color: rgb(90, 173, 79);
	}
	.executing-tag {
		color: white;
		margin-top: 10px;
    width: 80px;
		background-Color: rgb(141, 194, 238);
	}  
	.failed-tag {
		color: white;
		margin-top: 10px;
    width: 80px;
		background-Color: rgb(179, 67, 67);
	}  
	.ip-tag {
		color: white;
		margin-top: 10px;
    width: 80px;
		background-Color: rgb(179, 67, 67);
  } 
	.success-button {
		color: white;
		background-Color: rgb(90, 173, 79);
  }
	.executing-button {
		color: white;
    height:30px;
    width: 80px;

		background-Color: rgb(141, 194, 238);
    .span-middle {
      display:inline-block;
      margin-top:4px;
      margin-left:2px;
      width:60px;
      text-align:center;
    }
	}  
	.failed-button {
		color: white;
		margin-top: 10px;
		background-Color: rgb(243, 99, 99);
	}
  .detail-tb {
    margin-top: 40px;
  }
</style>
