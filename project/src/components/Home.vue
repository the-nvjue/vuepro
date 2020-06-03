<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {}
        },
        methods: {
            logout() {
                window.sessionStorage.removeItem('token');
                this.$router.push('/login')
                this.$message.success('退出成功')
            }
        }
    }
</script>

<style scoped>

</style>