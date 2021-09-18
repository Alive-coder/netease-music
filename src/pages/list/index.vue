<!--  -->
<template>
  <view >
    <!-- 背景图  :style="{'background-image': 'url('+ playlist.coverImgUrl+')'}" -->
    <view class="fixbg" :style="{'background-image': 'url('+ playlist.coverImgUrl+')'}"></view>
    <!-- 头部 -->
    <music-head title="歌单" :isBack="isBack" v-show="!isLoad"
    titleColor='white'></music-head>
    <!-- 内容区域 -->
    <view class="container" v-show="!isLoad">
      <scroll-view scroll-y>
        <!-- 头部 -->
        <view class="list-head-wrap">
          <!-- 左侧图片 -->
          <view class="img-wrap">
            <image :src="playlist.coverImgUrl"></image>
            <text class="iconfont icon-yousanjiao">{{playlist.playCount | formatCount}}</text>
          </view>
          <!-- 右侧信息 -->
          <view class="head-info-wrap">
            <view class="title">{{playlist.name}}</view>
            <view class="logo">
              <image :src="playlist.creator.avatarUrl"></image> {{playlist.creator.nickname}}
            </view>
            <view class="desc">{{playlist.description}}</view>
          </view>
        </view>

        <!-- 分享给微信好友 -->
        <view class="share-wrap">
          <button class="share" open-type="share">
            <text class="iconfont icon-fenxiang"></text>
            <text class="text">分享给微信好友</text>
          </button>
        </view>

        <!-- 列表内容 -->
        <view class="list-content-wrap">
          <!-- 顶部全部播放 -->
          <view class="list-content-top">
            <text class="iconfont icon-bofang1"></text>
            <text class="all-play">播放全部</text>
            <text class="num">(共{{playlist.trackCount}}首)</text>
          </view>
          <!-- 内容 -->
          <view class="list-wrap">
            <view class="list-item"
            v-for="(item, index) in playlist.tracks"
            :key="index"
            @click="handleToDetail(item.id)">
              <view class="list-item-left">{{index + 1}}</view>
              <view class="list-item-center">
                <view class="item-name">{{item.name}}</view>
                <view class="info-wrap">
                  <!-- <image src="@/static/dujia.png" mode="widthFix"></image> -->
                  <!-- v-if="privileges[index].maxbr == 999000 -->
                  <!-- <text class="dujia"
                  v-if="privileges[index].maxbr == 999000">独家</text>
                  <text class="sq"
                  v-if="privileges[index].maxbr == 999000">SQ</text> -->
                  <image
                  v-if="privileges[index].maxbr == 999000" 
                  src="@/static/dujia.png" mode="widthFix"></image>
                  <image 
                  v-if="privileges[index].maxbr == 999000"
                  src="@/static/sq.png" mode="widthFix"></image>
                  <text class="author">{{item.ar[0].name}}-{{item.name}}</text>
                </view>
              </view>
              <view class="list-item-right">
                <text class="iconfont icon-bofang"></text>
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
import {getLists} from '@/common/request'

export default {
  components: {
    musicHead,
  },
  computed: {
    },
  data() {
    return {
      
        // 是否显示返回按钮
      isBack: true,
    //   榜单 id
    id: 0,
    // 榜单数据
    playlist: {
        coverImgUrl: '',
        playCount: '',
        name: '',
        description: '',
        trackCount: '',
        creator: {
            avatarUrl: '',
            nickname: ''
        },
        tracks: []
    },
    // 独家 和 SQ 标识显示
    privileges: [],
    // 作者名字
    names: [],
    // 是否在加载中
    isLoad: true
    };
  },
  methods: {
    //   跳转到详情页面
    handleToDetail(songId){
        uni.navigateTo({
             url: '/pages/detail/index?songId=' + songId
        });
    }
  },
  onLoad(options) {
    // console.log(options);
    uni.showLoading({
        title: '加载中...'
    });
    // 榜单 id
    this.id = options.id
    // 请求数据
    getLists(this.id).then(res => {
        // console.log(res)
        this.playlist = res.data.playlist
        this.privileges = res.data.privileges
        this.names = res.data.playlist.tracks

        let topListIds = res.data.playlist.trackIds
        this.$store.commit('INIT_TOPLISTIDS', topListIds)
        // console.log(this.$store.state.topListIds)
    // 当数据加载完成之后就显示数据，不处于加载中
    this.isLoad = false
    uni.hideLoading();
    })
  },
};
</script>
<style scoped lang="scss">
/* 头部 */
.list-head-wrap {
  display: flex;
  margin: 30rpx;
  .img-wrap {
    position: relative;
    margin-right: 30rpx;
    image {
      width: 264rpx;
      height: 264rpx;
      border-radius: 15rpx;
    }
    .icon-yousanjiao {
      /* color: #fff; */
      position: absolute;
      top: 0;
      right: 10rpx;
      font-size: 28rpx;
    }
  }
  .head-info-wrap {
    .title {
      font-size: 38rpx;
      color: #fff;
      letter-spacing: 5rpx;
    }

    .logo {
      margin: 20rpx 0;
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.863);
      image {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        margin-right: 14rpx;
      }
    }
    .desc {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.705);
    }
  }
}

/* 分享 */
.share-wrap {
  margin: 0 auto;

  .share {
    border-radius: 45rpx;
    width: 400rpx;
    height: 90rpx;
    background-color: rgba(0, 0, 0, 0.2);
    line-height: 90rpx;
    color: #fff;
    font-weight: 400;
    .icon-fenxiang {
      margin-right: 20rpx;
      font-size: 38rpx;
      margin-top: 10rpx;
    }
    .text {
      font-size: 34rpx;
    }
  }
}

/* 列表内容 */
.list-content-wrap {
  background-color: #fff;
  margin-top: 36rpx;
  border-radius: 44rpx;
  .list-content-top {
    height: 90rpx;
    width: 90%;
    line-height: 100rpx;
    margin: 0 36rpx;
    position: relative;
    .icon-bofang1 {
      font-size: 62rpx;
      position: absolute;
      top: 0rpx;
      left: -10rpx;
    }
    .all-play {
      margin: 0 10rpx 0 80rpx;
      font-size: 34rpx;
    }
    .num {
      color: #a8a8a8;
      font-size: 28rpx;
    }
  }
  .list-wrap {
    .list-item {
      margin: 30rpx;
      margin-bottom: 46rpx;
      display: flex;
      .list-item-left {
        margin: 18rpx 40rpx 0 20rpx;
        color: #a8a8a8;
        text-align: center;
        width: 60rpx;
        text-align: center;
      }

      .list-item-center {
        flex: 1;
        .item-name {
          font-size: 32rpx;
          margin-bottom: 10rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 70vw;
        }
        .info-wrap{
            overflow: hidden;
            white-space: nowrap;
            position: relative;
            
            image{
              width: 42rpx;
              margin-right: 10rpx;
              
            }
            /* .sq{
                left: 56rpx;
            } */
    
            .author {
              margin-left: 10rpx;
              color: #a8a8a8;
              font-size: 26rpx;
              width: 50vw;
              overflow: hidden;
              display: inline-block;
              text-overflow: ellipsis;
            }
        }
      }

      .list-item-right {
        display: flex;
        justify-content: flex-end;
        .icon-bofang {
          font-size: 56rpx;
          color: #a8a8a8;
        }
      }
    }
  }
}
</style>
