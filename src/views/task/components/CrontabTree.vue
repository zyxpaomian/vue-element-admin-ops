<template>
  <div>
    <sticky :class-name="'sub-navbar'">
      <vxe-toolbar class="vxebutton">
        <template v-slot:buttons>
          <vxe-button @click="$refs.xTree.setAllTreeExpansion(true)">展开所有</vxe-button>
          <vxe-button @click="$refs.xTree.clearTreeExpand()">关闭所有</vxe-button>
          <vxe-button @click="handleAdd">添加任务</vxe-button>
        </template>
      </vxe-toolbar>
    </sticky>

    <vxe-table
      class="vxetable"
      resizable
      tree-config
      border="inner"
      ref="xTree"
      :data="tableData"
    >
      <vxe-table-column
        field="taskType"
        title="任务类型"
        tree-node
      ></vxe-table-column>
      <vxe-table-column
        field="taskName"
        title="任务名称"
      ></vxe-table-column>
      <vxe-table-column
        field="taskcir"
        title="任务周期"
      ></vxe-table-column>
      <vxe-table-column
        field="taskurl"
        title="任务Url"
      ></vxe-table-column>
      <vxe-table-column
        field="taskargs"
        title="任务参数"
      ></vxe-table-column>
      <vxe-table-column
        slot-scope="{row,$index}"
        v-if="row.type === ''"
        field="type"
        title="节点类型"
      ></vxe-table-column>
      <vxe-table-column
        field="taskcfg"
        title="操作"
      >
        <template slot-scope="{row,$index}">
          <el-button
            class="modify-button"
            v-if="row.type === 'leaf'"
            @click="handleEdit(row)"
          >修改</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <el-dialog
      title="修改"
      :visible.sync="dialogExecvisible"
      width="45%"
    >
      <div>
        <el-form label-width="140px">
          <el-form-item
            :model="modifyRequest"
            label="任务名称:"
            :required="true"
          >
            <el-input
              v-model="modifyRequest.taskName"
              style="width:200px;"
            />
          </el-form-item>
          <el-form-item
            :model="modifyRequest"
            label="接口Url:"
            :required="true"
          >
            <el-input
              v-model="modifyRequest.taskurl"
              style="width:200px;"
            />
          </el-form-item>
          <el-form-item
            :model="modifyRequest"
            label="接口参数:"
            :required="true"
          >
            <el-input
              v-model="modifyRequest.taskargs"
              style="width:200px;"
            />
          </el-form-item>
          <el-form-item
            :model="modifyRequest"
            label="执行周期:"
            :required="true"
          >
            <el-input
              placeholder="秒 分 时 日 月 周"
              v-model="modifyRequest.taskcir"
              style="width:200px;"
            />
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogExecvisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleEditSubmit"
        >
          提交
        </el-button>
      </span>
    </el-dialog>


    <el-dialog
      title="添加"
      :visible.sync="dialogAddvisible"
      width="45%"
    >
      <div>
        <el-form label-width="140px">
          <el-form-item
            :model="addRequest"
            label="任务大类/小类:"
            :required="true"
          >
            <el-select
              v-model="addRequest.tabletype"
              clearable
              style="width: 130px"
              class="filter-item"
            >
              <el-option
                v-for="tabletype in typeList"
                :key="tabletype"
                :label="tabletype"
                :value="tabletype"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="addRequest.tabletype === 'master'"
            :model="addRequest"
            label="任务类型:"
            :required="true"
          >
            <el-input
              v-model="addRequest.tasktype"
              style="width:200px;"
            />
          </el-form-item>
          <el-form-item
            v-if="addRequest.tabletype === 'leaf'"
            :model="addRequest"
            label="任务类型:"
            :required="true"
          >
            <el-select
              v-model="addRequest.taskType"
              clearable
              style="width: 90px"
              class="filter-item"
            >
              <el-option
                v-for="tasktype in taskTypeList"
                :key="tasktype"
                :label="tasktype"
                :value="tasktype"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="addRequest.tabletype === 'leaf'"
            :model="addRequest"
            label="任务名称:"
            :required="true"
          >
            <el-input
              v-model="addRequest.taskName"
              style="width:200px;"
            />
          </el-form-item>
          <el-form-item
            v-if="addRequest.tabletype === 'leaf'"
            :model="addRequest"
            label="接口Url:"
            :required="true"
          >
            <el-input
              v-model="addRequest.taskurl"
              style="width:200px;"
            />
          </el-form-item>
          <el-form-item
            v-if="addRequest.tabletype === 'leaf'"
            :model="addRequest"
            label="接口参数:"
            :required="true"
          >
            <el-input
              v-model="addRequest.taskargs"
              style="width:200px;"
            />
          </el-form-item>
          <el-form-item
            v-if="addRequest.tabletype === 'leaf'"
            :model="addRequest"
            label="执行周期:"
            :required="true"
          >
            <el-input
              placeholder="秒 分 时 日 月 周"
              v-model="addRequest.taskcir"
              style="width:200px;"
            />
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAddvisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleAddSubmit"
        >
          提交
        </el-button>
      </span>
    </el-dialog>    


  </div>
</template>

<script>
import Sticky from "../../../components/Sticky";
export default {
  components: { Sticky },
  data() {
    return {
      taskTypeList: ["服务器类", "存储类"],
      typeList: ["master", "leaf"],
      tableData: [
        {
          taskType: "服务器类",
          taskName: "",
          taskcir: "",
          taskurl: "",
          taskargs: "",
          type: "master",
          children: [
            {
              taskType: "服务器类",
              taskName: "任务A",
              taskcir: "* * * */3",
              taskurl: "www.baidu.com",
              taskargs: "{a:b}",
              type: "leaf"
            },
            {
              taskType: "服务器类",
              taskName: "任务B",
              taskcir: "* * * */4",
              taskurl: "www.qq.com",
              taskargs: "{a:b}",
              type: "leaf"
            }
          ]
        }
      ],
      dialogExecvisible: false,
      dialogAddvisible: false,
      modifyRequest: {},
      addRequest: {}
    };
  },
  created() {},
  methods: {
    getTreeExpansionEvent() {
      let treeExpandRecords = this.$refs.xTree.getTreeExpandRecords();
      this.$XModal.alert(treeExpandRecords.length);
    },
    handleEdit(row) {
      this.dialogExecvisible = true;
      this.modifyRequest = {
        taskName: row.taskName,
        taskcir: row.taskcir,
        taskurl: row.taskurl,
        taskargs: row.taskargs
      };
    },
    handleAdd() {
      this.dialogAddvisible = true;
      this.addRequest = {
        taskName: "",
        taskcir: "",
        taskurl: "",
        taskargs: "",
        tabletype : "",
      };      
    },
    handleEditSubmit() {
      console.log(this.modifyRequest);
    },
    handleAddSubmit() {
      console.log(this.addRequest);
    }
  }
};
</script>

<style lang="scss" scoped>
.vxebutton {
  margin-left: 10px;
}
.vxetable {
  margin-top: 20px;
  margin-left: 10px;
}
.modify-button {
  color: white;
  margin-top: 10px;
  width: 80px;
  background-color: rgb(141, 194, 238);
}
</style>

