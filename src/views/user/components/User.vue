<template>
  <div >
    <sticky :class-name="'sub-navbar'">
      <el-button @click="handleAddUser">添加用户</el-button>
      <el-button @click="handleAddGroup">添加用户组</el-button>
    </sticky>
    
    <el-dialog title="添加用户" :visible.sync="dialogAddUservisible" width="45%" >              
      <div>
        <el-form label-width="140px">
          <el-form-item
            :model="addUserRequest"
            label="账户类型:"
            :required="true"
          >
            <el-select
              v-model="addUserRequest.useraccount"
              clearable
              style="width: 200px"
              class="filter-item"
            >
              <el-option
                v-for="useraccount in accountList"
                :key="useraccount"
                :label="useraccount"
                :value="useraccount"
              />
            </el-select>
          </el-form-item> 
          <el-form-item
            :model="addUserRequest"
            label="用户:"
            :required="true"
          >
            <el-input
              v-model="addUserRequest.user"
              style="width:200px;"
            />            
          </el-form-item>             
          <el-form-item
            :model="addUserRequest"
            label="用户组:"
            :required="true"
          >
            <el-select
              v-model="addUserRequest.group"
              clearable
              style="width: 200px"
              class="filter-item"
            >
              <el-option
                v-for="group in groupList"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </el-form-item> 
          <el-form-item
            v-if="addUserRequest.useraccount==='local'"
            :model="addUserRequest"
            label="密码:"
            :required="true"
          >
            <el-input
              v-model="addUserRequest.passwd"
              show-password="true"
              style="width:200px;"
            />            
          </el-form-item>                                                                                 
        </el-form>
             
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddUservisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleAddUserSubmit">
          添加
        </el-button>
      </span>
      </el-dialog> 

    <el-dialog title="添加用户组" :visible.sync="dialogAddUserGroupvisible" width="45%" >              
      <div>
        <el-form label-width="140px">
          <el-form-item
            :model="addUserGroupRequest"
            label="用户组:"
            :required="true"
          >
            <el-input
              v-model="addUserGroupRequest.group"
              style="width:200px;"
            />            
          </el-form-item>                                                                                         
        </el-form>             
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddUserGroupvisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleAddUserGroupSubmit">
          添加
        </el-button>
      </span>
      </el-dialog>

      <el-dialog title="用户设置" :visible.sync="dialogUserSettingvisible" width="50%">
      <div>
        <el-form label-width="140px">
          <el-form-item
            :model="editUserRequest"
            label="用户:"
            :required="true"
          >
            <el-input
              v-model="editUserRequest.user"
              :disabled="true"
              style="width:200px;"
            />            
          </el-form-item>
          <el-form-item
            :model="editUserRequest"
            label="用户组:"
            :required="true"
          >
            <el-select
              v-model="editUserRequest.group"
              clearable
              style="width: 200px"
              class="filter-item"
            >
              <el-option
                v-for="group in groupList"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="editUserRequest.account === 'local'"          
            :model="editUserRequest"
            label="是否重置密码:"
            :required="true"
          >
            <el-checkbox v-model="editUserRequest.checked"></el-checkbox>         
          </el-form-item>
          <el-form-item
            v-if="editUserRequest.account === 'local' && editUserRequest.checked === true"  
            :model="editUserRequest"
            label="新密码:"
            :required="true"
          >
            <el-input            
              v-model="editUserRequest.newpasswd"
              show-password="true"
              style="width:200px;"
            />            
          </el-form-item>                                                                                                                         
        </el-form>             
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUserSettingvisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleEditUserSubmit">
          修改
        </el-button>
      </span>          

      </el-dialog>


  <el-form>
    <div class="detail-container">
        <div class="search-container">
        <el-input v-model="listQuery.user" placeholder="用户" style="width: 200px;" clearable @keyup.enter.native="getUserListByParam"/>
        <el-select v-model="listQuery.group" placeholder="用户组" clearable style="width: 140px" class="filter-item">
          <el-option v-for="group in groupList" :key="group" :label="group" :value="group" />
        </el-select>
        <el-select v-model="listQuery.account" placeholder="sso/local" clearable style="width: 140px" class="filter-item">
          <el-option v-for="account in accountList" :key="account" :label="account" :value="account" />
        </el-select>        
        <el-button type="primary" icon="el-icon-search" @click="getUserListByParam">
          查询
        </el-button>            
        </div>

      <el-table
        :data="userTableData"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column
          prop="username"
          label="用户名"
          min-width="2.5%">
        </el-table-column>
        <el-table-column
          prop="usergroup"
          label="用户组"
          min-width="2.5%">            
        </el-table-column>
        <el-table-column
          prop="account"
          label="本地/SSO"
          min-width="2.5%">            
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          min-width="4.5%">            
        </el-table-column>
        <el-table-column
          prop="userexec"
          label="操作"
          min-width="4.5%">
          <template slot-scope="{row,index}">
          <el-button class="edit-button" icon="el-icon-edit" plain @click="handleEditUser(row)">编辑</el-button>
          <el-button class="delete-button" icon="el-icon-delete" plain @click="handleDelUser(row)">删除</el-button>
          </template>                        
        </el-table-column>        
    </el-table>
    </div>
  </el-form>
  </div>  
