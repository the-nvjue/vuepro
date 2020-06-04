<template>

    <el-container class="home-container">
<!--        头部区域-->
        <el-header>
            <div>
                <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=419367057,953443555&fm=26&gp=0.jpg" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
<!--            左侧边栏-->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">光翼{{isCollapse?"展开":"收起"}}</div>
                <el-menu
                        router
                        unique-opened
                        :collapse = 'isCollapse'
                        :collapse-transition="false"
                        class="el-menu-vertical-demo"
                        :default-active=$route.path
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff">
<!--                        一级菜单-->
                    <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
<!--                        一级菜单模板区-->
                        <template slot="title">
<!--                            图标-->
                            <i :class="iconObj[item.id]"></i>
<!--                            文本 -->
                            <span>{{item.authName}}</span>
                        </template>

<!--                        二级菜单-->
                        <el-menu-item :index="'/'+ subItem.path+''" v-for="subItem in item.children" :key="subItem.id">
                            <!--                            图标-->
                            <i class="el-icon-menu"></i>
                            <!--                            文本 -->
                            <span>{{subItem.authName}}</span>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
<!--            右侧主体内容-->
            <el-main>
<!--                路由占位符-->
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        created(){
            this.getMenuList()
        },
        data() {
            return {
                menulist:[],
                iconObj:{
                    '125':'iconfont icon-nickname',
                    '103':'iconfont icon-safety',
                    '101':'iconfont icon-marks',
                    '102':'iconfont icon-instruction',
                    '145':'iconfont icon-suggestion'
                },
                isCollapse:false
            }
        },
        methods: {
            logout() {
                window.sessionStorage.removeItem('token');
                this.$router.push('/login')
                this.$message.success('退出成功')
            },
            //获取左侧菜单列表
            async getMenuList(){
                let res = await this.$http.get('menus')
                if(res.meta.status !== 200)return this.$message.error(res.meta.msg)
                this.menulist = res.data
                // console.log(res);
            },
            //点击按钮切换菜单折叠与展开
            toggleCollapse(){
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container{
        height: 100%;
    }
    .el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 20px;
        > div{
            display: flex;
            align-items: center;
            img{
                width: 50px;
                width: 50px;
                border-radius: 50%;
            }
            span{
                margin-left: 15px;
            }
        }
    }
    .el-aside{
        background-color: #373d41;
        .el-menu{
            border: none;
        }
    }
    .el-main{
        background-color: #eaedf1;
    }

    .iconfont{
        margin-right: 10px;
    }
    .toggle-button{
        background-color:rgb(71,81,99);
        color: white;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        letter-spacing: .1rem;
    }
</style>