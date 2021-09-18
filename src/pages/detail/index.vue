<!-- 歌曲详情 -->
<template>
  <view class="detail-wrap">
      <!-- 背景图  :style="{'background-image': 'url('+ playlist.coverImgUrl+')'}" -->
    <view class="fixbg" :style="{'background-image': 'url('+ songDetail.al.picUrl +')'}"></view>
    <!-- 头部 -->
    <music-head :title="songDetail.name" :isBack="isBack" titleColor='white'></music-head>
    <!-- 内容区域 -->
    <view class="container" v-show="!isLoad">
      <scroll-view scroll-y>
        <!-- 播放图片 -->
        <view class="detail-play-wrap">
          <image :src='songDetail.al.picUrl' class="disc"
          :class="{'detail-play-run': isPlayRotate}"
          @click="handlePlayMusic"></image>
          <text class="iconfont " :class="iconPlay"
          @click="handlePlayMusic"></text>
          <image class="needle" src='@/static/needle.png'></image>
        </view>
        <!-- 歌词 -->
        <view class="detail-lyric-wrap">
          <view class="lyric-content"
          :style="{transform: 'translateY(' + (- (LyricIndex - 1)*100)+'rpx)'}">
            <view class="detail-lyric-item" 
            v-for='(item,index) in songLyric'
            :key="index"
            :class="{active: LyricIndex == index}">
            {{item.lyric}}
            </view>
          </view>
        </view>

        <!-- 相似歌曲 -->
        <view class="detail-like-wrap">
          <!-- 头部  喜欢这首歌的人也听 -->
          <view class="detail-like-head">
            喜欢这首歌的人也听
          </view>
          <!-- 内容 -->
          <view class="detail-like-content">
            <view class="detail-like-item"
            v-for="(item, index) in simiSongs"
            :key="index"
            @click="handleToSimi(item.id)">
              <!-- 左侧图片 -->
              <view class="like-item img">
                <image :src='item.album.picUrl'></image>
              </view>
              <!-- 中间歌曲 -->
              <view class="like-info">
                <view class="song-name">{{item.name}}</view>
                <image src="~@/static/sq.png" class="sq"/></image>
                <text class='author'>{{item.artists[0].name}} - {{item.name}}</text></text></text>
              </view>
              <!-- 右侧 播放 -->
              <view class="detail-like-play">
                <text class="iconfont icon-bofang"></text>
              </view>
            </view>
          </view>
        </view>

        <!-- 精彩评论 -->
        <view class="detail-comment-wrap">
          <!-- 标题 精彩评论 -->
          <view class="detail-comment-title">精彩评论</view>
          <!-- 内容 -->
          <view class="detail-comment-content">
            <view class="comment-item" 
            v-for="(item, index) in songComment"
            :key="index">
              <!-- 左边用户头像 -->
              <view class="comment-img">
                <image class="comment-image" :src='item.user.avatarUrl'></image>
              </view>
              <!-- 右边内容 -->
              <view class="comment-content">
                <!-- 用户名称 以及 点赞数 -->
                <view class="comment-content-title">
                  <!-- 左侧用户名称以及日期 -->
                  <view class="user-info">
                    <view class="user-name">{{item.user.nickname}}</view>
                    <view class="comment-time">{{item.time | formatTime}}</view>
                  </view>
                  <!-- 右侧点赞数 -->
                  <view class="like-num">
                    {{item.likedCount | formatCount}}<text class="iconfont icon-dianzan"></text>
                  </view>
                </view>
                <!-- 评论内容 -->
                <view class="comment-content-text">
                  {{item.content}}
                </view>
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
import { getSongDetail, getSimiSongs, getSongComment, getSongLyric, getSongUrl } from '@/common/request'

