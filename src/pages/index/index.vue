<template>
  <view>
    <music-head title="网易云音乐" :isBack='isBack'></music-head>

	<!-- 可滚动区域  内容 -->
    <view class="container">
      <scroll-view scroll-y>
        <!-- 搜索栏 -->
        <view class="search-wrap" @click="handleToSearch">
          <text class="iconfont icon-icon-"></text>
          <input type="text" placeholder="搜索歌曲" />
        </view>

          <!-- 骨架屏 -->
        <view v-if="isloading">
          <m-for-skeleton
            :avatarSize="200"
            :row="3"
            :loading = isloading
            isarc='square'
            v-for="(item,key) in 4"
            :key="key"
            :title='false'
            rowData='100%'>
          </m-for-skeleton>

        </view>

        <!-- 列表内容 -->
        <view class="list-wrap"
        v-else>
          <view class="list-item"
		  v-for="(item1, index1) in list"
		  :key="index1"
		  @click="handleListClick(item1.id)">
            <!-- 左侧图片 -->
                <view class="list-img">
                    <image :src='item1.coverImgUrl'></image>
                    <text >{{item1.updateFrequency}}</text>
                </view>
            <!-- 右侧歌曲列表 -->
            <view class="list-text">
                <view class="list-text-item"
				v-for="(item2, index2) in item1.tracks"
				:key="index2">
                    {{index2 + 1}}. {{item2.first}} - {{item2.second}}
                </view>
            </view>
          </view>
          
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import musicHead from "@/components/musicHead";
import {getList} from '@/common/request'
import mForSkeleton from "@/components/m-for-skeleton";

export default {
  components: {
    musicHead,
    mForSkeleton
  },
  data() {
    return {
		// 是否显示返回图标
		isBack: false,
		// 获取列表数据
		list: [],
    // 是否显示骨架屏
    isloading: true
	};
  },
  onLoad() {
	  getList().then(res => {
		  // console.log(res)
      this.list = res
      setTimeout(() => {
        this.isloading = false
      },1000)
		  
	  })
  },
  methods: {
	//   点击 item 跳转到歌单页面
	handleListClick(id){
		console.log(id)
		uni.navigateTo({
			url: '../list/index?id=' + id
		});
	},
  // 跳转到搜索页面
  handleToSearch(){
    uni.navigateTo({
       url: '/pages/search/index'
    });
  }
  }
};
</script>

<style scoped lang="scss">

// 搜索栏
.container {
  .search-wrap {
    background-color: #f1f1f1;
    margin: 20rpx 30rpx 20rpx 30rpx;
    display: flex;
    height: 70rpx;
    align-items: center;
    border-radius: 50rpx;
    .iconfont {
      margin: 0 20rpx;
      font-size: 36rpx;
    }
    input {
      font-size: 28rpx;
    }
  }
}

// 列表内容
.list-item {
    margin: 30rpx;
    display: flex;
  .list-img {
       
        position: relative;
		
    image {
        width: 250rpx;
        height: 250rpx;
		border-radius: 20rpx;
    }
    text {
        position: absolute;
        bottom: 20rpx;
        left: 20rpx;
        color: #fff;
        font-size: 24rpx;
    }
  }
  .list-text {
	  overflow: hidden;
    .list-text-item {
        line-height: 50rpx;
        margin-left: 20rpx;
        margin-top: 20rpx;
        font-size: 30rpx;
		text-overflow: ellipsis;
		overflow: hidden;
        white-space: nowrap;
    }
  }
}</style>
