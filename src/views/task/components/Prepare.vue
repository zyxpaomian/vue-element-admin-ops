<template>
  <div >
    <sticky :class-name="'sub-navbar'">
      <el-button @click="blackipmgt">黑名单</el-button>
    </sticky>

    <el-dialog title="IP黑名单" :visible.sync="dialogBlackIpVisible" fullscreen="">
      <Blackip />
    </el-dialog>


    <el-steps :active="active" class="step-container" finish-status="success">
      <el-step title="操作对象选择"></el-step>
      <el-step title="操作任务选择"></el-step>
      <el-step title="确认并执行"></el-step>
    </el-steps>
    <div class="form-container" v-if="active===0">
       <el-form label-width="400px" >
          <el-form-item label="对象类型:" :model="execrequest" :required="true">
            <el-select v-model="execrequest.objecttype" placeholder="操作对象" clearable style="width: 400px" class="filter-item">
              <el-option v-for="type in objecttypelist" :key="type" :label="type" :value="type"/>
            </el-select>
          </el-form-item>   
          <el-form-item label="操作环境:" :model="execrequest" :required="true" >
            <el-select v-model="execrequest.objectenv" placeholder="操作环境"  clearable style="width: 400px" class="filter-item">
              <el-option v-for="env in objectenvlist" :key="env" :label="env" :value="env" />
            </el-select>            
          </el-form-item>
          <el-form-item label="操作IP:" v-if="execrequest.objecttype==='IP'" :required="true" >  
            <el-input type="textarea" :rows="2" v-model="execrequest.objectIp" placeholder="请输入执行的IP" style="width: 400px" />
          </el-form-item>     
          <el-form-item label="操作对象IDC:" v-if="execrequest.objecttype==='ENV' && execrequest.objectenv !='STG'" :required="true" >
            <el-checkbox-group v-model="execrequest.objectDetailTypeList" @change="showvalue">
              <el-checkbox v-for="idc in objecttypeIdclist" :label="idc" :key="idc">{{idc}}</el-checkbox>
            </el-checkbox-group>           
          </el-form-item>
          <el-form-item label="操作对象应用:" v-if="execrequest.objecttype==='ENV'" :required="true" >
           <el-select v-model="execrequest.objectDetailAppList" placeholder="操作APP"  clearable style="width: 400px" class="filter-item">
              <el-option v-for="app in objecttypeApplist" :label="app" :key="app" :value="app" />
            </el-select>                  
          </el-form-item>
          <el-form-item label="操作对象应用环境:" v-if="execrequest.objecttype==='ENV' && execrequest.objectenv !='STG'" :required="true" >
            <el-checkbox-group v-model="execrequest.objectDetailAppEnvList" >
              <el-checkbox v-for="appenv in objectDetailAppEnvList" :label="appenv" :key="appenv">{{appenv}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item >
            <el-button style="margin-top: 32px; margin-left: 330px;" @click="next">下一步</el-button> 
          </el-form-item>            
        </el-form> 
                        
    </div>
     <div class="form-container" v-if="active===1">
       <el-form label-width="400px" >
          <el-form-item label="任务类型:" :required="true">
            <el-select v-model="execrequest.taskType" placeholder="任务" clearable style="width: 400px" class="filter-item">
              <el-option v-for="type in taskTypeList" :key="type" :label="type" :value="type"/>
            </el-select>
          </el-form-item> 
          <el-form-item label="固定任务列表:" v-if="execrequest.taskType==='固定任务'" :required="true" >
           <el-select v-model="execrequest.taskName" placeholder="任务名"  clearable style="width: 400px" class="filter-item">
              <el-option v-for="task in taskList" :label="task" :key="task" :value="task" />
            </el-select>                  
          </el-form-item>

          <el-form-item label="临时任务:" v-if="execrequest.taskType==='临时任务'" :required="true" >
            <el-input type="textarea" :rows="2" v-model="execrequest.taskCmd" placeholder="请输入临时执行的命令" style="width: 400px" />
          </el-form-item> 

          <el-form-item label="同步/异步:" v-if="execrequest.taskType!=''" :required="true" >
           <el-select v-model="execrequest.taskExectype" placeholder="同步/异步"  clearable style="width: 400px" class="filter-item">
              <el-option v-for="sync in taskExectype" :label="sync" :key="sync" :value="sync" />
            </el-select>                  
          </el-form-item>
                   
          <el-form-item >
            <el-button style="margin-top: 32px; margin-right: 160px;" @click="previous">上一步</el-button> 
            <el-button style="margin-top: 32px; margin-left: 100px;" @click="next">下一步</el-button> 
          </el-form-item>           
        </el-form>                  
    </div>
    <div class="form-container" v-if="active===2">
       <el-form label-width="400px" >
          <el-form-item label="任务类型:">
            <i>{{execrequest.taskExectype}}</i>
          </el-form-item>

          <el-form-item label="任务命令:">
            <i>{{execrequest.taskCmd}}</i>
          </el-form-item>

          <el-form-item label="任务IP:" >
            <el-input disabled type="textarea" :rows="2" v-model="execrequest.objectIp" placeholder="请输入临时执行的命令" style="width: 400px" />
          </el-form-item> 
                   
          <el-form-item >
            <el-button style="margin-top: 32px; margin-right: 160px;" @click="previous">上一步</el-button> 
            <el-button type="primary" style="margin-top: 32px; margin-left: 90px;" @click="next">确认执行</el-button> 
          </el-form-item>           
        </el-form>                   
    </div>                  
</div>
</template>

<script>
import Sticky from '../../../components/Sticky'
import Blackip from './Blackip'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination, Sticky, Blackip },
  data() {
    return {
      active:0,
      dialogBlackIpVisible: false,
      objecttypelist : ["IP","ENV"],
      objectenvlist : ["PROD","STG"],
      objecttypeIdclist: ["BX","WGQ"],
      objecttypeApplist: ["APP1","APP2","ALL"],
      objectDetailAppEnvList: ["PROD","UAT","HD"],

      taskTypeList: ["固定任务","临时任务"],
      taskList: ["TASKA","TASKB"],
      taskExectype: ["SYNC","RSYNC"],
    
      execrequest: {
        objecttype : "",
        objectenv: "",
        objectIp: "",
        objectDetailType:"",
        objectDetailTypeList: [],
        objectDetailAppList: [],
        objectDetailAppEnvList: [],
        taskType: "",
        taskName: "",
        taskCmd: "",
        taskExectype: "",
      },
    }
  },
  created() {
  },
  methods: {
    showvalue() {
      console.log(this.execrequest.objectDetailTypeList)
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    previous() {
      if (this.active-- < 0) this.active = 0;
    },
    blackipmgt() {
      this.dialogBlackIpVisible = true
    }

  }
}
</script>

<style lang="scss" scoped>
  .step-container {
    padding: 40px 400px 10px;

  }
  .form-container {
    padding: 50px 230px 10px ;
  }  


</style>
