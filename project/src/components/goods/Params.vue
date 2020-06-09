<template>
    <div>
        <!--       面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <el-alert title="注意： 只允许为第三级设置相关参数" type="warning"
                      :closable="false" show-icon></el-alert>
<!--            选择商品分类区域-->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
<!--                    选择商品分类的级联选择框-->
                    <el-cascader
                            v-model="selectedKeys"
                            :options="catelist"
                            :props="cascadeProps"
                            @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

<!--            tab 页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--                添加动态参数棉棒-->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="adddialogVisible=true">添加参数</el-button>
<!--                    动态参数表格-->
                    <el-table :data="manyTableData" border stripe>
<!--                        展开行-->
                        <el-table-column type="expand">
<!--                            循环渲染tag标签-->
                            <template slot-scope="scope">
                                <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i"
                                        @close="handleClose(i,scope.row)"
                                >{{item}}</el-tag>
<!--                                输入文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
<!--                                添加tag按钮-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
<!--                            索引列-->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
<!--                添加静态属性棉棒-->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="adddialogVisible=true">添加属性</el-button>
<!--                静态属性表格&ndash;&gt;-->
                    <el-table :data="onlyTableData" border stripe>
<!--                        展开行-->
                        <el-table-column type="expand">
                            <!--                            循环渲染tag标签-->
                            <template slot-scope="scope">
                                <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i"
                                        @close="handleClose(i,scope.row)"
                                >{{item}}</el-tag>
                                <!--                                输入文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--                                添加tag按钮-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
<!--                            索引列-->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit"
                                               @click="showEditDialog(scope.row.attr_id)"
                                >修改</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

<!--        添加参数对话框-->
        <el-dialog
                @close="addDialogClosed"
                :title='"添加"+titleText'
                :visible.sync="adddialogVisible"
                width="50%"
                >
<!--            添加参数对话框-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="adddialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!--        修改参数对话框-->
        <el-dialog
                @close="editDialogClosed"
                :title='"修改"+titleText'
                :visible.sync="editdialogVisible"
                width="50%"
        >
            <!--            添加参数对话框-->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Params",
        data:()=>({
            //商品分类类别
            catelist:[],
            //指定级联选择器的配置对象
            cascadeProps: {
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            //选中的父级id数组
            selectedKeys:[],
            //被激活页签的名称
            activeName:'many',
            //动态参数数据
            manyTableData:[],
            //静态属性数据
            onlyTableData:[],
            //控制添加对话框的隐藏
            adddialogVisible : false,
            //添加参数表单数据对象
            addForm:{},
            //添加表单验证规则对象
            addFormRules:{attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]},
            //控制修改对话框显示
            editdialogVisible:false,
            //修改表单数据对象
            editForm:{},
            //修改表单验证规则对象
            editFormRules:{attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]},

        }),
        created(){
          this.getCateList()
        },
        methods:{
            //获取数据
            async getCateList(){
                let res = await this.$http.get('categories')
                if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
                this.catelist = res.data
            },
            //级联选择框选中项变化会触发的函数
             handleChange(){
                this.getParamsData()
            },
            //tab页签点击事件
            handleTabClick(){
                this.getParamsData()
            },
            //获取参数列表数据
            async getParamsData(){
                if(this.selectedKeys.length !== 3){ //如果不是3级分类
                    this.selectedKeys = []
                    this.manyTableData =[]
                    this.onlyTableData =[]
                    return
                }
                //根据所选分类id和当前所处的面板获取对应的参数
                let res = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
                if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
                //
                res.data.forEach(item=>{item.attr_vals =item.attr_vals ? item.attr_vals.split(' ') : [];
                //    控制文本框的显示与隐藏
                    item.inputVisible = false;
                    item.inputValue = ''
                })
                //判断数据是动态参数还是静态属性
                if(this.activeName === 'many'){
                    this.manyTableData = res.data
                }else {
                    this.onlyTableData = res.data
                }
            },
            //关闭添加对话框
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            //点击添加参数
            addParams(){
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid) return
                    let res = await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name:this.addForm.attr_name,
                        attr_sel:this.activeName
                    })
                    if(res.meta.status !== 201) return this.$message.error('添加参数失败')
                    this.$message.success('添加参数成功')
                    this.adddialogVisible = false
                    this.getParamsData()

                })
            },
            //点击展示修改对话框
            async showEditDialog(id){
                let res = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
                    params:{attr_sel:this.activeName}
                })
                if(res.meta.status !== 200) return this.$message.error('获取参数信息失败')
                this.editForm = res.data
                this.editdialogVisible = true
            },
            //清空表单
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },
            //点击修改参数
            editParams(){
                this.$refs.editFormRef.validate(async valid=>{
                    if(!valid)return
                    let res = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                        attr_sel:this.activeName,
                        attr_name:this.editForm.attr_name
                    })
                    console.log(res);
                    if(res.meta.status !== 200) return this.$message.error('修改参数信息失败')
                    this.$message.success('修改参数信息成功')
                    this.getParamsData()
                    this.editdialogVisible = false
                })
            },
            //更具id删除对应项
            async removeParams(id){
                //弹框提示
                const confirmResult = await this.$confirm('此操作将删除该参数，是否继续','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).catch(err=>err)
                if(confirmResult !== 'confirm'){
                    return  this.$message.info('取消删除')
                }
                let res =await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                if(res.meta.status !== 200)  return  this.$message.error('删除参数失败')
                this.getParamsData()
                this.$message.success('删除参数成功')
            },
            //文本框失去焦点或enter触发
            async handleInputConfirm(row){
                if(row.inputValue.trim() === ''){
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                this.saveAttrVals(row)
            },
            //
            async saveAttrVals(row){
                let res =await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                })
                if(res.meta.status !== 200)  return  this.$message.error('修改参数项失败')
                this.$message.success('修改参数项成功')
            },
            //点击按钮展示文本输入框
            showInput(row){
                row.inputVisible = true
                //让文本框自动获取焦点
                this.$nextTick(()=>{
                    this.$refs.saveTagInput.$refs.input.focus( )
                })
            },
            //删除对应的参数可选项
            handleClose(i,row){
                row.attr_vals.splice(i,1)
                this.saveAttrVals(row)
            }

        },
        computed:{
            isBtnDisabled(){
                if (this.selectedKeys.length !== 3){
                    return true
                }
                return false
            },
            //当前选中的三级分类的id
            cateId(){
                if (this.selectedKeys.length === 3){
                    return this.selectedKeys[2]
                }
                return null
            },
            //动态计算标题文本
            titleText(){
                return this.activeName === 'many'?'动态参数' :'静态属性'

            }
        }
    }
</script>

<style scoped>
    .cat_opt{
        margin: 15px;
    }
    .el-tag{
        margin: 10px;
    }
    .input-new-tag{
        width: 120px;
    }
</style>