</template>

<script>
import Sticky from '../../../components/Sticky'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination, Sticky },
  data() {
    return {
      groupList:["sagroup","pegroup"],
      accountList:['sso','local'],
      listQuery:{
        user : '',
        group:'',
        account:'',
      }, 
      userTableData:[],
      total:0,
      currentPage: 1,
      pageLimit: 10,
      dialogAddUservisible: false,
      addUserRequest:{},
      dialogAddUserGroupvisible:false,
      addUserGroupRequest:{},
      dialogUserSettingvisible:false,
      editUserRequest:{},
    }
  },
  created() {
      this.getUserList()
  },
  methods: {
      userInfoGet(param) {
        var url = '/mgt/api/v1/user/userinfo'
		this.loading = true
        this.$post(url,param, '获取用户信息失败').then((response)=> {
            this.loading = false
            this.userTableData = response.Msg.slice((this.currentPage -1 ),this.currentPage - 1 + this.pageLimit)
            this.total = response.Total
        })          
      },
      getUserList() {
        var param = {'user':"all", 'group':"all",'account':"all"}
        this.userInfoGet(param)      
      },
      getUserListByParam() {
        var user = 'all'
        var group = 'all'
        var account = 'all'
        if (this.listQuery.user !== '') {
            user = this.listQuery.user      
        }
        if (this.listQuery.group !== '') {
            group = this.listQuery.group
        }
        if (this.listQuery.account !== '') {
            account = this.listQuery.account      
        }           
        var param = {'user':user, 'group':group,'account':account}        
        this.userInfoGet(param)      
      },              

      handleAddUser() {
          this.addUserRequest = {
              useraccount : "",
              user : "",
              group : "",
              passwd : "",
          }
          this.dialogAddUservisible=true
      },
      handleAddUserSubmit() {
          console.log(this.addUserRequest)
          this.dialogAddUservisible=false
      },
      handleAddGroup() {
          this.addUserGroupRequest = {
              group : ""
          }
          this.dialogAddUserGroupvisible=true
      },
      handleAddUserGroupSubmit() {
          console.log(this.addUserGroupRequest)
          this.dialogAddUserGroupvisible=false
      },
      handleEditUser(row) {
          console.log(row)
          this.editUserRequest = {
              user:row.username,
              group:row.usergroup,
              account:row.account,
              checked: false,
              newpasswd: '',
                            
          }
          console.log(this.editUserRequest)
          this.dialogUserSettingvisible = true
      },
      handleDelUser(row) {
          var user = row.username
          this.$confirm('您确定删除用户吗？').then(_ => {
            console.log(user)
            }).catch(_ => {
                console.log("取消删除用户")
            })            


      },
      handleEditUserSubmit() {
          console.log(this.editUserRequest)
          this.dialogUserSettingvisible = false
      }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
