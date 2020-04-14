<template>
  <div>
    <el-dialog
      title="添加黑名单"
      :visible.sync="dialogAddBlackvisible"
      fullscreen
    >
      <el-form label-width="140px">
        <el-form-item
          label="IP:"
          :required="true"
        >
          <el-input
            :model="blackIp"
            style="width:200px;"
          />
        </el-form-item>
        <el-form-item
          label="Remark:"
          :required="true"
        >
          <el-input
            :model="remark"
            style="width:200px;"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAddBlackvisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="addBlackIp"
        >
          添加
        </el-button>
      </span>
    </el-dialog>
    <el-form>
      <div class="detail-container">
        <div class="search-container">
          <el-input
            :model="blackIp"
            placeholder="IP"
            style="width: 200px;"
            @keyup.enter.native="addBlackIp"
          />
          <el-input
            :model="remark"
            placeholder="备注"
            style="width: 400px;"
            @keyup.enter.native="addBlackIp"
          />

          <el-button
            type="primary"
            @click="addBlackIp"
          >
            添加
          </el-button>
        </div>
        <el-table
          :data="blackIpTable"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            prop="ip"
            label="IP"
            min-width="25%"
          >
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="25%"
          >
          </el-table-column>
          <el-table-column
            prop="adduser"
            label="添加人"
            min-width="25%"
          >
          </el-table-column>
          <el-table-column
            prop="exec"
            label="操作"
            min-width="25%"
          >
            <template slot-scope="{row,$index}">
              <el-button class="del-button">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>

</template>

<script>
export default {
  data() {
    return {
      loading: false,
      blackIpTable: [],
      dialogAddBlackvisible: false,
      blackIp: "",
      remark: "",
    };
  },
  created() {
    this.getBlackIpList();
  },
  methods: {
    getBlackIpList() {
      var url = "/mgt/api/v1/task/blackiplist";
      this.loading = true;
      this.$get(url, {}, "获取ip黑名单失败").then(response => {
        this.loading = false;
        this.blackIpTable = response.Msg;
      });
    },
    delBlackIp(row) {
      console.log("del ip");
    },
    addBlackIp(row) {
      this.dialogAddBlackvisible = true;
      console.log("add ip");
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-container {
  padding: 0px 50px 20px;
  .search-container {
    margin-top: 0px;
    margin-bottom: 15px;
  }
}
.del-button {
  color: white;
  background-color: rgb(179, 67, 67);
}
</style>
