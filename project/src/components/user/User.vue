<template>
    <div>
        <!--       面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--        卡片视图-->
        <el-card>
            <!--            搜索与添加区域-->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input clearable @clear="getUserList" placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button @click="getUserList2" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true ">添加用户</el-button>
                </el-col>
            </el-row>

            <!--            用户列表区-->
            <el-table :data="userlist" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row['mg_state']" @change="userStateChange(scope.row)">

                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column width="180" label="操作">
                    <template v-slot="scope">
                        <!--                        修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(scope.row.id)"
                        ></el-button>
                        <!--                        删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                        @click="removeUserById(scope.row.id)"></el-button>
                        <!--                        分配角色按钮-->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                       @click="setRole(scope.row)"
                            ></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--添加用户的对话框-->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            @close="addDialogClosed"
            width="50%">
<!--            内容主体区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
<!--            底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
<!--        修改用户的对话框-->
        <el-dialog
                @close="editDialogClosed"
                title="修改用户"
                :visible.sync="editDialogVisble"
                width="50%">
            <!--            内容主体区域-->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisble = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
        </el-dialog>

<!--        分配角色的对话框-->
        <el-dialog
                title="分配角色"
                :visible.sync="setDialogVisble"
                @close="setRoleClosed"
                width="50%">
            <!--            内容主体区域-->
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的角色：{{userInfo.role_name}}</p>
                <p>分配的新角色：
                    <el-select v-model="selectRoleId" placeholder="请选择">
                        <el-option v-for="item in roleslist" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
<!--            脚步-->
            <span slot="footer" class="dialog-footer">
            <el-button @click="setDialogVisble = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "User",

        data(){
            //验证邮箱的规则
            let checkMobile;
            let checkEmail = (rule, value, cb) => {
                const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                if (regEmail.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法邮箱'))
            };
            //验证手机号的规则
            checkMobile = (rule, value, cb) => {
                const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法手机号'))
            };
            return {
                //获取用户列表参数对象
                queryInfo: {
                    query: '',
                        //当前页数
                        pagenum: 1,
                        //一页显示多少条数据
                        pagesize: 5
                },
                userlist: [],
                total: 0,
                //控制添加用户对话框的显示与隐藏
                addDialogVisible:false,
                //添加用户的表单数据
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
            },
                //添加表单的验证规则对象
                addFormRules:{
                    username:[{required:true,message:'请输入用户名',trigger:'blur'},
                            {min:3,max:10,message:'用户名的长度在3~10个字符之间',trigger:'blur'}],
                        password:[{required:true,message:'请输入用户密码',trigger:'blur'},
                            {min:6,max:15,message:'用户名的长度在6~15个字符之间',trigger:'blur'}],
                        email:[{required:true,message:'请输入用户邮箱',trigger:'blur'},
                            {validator:checkEmail,trigger:'blur'}],
                        mobile:[{required:true,message:'请输入用户手机号',trigger:'blur'},
                            {validator:checkMobile,trigger:'blur'}]

                },
                //控制修改用户对话框的显示与隐藏
                editDialogVisble:false,
                //查询到的用户信息对象（修改做准备）
                editForm:{},
                //修改表单验证规则对象
                editFormRules:{
                    email:[{required:true,message:'请输入用户邮箱',trigger:'blur'},
                        {validator:checkEmail,trigger:'blur'}],
                    mobile:[{required:true,message:'请输入用户手机号',trigger:'blur'},
                        {validator:checkMobile,trigger:'blur'}]
                },
                //控制分配角色对话框的显示与隐藏
                setDialogVisble:false,
                //需分配角色的用户信息
                userInfo:{},
                //所有角色的数据列表
                roleslist:[],
                //已选择的角色ID值
                selectRoleId:'',
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            //获取用户列表数据
            async getUserList() {
                let res = await this.$http.get('users', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error('获取用户列表失败');
                this.userlist = res.data.users;
                this.total = res.data.total;

            },
            //监听pagesize改变的事件
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            //监听 页码值 改变的事件
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            //监听Switch开关状态的改变
            async userStateChange(userInfo) {
                let res = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                if (res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error('更新用户状态失败!')
                } else {
                    this.$message.closeAll()
                    this.$message.success('更新用户状态成功~')
                }
            },

            //监听点击按钮搜索用户
            getUserList2() {
                this.queryInfo.pagenum = 1;
                this.getUserList()
            },

            //监听添加用户对话框关闭事件
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },

            //点击按钮添加新用户
            addUser(){
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid) return;
                    //可以发起添加用户的请求，调用接口
                    let res = await this.$http.post('users',this.addForm)
                    if (res.meta.status !== 201) return this.$message.error('添加用户失败')
                    this.$message.success('添加用户成功')
                    //隐藏用户添加对话框
                    this.addDialogVisible = false
                    //刷新用户列表
                    this.getUserList()
                })

            },
            //展示编辑用户对话框
            async showEditDialog(id){
                let res = await this.$http.get('users/'+id)
                if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
                this.editForm = res.data
                this.editDialogVisble = true
            },

            //监听用户修改后的关闭事件
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },
            //修改用户信息并提交
            editUser(){
                this.$refs.editFormRef.validate(async valid=>{
                    if(!valid) return;
                    //可以发起添加用户的请求，调用接口
                    let res = await this.$http.put('users/'+this.editForm.id,{
                        email:this.editForm.email,
                        mobile:this.editForm.mobile
                    })
                    if (res.meta.status !== 200) return this.$message.error('修改用户失败')
                    this.$message.success('修改用户成功')
                    //隐藏用户添加对话框
                    this.editDialogVisble = false
                    //刷新用户列表
                    this.getUserList()
                })
            },

            //根据id删除对应的用户信息
            async removeUserById(id){
                //弹框询问是否删除用户
                const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).catch(err=>err)
                if(confirmResult !== 'confirm')return this.$message.info('已经取消删除')
                let res = await this.$http.delete('users/'+id)
                if(res.meta.status !== 200) return this.$message.error('删除用户失败')
                this.$message.success('删除用户成功')
                this.getUserList()
            },

            //点击展示分配角色对话框
            async setRole(userInfo){
                this.userInfo = userInfo
                //获取所有的角色列表
                let res = await this.$http.get('roles')
                if(res.meta.status !== 200)  return  this.$message.error('获取角色列表失败')
                //保存数据
                this.roleslist = res.data
                //展示对话框
                this.setDialogVisble = true
            },
            //点击按钮分配角色
            async saveRoleInfo(){
                if (!this.selectRoleId)  return this.$message.error('请选择要分配的角色！')
                //获取所有的角色列表
                let res = await this.$http.put(`users/${this.userInfo.id}/role`,{
                    rid:this.selectRoleId
                })
                if(res.meta.status !== 200)  return  this.$message.error('更新用户角色失败')
                this.$message.success('更新用户角色成功')
                this.getUserList()
                this.setDialogVisble = false
            },

            //关闭修改角色对话框
            setRoleClosed(){
                this.selectedRoleId=''
                this.userInfo = {}
            }
        }


    }
</script>

<style scoped>

</style>