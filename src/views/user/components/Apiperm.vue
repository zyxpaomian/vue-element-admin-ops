<template>
  <div>
    <sticky :class-name="'sub-navbar'">
      <vxe-toolbar class="vxebutton">
        <template v-slot:buttons>
          <vxe-button @click="$refs.xTree.setAllTreeExpansion(true)">展开所有</vxe-button>
          <vxe-button @click="$refs.xTree.clearTreeExpand()">关闭所有</vxe-button>
        </template>
      </vxe-toolbar>
    </sticky>

    <el-dialog :title="editGroupName" :visible.sync="dialogExecvisible" fullscreen>
  <el-form>
    <div class="detail-container">
        <div class="search-container">
        <el-input v-model="apiurl" placeholder="apiurl" style="width: 200px;" />       
        <el-button type="primary" icon="el-icon-plus" @click="addApi2User">
          添加
        </el-button>
        <el-button v-if="multipleSelection.length != 0" type="danger" icon="el-icon-minus" @click="delApi2User">
          删除
        </el-button>                         
        </div>

      <el-table
        :data="userTableData"
        border
        fit
        highlight-current-row
        style="width: 90%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          min-width="30%">
        </el-table-column>
        <el-table-column
          prop="api"
          label="接口URL"
          min-width="70%">
        </el-table-column>    
    </el-table>
    </div>
  </el-form>      
    </el-dialog>

    <vxe-table
      class="vxetable"
      resizable
      tree-config
      border="inner"
      ref="xTree"
      :data="tableData"
    >
      <vxe-table-column
        field="groupname"
        title="用户组"
        tree-node
      ></vxe-table-column>   
      <vxe-table-column
        field="api"
        title="Url路径"
      ></vxe-table-column>
      <vxe-table-column
        field="exec"
        title="操作"
      >
        <template slot-scope="{row,$index}">
          <el-button
            class="modify-button"
            v-if="row.type === 'master'"
            @click="handleEdit(row)"
          >编辑</el-button>        
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import Sticky from "../../../components/Sticky";
export default {
  components: { Sticky },
  data() {
    return {
      tableData: [
        {
          groupname: "GroupA",
          api: "",
          type: "master",
          children: [
            {
          groupname: "GroupA",
          api: "api/v1/task/1",
          type: "leaf",
            },
            {
          groupname: "GroupA",
          api: "api/v1/task/2",
          type: "leaf",
            }
          ]
        }
      ],
      dialogExecvisible: false,
      modifyRequest: {},
      multipleSelection: [],
      userTableData:[],
      apiurl:"",
      editGroupName:"",
    };
  },
  created() {},
  methods: {
    getTreeExpansionEvent() {
      let treeExpandRecords = this.$refs.xTree.getTreeExpandRecords();
      this.$XModal.alert(treeExpandRecords.length);
    },
    handleEdit(row) {
      this.editGroupName = ""
      this.userTableData = []
      this.dialogExecvisible = true;
      for (var urlpath in row.children) {
        this.userTableData.push(
            {"api":row.children[urlpath].api}
        )
      }
      this.editGroupName = row.children[0].groupname
    },     
    handleEditSubmit() {
      console.log(this.modifyRequest);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },
    addApi2User() {
        for (var newurlindex in this.userTableData) {
            if (this.apiurl === this.userTableData[newurlindex].api) {
                this.$message.error("数据重复")
                return
            }
        }
        this.userTableData.push({"api":this.apiurl})
    },
    delApi2User() {
        //console.log(this.userTableData)
        var tmplist = []
        for (var urlindex in this.userTableData) {
            for (var delurlindex in this.multipleSelection) {
                if (this.userTableData[urlindex] != this.multipleSelection[delurlindex] ) {
                    tmplist.push({"api": this.userTableData[urlindex]})
                    //this.userTableData.remove(this.multipleSelection[delurlindex])
                }
            }
        }
        this.userTableData  =[]
        for (var tmpindex in tmplist) {
          this.userTableData.push(tmplist[tmpindex])
        }
        console.log(tmplist)
        this.userTableData = tmplist
        console.log(this.userTableData)
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
.delete-button {
	color: white;
	margin-top: 10px;
	width: 80px;
	background-Color: rgb(179, 67, 67);
}
.detail-container {
    padding: 0px 50px 20px;

    .preview-img {
      width: 200px;
      height: 270px;
    }
    .search-container {
      margin-top: 20px;
      margin-bottom: 15px;
    }
  }
</style>

