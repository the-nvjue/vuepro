<template>
    <div class="login_container">
        <div class="login_box">
<!--            头像-->
            <div class="avater_box">
                <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1052483811,93112726&fm=26&gp=0.jpg" alt="">
            </div>
<!--            登录表单-->
            <el-form class="login_form"
                     :model="loginForm"
                     label-width="0px"
                     :rules="loginFormRules"
                     ref="loginFormRef">
<!--                用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-nickname"></el-input>
                </el-form-item>
<!--                密码-->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password"  prefix-icon="iconfont icon-locking"></el-input>
                </el-form-item>
<!--                按钮-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data:()=>({
            //表单数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            //表单的验证规则对象
            loginFormRules:{
                username:[
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }),
        methods:{
            //重置按钮，点击重置表单
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields()
            },
            //表单登录
            login(){
                this.$refs.loginFormRef.validate(async vaild=>{
                    if(!vaild) return
                    let res = await  this.$http.post('login',this.loginForm)
                    if(res.meta.status !==200) return this.$message.error('登录失败')
                    this.$message.success('登录成功');
                    //存储token值
                    // console.log(res);
                    sessionStorage.setItem('token',res.data.token)
                    //编程式导航
                    this.$router.push('/home')
                })

            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container{
        background-color: #ccc;
        height: 100%;
    }

    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avater_box{
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            box-shadow: 0 0 10px salmon;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            img{
                height: 100%;
                width: 100%;
                border-radius: 50%;
            }
        }

    }
    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }

</style>