export default {
    components: {
        musicHead
    },
  data () {
    return {
        // 是否显示返回按钮
        isBack: true,
        // 歌曲 id
        songId: 0,
        // 歌曲详情信息
        songDetail: {
          al: {
            picUrl: ''
          }
        },
        // 相似歌曲
        simiSongs: [],
        // 评论
        songComment: [],
        // 歌词
        songLyric: [],
        // 歌词激活状态
        LyricIndex: 0,
        // 播放图标和暂停图标 切换
        iconPlay: 'icon-tubiao-10',
        // 图标是否旋转
        isPlayRotate: true,
        // 是否出现加载框
        isLoad: true
    }
  },
  onUnload(){
    // 清除监听歌词
          this.clearLyricIndex()
  },
  onHide(){
    // 清除监听歌词
          this.clearLyricIndex()
  },
  methods: {
    // // 获取歌曲详情信息
    // getDetail(songId){
    //   getSongDetail(songId).then(res => {
    //     console.log(res)
    //     this.songDetail = res.data.songs[0]
    //     console.log(this.songDetail)
    //   })
    // }
    getMusic(songId){
        uni.showLoading({
        title: '加载中...'
        });

        this.$store.commit('GET_NEXTID', songId)
        // console.log(songId, '-----------')
        // console.log(this.$store.state.nextId)

        this.isLoad = true

      Promise.all([ getSongDetail(songId), getSimiSongs(songId), getSongComment(songId), 
      getSongLyric(songId), getSongUrl(songId)]).then(res => {
        // 歌曲详情
        this.songDetail = res[0].data.songs[0]

        // 相似歌曲
        this.simiSongs = res[1].data.songs
        // 评论
        this.songComment = res[2].data.hotComments
        // 歌词
        let songLyric = res[3].data.lrc.lyric
        let re = /\[([^\]]+)\]([^\[]+)/g
        let result = []
        songLyric.replace(re, ($0,$1,$2) => {
          result.push({'time': this.formatTimeToSec($1), 'lyric': $2})
        })
        this.songLyric = result

        // 播放音乐
        this.songUrl = res[4].data.data[0].url || ''
        // 播放音乐 api
        this.bgAudioManager = uni.getBackgroundAudioManager();
        this.bgAudioManager.title = this.songDetail.name;
        this.bgAudioManager.src = this.songUrl 
        this.listenLyricIndex()
        // icon-bofang1


        // 监听播放事件
        this.bgAudioManager.onPlay(() => {
          this.iconPlay = 'icon-tubiao-10'
          this.isPlayRotate = true
          // 切换歌词
          this.listenLyricIndex()
        })
        // 监听暂停事件
        this.bgAudioManager.onPause(() => {
          this.iconPlay = 'icon-bofang1'
          this.isPlayRotate = false
          // 清除切换歌词
          this.clearLyricIndex()
        })

          this.bgAudioManager.onEnded(() => {
            this.getMusic(this.$store.state.nextId)
          })

      })

       this.isLoad = false
       uni.hideLoading();

    },
    // 歌词时间格式化
    formatTimeToSec(value){
      let arr = value.split(':')
      return (Number(arr[0]*60) + Number(arr[1])).toFixed(1)
    },

    // 播放音乐
      handlePlayMusic(){
        if(this.bgAudioManager.paused){
          // 是暂停
          this.bgAudioManager.play()
        }else{
          this.bgAudioManager.pause()
        }
      },

      // 歌词切换
      listenLyricIndex(){
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          // 对歌词进行循环，如果时间大于前一句歌词并且小于后一句歌词就是这句歌词
          for(let i = 0; i < this.songLyric.length; i++){
            // 如果已经到达了最后一个索引就等于最后一个
            if(this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1].time){
              this.LyricIndex = this.songLyric.length - 1
              break
            }
            if(this.bgAudioManager.currentTime > this.songLyric[i].time &&
               this.bgAudioManager.currentTime < this.songLyric[i+1].time){
                 this.LyricIndex = i
            }
          }
        },500)
      },

      // 清除定时器
      clearLyricIndex(){
        clearInterval(this.timer)
      },

      // 点击相似歌曲进行切换数据
      handleToSimi(id){
        this.getMusic(id)
      },

  },
  onLoad(options){
      // console.log(options.songId)
      this.songId = options.songId
      this.getMusic(this.songId)
  }
}

