<template>
    <div>
        <!--       面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

<!--        卡片视图-->
        <el-card>
<!--            添加角色按钮区域-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showRoleForm">添加角色</el-button>
                </el-col>
            </el-row>
<!--            -->
            <el-table :data="rolelist" border stripe>
<!--                展开列-->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row :class="['bdbottom',i1 === 0? 'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
<!--                            渲染一级权限-->
                            <el-col :span="4">
                                <el-tag closable
                                        @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
<!--                            渲染二级和三级权限-->
                            <el-col :span="19">
<!--                                通过for循环 嵌套渲染二级权限-->
                                <el-row :class="[i2 !== 0? 'bdtop':'','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="5">
                                        <el-tag type="success"
                                                closable
                                                @close="removeRightById(scope.row,item2.id)"
                                        >{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children"
                                                :key="item3.id" closable
                                                @close="removeRightById(scope.row,item3.id)"
                                        >
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
<!--                索引列-->
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" prop="level">
                    <template v-slot="scope">
                        <el-button size="mini" type="primary"
                                   icon="el-icon-edit"
                                   @click="showEditForm(scope.row.id)"
                        >编辑</el-button>
                        <el-button size="mini" type="danger"
                                   icon="el-icon-delete"
                                   @click="removeRole(scope.row.id)"
                        >删除</el-button>
                        <el-button size="mini" type="warning"
                                   icon="el-icon-setting"
                                       @click="showSetRightDialog(scope.row)"
                        >分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--添加用户的对话框-->
        <el-dialog
                title="添加用户"
                :visible.sync="addRoleVisible"
                @close="addRoleClosed"
                width="50%">
            <!--            内容主体区域-->
            <el-form :model="addRoleForm" :rules="addFormRules" ref="addFormRulesRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName"  label-width="80px">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc"  label-width="80px">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!--            底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!--用修改户的对话框-->
        <el-dialog
                title="修改用户"
                :visible.sync="editRoleVisible"
                @close="editRoleClosed"
                width="50%">
            <!--            内容主体区域-->
            <el-form :model="editRoleForm" :rules="addFormRules" ref="editFormRulesRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName"  label-width="80px">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc"  label-width="80px">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!--            底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>

        <!--分配权限的对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
                @close="setRightDialogClosed">
            <!--            树形控件-->
            <el-tree :data="rightslist"
                     :props="treeProps"
                     node-key="id"
                     default-expand-all
                     :default-checked-keys="defKeys"
                     ref="treeRef"
                     show-checkbox
            ></el-tree>

            <!--            底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data(){
            return {
                //所有角色列表数据
                rolelist:[],
                //添加用户的弹窗开关
                addRoleVisible:false,
                //添加用户的信息
                addRoleForm:{
                    roleName:'',
                    roleDesc:''
                },
                //添加用户的信息验证规则
                addFormRules:{
                    roleName:[{required:true,message:'请输入角色名称',trigger:'blur'},
                        {min:3,max:10,message:'角色名称的长度在3~10个字符之间',trigger:'blur'}],
                    roleDesc:[{required:true,message:'请输入角色描述',trigger:'blur'},
                        {min:6,max:15,message:'角色描述的长度在6~15个字符之间',trigger:'blur'}]
                },
                //修改用户的弹窗开关
                editRoleVisible:false,
                //修改用户的信息
                editRoleForm:{},
                //分配权限对话框显示
                setRightDialogVisible:false,
                //所有权限数据
                rightslist:[],
                //树形控件的绑定对象
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                //默认选中的节点ID值数组
                defKeys:[],
                //当前即将分配权限的角色ID
                roleId:''
            }
        },
        created(){
            this.getRoleList()
        },
        methods:{
            //获取所有角色的列表
            async getRoleList(){
                let res = await this.$http.get('roles')
                if(res.meta.status !== 200)return this.$message.error('获取角色列表失败')
                this.rolelist = res.data
            },
            //控制用户弹框开关
            showRoleForm(){
                this.addRoleVisible = !this.addRoleVisible
            },
            //添加用户
            addRole(){
                this.$refs.addFormRulesRef.validate(async valid=>{
                    if(!valid) return;
                    //可以发起添加用户的请求，调用接口
                    let res = await this.$http.post('roles',this.addRoleForm)
                    if (res.meta.status !== 201) return this.$message.error('添加用户失败')
                    //隐藏用户添加对话框
                    this.addRoleVisible = false
                    // //刷新用户列表
                    this.getRoleList()
                })
            },
            //关闭添加用户弹框
            addRoleClosed(){
                //重置输入框
                this.$refs.addFormRulesRef.resetFields()
            },
            //删除角色
            async removeRole(id){
                //弹框询问是否删除用户
                const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).catch(err=>err)
                if(confirmResult !== 'confirm')return this.$message.info('已经取消删除')
                let res = await this.$http.delete('roles/'+id)
                if(res.meta.status !== 200) return this.$message.error('删除用户失败')
                this.$message.success('删除用户成功')
                this.getRoleList()
            },

            //控制修改用户弹框开关
            async showEditForm(id){
                let res = await this.$http.get('roles/'+id)
                if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
                this.editRoleForm = res.data
                this.editRoleVisible = true

            },
            //关闭修改加用户弹框
            editRoleClosed(){
                //重置输入框
                this.$refs.editFormRulesRef.resetFields()
            },
            //修改用户
            editRole(){
                this.$refs.editFormRulesRef.validate(async valid=>{
                    if(!valid) return;
                    //可以发起修改用户的请求，调用接口
                    let res = await this.$http.put('roles/'+ this.editRoleForm.roleId,{
                        roleName:this.editRoleForm.roleName,
                        roleDesc:this.editRoleForm.roleDesc
                    })
                    if (res.meta.status !== 200) return this.$message.error('修改加用户失败')
                    this.$message.success('修改加用户成功')
                    //隐藏用户修改对话框
                    this.editRoleVisible = false
                    // //刷新用户列表
                    this.getRoleList()
                })
            },

            //根据id删除对应权限
            async removeRightById(role,rightId){
                //弹框提示
                const confirmResult = await this.$confirm('此操作将删除该用户权限，是否继续','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).catch(err=>err)
                if(confirmResult !== 'confirm'){
                   return  this.$message.info('取消删除')
                }
                let res =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status !== 200)  return  this.$message.error('删除权限失败')
                role.children = res.data
                this.$message.success('删除权限成功')
            },

            //展示分配权限的对话框
            async showSetRightDialog(role){
                this.roleId = role.id
                //获取所有权限的数据
                let res = await this.$http.get('rights/tree')
                if(res.meta.status !== 200)  return  this.$message.error('删除权限失败')
                //保存数据
                this.rightslist = res.data

                //递归获取三级节点的ID
                this.getLeafKeys(role,this.defKeys)

                //打开弹窗
                this.setRightDialogVisible = true
            },

            //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys
            getLeafKeys(node,arr){
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item=>{
                    this.getLeafKeys(item,arr)
                })
            },
            //监听权限对话框的关闭
            setRightDialogClosed(){
                this.defKeys = []
            },
            //点击为角色分配角色
            async allotRights(){
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const idStr = keys.join(',')
                let res = await this.$http.post(`roles/${this.roleId}/rights/`,{rids:idStr})
                if(res.meta.status !== 200)  return  this.$message.error('更新权限失败')
                this.$message.success('更新权限成功')
                this.getRoleList()
                this.setRightDialogVisible = false
            }
        },

    }
</script>

<style scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>