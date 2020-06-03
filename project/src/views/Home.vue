<template>
    <section id="home">
        <section class="topNav">
            <img class="logo" src="https://www.taokubuy.com/data/upload/shop/common/home_logo.png" alt="">
            <section class="search"><i class="iconfont icon-search"></i><input type="text" placeholder="请输入关键字">
            </section>
            <a class="talk"><i class="iconfont icon-message"></i>消息</a>
        </section>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <a v-for="a in bannerList" class="swiper-slide" :key="a.image">
                    <img :src="a.image" alt="">
                </a>
            </div>
        </div>
        <section class="special ">
            <img src="" alt="">
            <section>
                <h1>特色好货</h1>
                <a>更多</a>
            </section>
            <section>
                <div>
                    <img src="" alt="">
                    <p></p>
                    <span>￥</span>
                </div>
            </section>
        </section>
    </section>
</template>

<script>
    import {getData} from '@/api'
    //Swiper插件
    import Swiper from 'swiper'
    import 'swiper/css/swiper.css'

    export default {
        name: "home",
        data() {
            return {
                bannerList: [],
            }
        },
        created() {
            getData('mobile/index.php?act=index').then(res => {
                if (res.code === 200) {
                    this.bannerList = (res.datas[0].adv_list.item);
                    this.$nextTick(() => {
                        new Swiper('.swiper-container', {
                            autoplay: true,//可选选项，自动滑动
                            touchRatio: 1,
                            loop: true,
                        })
                    })
                }
            })
        },
    }
</script>

<style lang="scss" scoped>
    #home {
        .topNav {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 2;
            display: flex;
            justify-content: space-around;
            width: 100%;
            padding: .1rem;
            height: .95rem;

            .logo {
                flex: 1;
                width: 2rem;
            }

            .search {
                background-color: #fff;
                flex: 5;
                border-radius: .1rem;
                opacity: .9;

                input {
                    outline: none;
                    border: none;
                    font-size: .4rem;
                    vertical-align: middle;

                }

                .iconfont {
                    font-size: .7rem;
                    color: #42b983;
                    vertical-align: middle;
                    margin: .2rem;
                }

                ::placeholder {
                    color: #bbb;
                }
            }

            .talk {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                color: #fff;
            }
        }

        .swiper-container {
            .swiper-wrapper {
                width: 100%;

                a {
                    img {
                        width: 100%;
                        height: auto;
                    }
                }
            }
        }
    }
</style>