<template>
  <el-form ref="searchForm" :model="searchForm" >
    <div class="detail-container">
      <div class="search-container">
        <el-input v-model="listQuery.ip" placeholder="IP" style="width: 200px;" @keyup.enter.native="handleFilter"/>
        <el-select v-model="listQuery.idc" placeholder="IDC" clearable style="width: 90px" class="filter-item">
          <el-option v-for="idc in idcList" :key="idc" :label="idc" :value="idc" />
        </el-select>
        <el-select v-model="listQuery.zone" placeholder="区域" clearable style="width: 90px" class="filter-item">
          <el-option  v-for="zone in zoneList" :key="zone" :label="zone" :value="zone" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-checkbox v-model="showMgt" class="filter-item" style="margin-left:15px;" @change="showMgtCloumn">
          管理
        </el-checkbox>
        <el-button v-if="multipleSelection.length !=0" class="exec-button" icon="el-icon-caret-right" @click="handleMultiExec">
          批量执行
        </el-button>
        <el-button v-if="multipleSelection.length !=0" class="multidel-button" icon="el-icon-delete" @click="handleMultiDel">
          批量删除
        </el-button>                    
      </div>

      <el-table
        :data="agentTableData"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          min-width="1.5%">
        </el-table-column>
        <el-table-column
          prop="agentnum"
          label="序号"
          min-width="1.5%">
        </el-table-column>
        <el-table-column
          prop="agentip"
          label="IP"
          min-width="4.5%" > 
        <template slot-scope="{row}">
          <span class="link-type" @click="handleDetail(row)">{{ row.agentip }}</span>
        </template>             
        </el-table-column>
        <el-table-column
          prop="agentidc"
          label="IDC"
         min-width="3.5%">
        </el-table-column>
        <el-table-column
          prop="agentzone"
          label="区域"
          min-width="3.5%">
        </el-table-column>                  
        <el-table-column
          prop="agentstatus"
          label="状态"
          min-width="3.5%">
          <template slot-scope="{row,$index}">
          <el-tag class="alive-tag" v-if="row.agentstatus === 0" >Alive</el-tag>
          <el-tag v-else-if="row.agentstatus === 1" class="dead-tag">Dead</el-tag>
          <el-tag v-else type="warning">Unknown</el-tag>
          </template>          
        </el-table-column>
        <el-table-column
          prop="pingswitch"
          label="ping探测"
          min-width="3.5%">
          <template slot-scope="{row,$index}">
          <el-tag class="alive-tag" v-if="row.pingswitch === 0" >ON</el-tag>
          <el-tag v-else-if="row.pingswitch === 1" class="dead-tag">OFF</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="tcpswitch"
          label="tcp探测"
          min-width="3.5%">
          <template slot-scope="{row,$index}">
          <el-tag class="alive-tag" v-if="row.tcpswitch === 0" >ON</el-tag>
          <el-tag v-else-if="row.tcpswitch === 1" class="dead-tag">OFF</el-tag>    
          </template>          
        </el-table-column>  
        <el-table-column
          prop="tcpdumpswitch"
          label="流量镜像"
          min-width="3.5%">
          <template slot-scope="{row,$index}">
          <el-tag class="alive-tag" v-if="row.tcpdumpswitch === 0" >ON</el-tag>
          <el-tag v-else-if="row.tcpdumpswitch === 1" class="dead-tag">OFF</el-tag>   
          </template>          
        </el-table-column>                          
        <el-table-column
          v-if="showMgt"
          prop="agentedit"
          label="管理"
          min-width="8.5%">
          <template slot-scope="{row,$index}">
          <el-button class="edit-button" icon="el-icon-edit" plain @click="handleEdit(row)">Edit</el-button>
          <el-button class="delete-button" icon="el-icon-delete" plain @click="handleDel(row)">Delete</el-button>
          </template>           
        </el-table-column>
      </el-table>
       <pagination 
        v-show="total>0" 
        :total="total" 
        :pageSizes= [10,30,50,100]
        :page.sync="currentPage" 
        :limit.sync="pageLimit" 
        @pagination="getAgentList" />

      <el-dialog title="编辑" :visible.sync="dialogEditVisible" width="40%">
       <el-form label-width="140px" >
          <el-form-item label="IP:" :model="temp" :required="true">
            <el-input v-model="temp.ip" :disabled="true" style="width:200px;"/>
          </el-form-item>
          <el-form-item label="IDC:" :model="temp" :required="true">
            <el-input v-model="temp.idc" style="width:200px;"/>
          </el-form-item> 
          <el-form-item label="网络区域:" :model="temp" :required="true">         
            <el-input v-model="temp.zone" style="width:200px;"/>
          </el-form-item>
          <el-form-item label="Ping探测:" :model="temp" :required="true">
            <el-switch
              v-model="temp.pingswitch"
              active-text="ON"
              inactive-text="OFF">
            </el-switch>
          </el-form-item>
          <el-form-item label="Tcp探测:" :model="temp" :required="true">
            <el-switch
              v-model="temp.tcpswitch"
              active-text="ON"
              inactive-text="OFF">
            </el-switch>
          </el-form-item>
          <el-form-item label="流量镜像:" :model="temp" :required="true">
            <el-switch
              v-model="temp.tcpdumpswitch"
              active-text="ON"
              inactive-text="OFF">
            </el-switch>
          </el-form-item>                          
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="handleEditSubmit">
            修改
          </el-button>
        </span>     
      </el-dialog>

      <el-dialog title="客户端详情" :visible.sync="dialogDetailvisible" width="45%" >
      <div >
      <template>
        <el-table
          :data="tempDetail"
          style="width: 100%"
          :show-header="false"
        >
        <el-table-column
          prop="ip"
          min-width="1.5%">
          <template slot-scope="{row,$index}">
            <el-col :span="12"><i class="iconfont admin-iconip">IP: {{row.ip}}</i></el-col>
          </template>
        </el-table-column>
        <el-table-column
          prop="hn"
          min-width="1.5%">
          <template slot-scope="{row,$index}">
            <el-col :span="12"><i class="iconfont admin-iconzhuji">HN: {{row.hn}}</i></el-col>
          </template>          
        </el-table-column>
        </el-table>
      </template>
      </div>

      <div class="tb-top">
      <template >
        <el-table
          :data="tempDetail"
          style="width: 100%"
          :show-header="false"
        >
        <el-table-column
          prop="cpu"
          min-width="1.5%">
          <template slot-scope="{row,$index}">
            <el-col :span="12"><i class="iconfont admin-iconcpu">CPU: {{row.cpu}} Core</i></el-col>
          </template>
        </el-table-column>
        <el-table-column
          prop="mem"
          min-width="1.5%">
          <template slot-scope="{row,$index}">
            <el-col :span="12"><i class="iconfont admin-iconauto">MEM: {{row.mem}} G</i></el-col>
          </template>          
        </el-table-column>
        </el-table>
      </template>
      </div>                

      <div class="tb-top">
        <el-form >
          <el-form-item>
            <el-col :span="12"><i class="iconfont admin-iconconfig-command tb-top">  CMD:</i></el-col>        
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" :rows="2" v-model="taskExec.cmd" placeholder="请输入执行的命令" style="width: 100%" @keyup.enter.native="handleFilter"/>
          </el-form-item>          
        </el-form>        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailvisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleEditSubmit">
          执行
        </el-button>
      </span>
      </el-dialog>

      <el-dialog title="批量执行" :visible.sync="dialogExecvisible" width="45%" >              
      <div>
        <el-form >
          <el-form-item>
            <el-col :span="12"><i class="iconfont admin-iconconfig-command tb-top">  CMD:</i></el-col>        
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" :rows="2" v-model="taskExec.cmd" placeholder="请输入执行的命令" style="width: 100%" @keyup.enter.native="handleFilter"/>
          </el-form-item>          
        </el-form>        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogExecvisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleExecSubmit">
          执行
        </el-button>
      </span>
      </el-dialog>      

    </div>
  </el-form>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      loading: false,
      idcList: ["宝信","外高桥"],
      zoneList: ["BC","FS"],
      agentTableData:[],
      multipleSelection:[],
      searchForm: {},
      showMgt: true,
      dialogEditVisible: false,
      dialogDetailvisible: false,
      dialogExecvisible: false,
      values1:false,
      total: 0,
      currentPage: 1,
      pageLimit: 10,
      listQuery:{
        ip : '',
        idc:'',
        zone:'',
      },
      temp:{},
      tempDetail:[],
      taskExec:{
        ipstr:"",
        cmd:"",
      }
    }
  },
  created() {
    this.getAgentList()
    
  },
  methods: {
    agentGet(param){
      var url = '/mgt/api/v1/agent/agentinfo'
		  this.loading = true
      this.$post(url,param, '获取agent信息失败').then((response)=> {
        this.loading = false
        this.agentTableData = response.Msg.slice((this.currentPage -1 ),this.currentPage - 1 + this.pageLimit)
        this.total = response.Total
      })
    },
    getAgentList() {
      var param = {'ip':"all", 'idc':"all", 'zone':"all"}
      this.agentGet(param)      
    },
    handleFilter(){
      var ip = 'all'
      var idc = 'all'
      var zone = 'all'
      if (this.listQuery.ip !== '') {
        ip = this.listQuery.ip      
      }
      if (this.listQuery.idc !== '') {
        idc = this.listQuery.idc
      }
      if (this.listQuery.zone !== '') {
        zone = this.listQuery.zone      
      }            
      var param = {'ip':ip, 'idc':idc, 'zone':zone}
      this.agentGet(param)
    },    
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleMultiExec() {
      this.dialogExecvisible = true
      var ipstr = ""
      for (var v in this.multipleSelection)
      {  
        ipstr = this.multipleSelection[v].agentip + "," + ipstr
      }
      this.taskExec.ipstr = ipstr
    }, 
    handleMultiDel() {
      var ipstr = ""
      for (var v in this.multipleSelection)
      {  
        ipstr = this.multipleSelection[v].agentip + "," + ipstr
      }
      this.$confirm('您确定批量删除吗？').then(_ => {
        console.log(ipstr)
      }).catch(_ => {
        console.log("取消批量删除删除")
      })        
    },          

    handleEdit(row){
      this.dialogEditVisible = true
      this.temp ={
        'ip' : row.agentip,
        'idc' : row.agentidc,
        'zone' : row.agentzone,
        'pingswitch': false,
        'tcpswitch': false,
        'tcpdumpswitch': false,
      }
      if (row.pingswitch == 0 ) {
        this.temp.pingswitch = true
      }
      if (row.tcpswitch == 0 ) {
        this.temp.tcpswitch = true
      }
      if (row.tcpdumpswitch == 0 ) {
        this.temp.tcpdumpswitch = true
      } 
    },
    handleDel(row){
      this.$confirm('您确定删除吗？').then(_ => {
        var ipstr = row.agentip
      }).catch(_ => {
        console.log("取消删除")
      })      
    },
    handleDetail(row){
      this.dialogDetailvisible = true
      var tempDetaila = {
        'ip' : row.agentip,
        'hn' : "test123",
        'cpu' : 4,
        'mem' : 8,
      }
      this.tempDetail[0]=tempDetaila
    },    
    handleEditSubmit() {
      console.log("submit")
      this.dialogEditVisible=false
    },
    handleExecSubmit(){
      console.log(this.taskExec)
      this.dialogExecvisible=false
    },
    showMgtCloumn(value){
      this.showMgt = value
    },
   
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
	.alive-tag {
		color: white;
		margin-top: 10px;
    width: 80px;
		background-Color: rgb(90, 173, 79);
	}
	.dead-tag {
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
	.exec-button {
		color: white;
		background-Color: rgb(90, 173, 79);
  }
	.multidel-button {
		color: white;
		background-Color: rgb(179, 67, 67);
	}     
	.switchon-button {
		color: white;
		margin-top: 10px;
		//width: 90px;
		background-Color: rgb(90, 173, 79);
	}
	.switchoff-button {
		color: white;
		margin-top: 10px;
		//width: 90px;
		background-Color: rgb(179, 67, 67);
	}
	.edit-button {
		color: white;
		margin-top: 10px;
		//width: 90px;
		background-Color: rgb(76, 114, 218);
	}
	.detail-button {
		color: white;
		margin-top: 10px;
		//width: 90px;
		background-Color: rgb(90, 173, 79);
	}
	.delete-button {
		color: white;
		margin-top: 10px;
		//width: 90px;
		background-Color: rgb(179, 67, 67);
	}
  .tb-top {
    margin-top: 40px;
  }
  .detail-dialog {
    background: red !important;
    //background-Color: rgb(219, 65, 98);
  }
</style>