</script>
<style scoped lang='scss'>
/* 播放图片 */
.detail-play-wrap{
  width: 580rpx;
  height: 580rpx;
  background: url(~@/static/disc.png);
  background-size: cover;
  margin: 100rpx auto 30rpx auto;
  position: relative;
  .disc{
    width: 370rpx;
    height: 370rpx;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    animation: 20s linear move infinite;
    animation-play-state: paused;
  }
  .detail-play-run{
    animation-play-state: running;
  }
  @keyframes move {
    from{transform: rotate(0deg);}
    to{transform: rotate(360deg);}
  }
  .iconfont{
    width: 100rpx;
    height: 100rpx;
    font-size: 100rpx;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    color: #fff;
  }
  .needle{
    width: 230rpx;
    height: 360rpx;
    position: absolute;
    top: -80rpx;
    right: 44rpx;

  }
}

/* 歌词 */
.detail-lyric-wrap{
  margin-top: 100rpx;
  font-size: 34rpx;
  text-align: center;
  height: 300rpx;
  line-height: 100rpx;
  color: #949494;
  margin-bottom: 200rpx;
  overflow: hidden;
  .lyric-content{
    transition: .5s;
    height: 300rpx;
     .detail-lyric-item{
      height: 100rpx;
      line-height: 100rpx;
  }
  .active{
    color: #fff;
  }
  }
  
}

/* 相似歌曲 */
.detail-like-wrap {
  margin: 30rpx;
  margin-top: 70rpx;
  margin-bottom: 80rpx;
  .detail-like-head {
    margin-bottom: 40rpx;
    font-size: 36rpx;
    color: #fff;
  }
  .detail-like-content {
    .detail-like-item {
      display: flex;
      margin-bottom: 30rpx;
      .like-item.img {
        image {
          width: 82rpx;
          height: 82rpx;
          margin-right: 20rpx;
          border-radius: 20rpx;
        }
      }

      .like-info {
        flex: 1;
        .song-name {
          font-size: 28rpx;
          color: #fff;
          margin-bottom: 5rpx;
        }

        .sq {
          width: 26rpx;
          height: 20rpx;
          margin-right: 10rpx;
        }

        .author {
          font-size: 22rpx;
          color: #b7aaa0;
        }
      }
      .detail-like-play {
        .icon-bofang {
          font-size: 50rpx;
          color: #b7aaa0;
        }
      }
    }
  }
}

/* 评论 */
.detail-comment-wrap {
  margin: 70rpx 30rpx 0 30rpx;
  .detail-comment-title {
    margin-bottom: 30rpx;
    font-size: 36rpx;
    color: #fff;
  }

  .detail-comment-content {
    .comment-item {
      display: flex;
      margin-bottom: 40rpx;
      .comment-img {
        margin-right: 24rpx;
        .comment-image {
          width: 64rpx;
          height: 64rpx;
          border-radius: 50%;
        }
      }

      .comment-content {
        flex: 1;
        .comment-content-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .user-info {
            margin-bottom: 20rpx;
            .user-name {
              font-size: 26rpx;
              color: #bbbcbe;
              margin-bottom: 8rpx;
            }
            .comment-time {
              font-size: 20rpx;
              color: #91929e;
            }
          }

          .like-num {
            font-size: 28rpx;
            color: #91929e;
            .icon-dianzan {
            }
          }
        }

        .comment-content-text {
          line-height: 44rpx;
          color: #fff;
          font-size: 28rpx;
          padding-bottom: 20rpx;
          border-bottom: 1px solid #91929e;
        }
      }
    }
  }
}

</style>