<template>
    <div id="app">

        <router-view/>
        <ul v-show="visible" class="footer_nav">
            <li>
                <router-link to="/home"><i class="iconfont icon-home"></i>首页</router-link>
            </li>
            <li>
                <router-link to="/categories"><i class="iconfont icon-voiceprint"></i>分类</router-link>
            </li>
            <li>
                <router-link to="/search"><i class="iconfont icon-search"></i>搜索</router-link>
            </li>
            <li>
                <router-link to="/cart"><i class="iconfont icon-cart"></i>购物车</router-link>
            </li>
            <li>
                <router-link to="/my"><i class="iconfont icon-nickname"></i>我的商城</router-link>
            </li>
        </ul>
    </div>
</template>

<script>

    export default {

        data() {
            return {
                visible: true,
            }
        },
        watch: {
            $route: {
                handler(n) {
                    if (n.meta.flag) {
                        this.visible = !n.meta.flag
                    } else {
                        this.visible = true
                    }
                },
                immediate: true,
                deep: true
            },
        }

    }
</script>
<style lang="scss">
    @import "~@/assets/css/base.css";
    @import "~@/assets/css/iconfont.css";

    .footer_nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        background-color: rgb(229, 229, 229);
        height: 1rem;

        li {
            height: 100%;
            flex: 1;
            font-size: .28rem;

            .router-link-active {
                color: red;
            }

            a {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
            }
        }
    }


</style>
