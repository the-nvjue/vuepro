<template>
    <div>
        <!--       面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
<!--卡片区域-->
        <el-card>
<!--            添加分类按钮区域-->
            <el-row>
                <el-col>
                        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
<!--            表格-->
            <tree-table
                    class="tree-table"
                    :data="catelist"
                    :columns="columns"
                    :selection-type='false'
                    :expand-type="false"
                    show-index
                    index-text="#"
                    border
                    :show-row-hover="false"
            >
<!--                是否有限模板，作用域插槽-->
                <template v-slot:isok="scope">
                    <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color:lightgreen"></i>
                    <i v-else class="el-icon-error" style="color:lightcoral"></i>
                </template>
<!--                排序模板，作用域插槽 -->
                <template  v-slot:order="scope">
                    <el-tag size="mini"  v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
<!--                排序模板，作用域插槽 -->
                <template  v-slot:opt>
                    <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>
                    <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
                </template>
            </tree-table>
<!--            分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 3, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

<!--        添加分类对话框-->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisble"
            width="50%"
            @close="addCateDialogClosed"
        >
<!--            添加分类表单-->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级名称" >
                    <el-cascader
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascadeProps"
                            clearable
                            @change="parentCateChanged">
                    </el-cascader>
                </el-form-item>
            </el-form>
<!--            底部确定，取消按钮-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisble = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Categories",
        data(){
            return {
                //商品分类数据列表
                catelist:[],
                //查询条件对象
                queryInfo: {
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                //总数居条数
                total:0,
                //为table指定列的定义
                columns:[
                    {
                        label:'分类名称 ',
                        prop:'cat_name'
                    },
                    {
                        label:'是否有效',
                        //自定义模板
                        type:'template',
                        //模板名称
                        template:'isok'
                    },
                    {
                        label:'排序',
                        //自定义模板
                        type:'template',
                        //模板名称
                        template:'order'
                    },
                    {
                        label:'操作',
                        //自定义模板
                        type:'template',
                        //模板名称
                        template:'opt'
                    }

                ],
                //控制添加分类对话框
                addCateDialogVisble:false,
                //添加分类的表单数据对象
                addCateForm:{
                    cat_name:'',
                    cat_pid:0,
                    cat_level:0
                },
                //添加分类的表单验证规则对象
                addCateFormRules:{
                    cat_name:[
                        {required:true,message:'请输入分类名称',trigger:'blur'}
                    ]
                },
                //父级分类列表
                parentCateList:[],
                //指定级联选择器的配置对象
                cascadeProps: {
                    expandTrigger: 'hover',
                    value:'cat_id',
                    label:'cat_name',
                    children:'children',
                    checkStrictly :true
                },
                //选中的父级id数组
                selectedKeys:[]
            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            //获取商品分类数据
            async getCateList(){
                let res = await this.$http.get('categories',{params:this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
                this.catelist = res.data.result
                this.total = res.data.total
            },
            //监听pagesize改变的事件
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                //重新发送请求
                this.getCateList()
            },
            //监听pagenum的改变
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                //重新发送请求
                this.getCateList()
            },
            //控制添加分类对话框
            showAddCateDialog(){
                //获取父级父级分类的数据
                this.getParentCateList()
                this.addCateDialogVisble = true
            },
            //获取父级分类的数据
            async getParentCateList(){
                let res = await this.$http.get('categories',{params:{type:2}})
                if (res.meta.status !== 200) return this.$message.error('获取父级分类失败')
                this.parentCateList = res.data
            },
            //选择项发送变化触发的函数
            parentCateChanged(){
                if(this.selectedKeys.length>0){
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    this.addCateForm.cat_level = this.selectedKeys.length - 1
                    return
                }else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }

            },
            //点击按钮添加新的分类
            addCate(){
                this.$refs.addCateFormRef.validate(async vaild=>{
                    if(!vaild) return
                    let res = await this.$http.post('categories',this.addCateForm)
                    if (res.meta.status !== 201) return this.$message.error('添加分类失败')
                    this.$message.success('添加分类成功')
                    this.getCateList()
                    this.addCateDialogVisble = false
                })
            },
            //监听对话框关闭，重置表单
            addCateDialogClosed(){
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys =[]
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        }
    }
</script>

<style scoped>
    .tree-table{
        margin-top: 15px;
    }
    .el-cascader{
        width: 100%;
    }
</style>