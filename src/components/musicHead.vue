<!--  -->
<template>
  <view>
    <!-- 头部标题 -->
    <view class="head-wrap">
      <view class="icon" v-if="isBack">
        <text class="iconfont icon-zuojiantou" @click="handleBack"></text>
        <text class="a">|</text>
        <text class="iconfont icon-shouye" @click="handleBackHome"></text>
      </view>
      <view class="head-title" 
      :style="{'color': titleColor}">{{ title }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: String,
    isBack: Boolean,
    titleColor: String
  },
  data() {
    return {
    };
  },
  methods: {
    //   返回上一页
    handleBack() {
      uni.navigateBack();
    },
    // 返回首页
    handleBackHome() {
      uni.navigateTo({
        url: "/pages/index/index",
      });
    },
  },
};
</script>
<style scoped lang="scss">
// 头部标题
.head-wrap {
  height: 70px;
  position: relative;
  .icon {
    position: absolute;
    top: 28px;
    left: 10px;
    /* background-color: rgba(0, 0, 0, 0.2); */
    border: solid 1px rgba(0, 0, 0, 0.2);
    width: 90px;
    height: 28px;
    display: flex;
    justify-content: space-evenly;
    border-radius: 15px;
    line-height: 28px;
    color: #fff;
    .icon-zuojiantou {
      font-size: 20px;
    }
    .a {
      color: rgba(0, 0, 0, 0.3);
    }
    .icon-shouye {
      font-size: 20px;
    }
  }

  .head-title {
    text-align: center;
    padding-top: 30px;
  }
}

</style>
