<!-- 搜索页面 -->
<template>
  <view class="search">
    <!-- 头部 -->
    <music-head title="搜索" :isBack="isBack" titleColor="black" iconColor='black'></music-head>
    <!-- 内容区域 -->
    <view class="container">
      <scroll-view scroll-y>
        <!-- 搜索栏 -->
        <view class="search-wrap">
          <text class="iconfont icon-icon-"></text>
          <input type="text" placeholder="搜索歌曲" 
          v-model="hotWord"
          @confirm='handleToSearch(hotWord)'
          @input="handleToSuggest"/>
          <!-- 关闭 -->
          <text class="iconfont icon-guanbi" v-show="currentIndex == 2"
          @click="handleClear"></text>
        </view>
        <!-- 当 currentIndex 为 1 时显示历史记录以及热歌榜 -->
        <block v-if="currentIndex === 1">
          <!-- 搜索历史记录 -->
          <view class="search-history-wrap">
            <view class="search-history-head">
              <text>历史记录</text>
              <text class="iconfont icon-rest" 
              @click="clearHistory"></text>
            </view>
            <view class="search-history-list">
                <view v-for="(item, index) in historyList"
                :key="index"
                @click="handleToWord(item)">{{item}}</view>
            </view>
          </view>

          <!-- 热搜榜 -->
          <view class="search-hot-wrap">
            <view class="search-hot-head">热搜榜</view>
            <view class="search-hot-content">
              <view class="search-hot-item"
              v-for="(item, index) in hotList"
              :key="index"
              @click="handleToWord(item.searchWord)">
                <view class="search-hot-top">{{index + 1}}</view>
                <view class="search-hot-text">
                  <view>
                    {{item.searchWord}}<image :src='item.iconUrl' mode='aspectFit'></image>
                  </view>
                  <view>{{item.content}}</view>
                </view>
                <view class="search-hot-count">{{item.score}}</view>
              </view>
            </view>
          </view>
        </block>

        <!-- 当  currentIndex 为 2 时显示搜索结果-->
        <block v-else-if="currentIndex === 2">
          <view class="search-result-wrap">
            <view class="search-result-item"
            v-for="(item, index) in resultList"
            :key="index"
            @click="handleToDetail(item.id)">
              <view class="search-result-content">
                <view class="search-result-name">{{item.name}}</view>
                <view class="search-result-author">{{item.artists[0].name}} - <text>{{item.album.name}}</text></view>
              </view>
              <view class='search-result-play'>
                <text class='iconfont icon-bofang'></text>
              </view>
            </view>
          </view>
        </block>

        <!-- 当 currentIndex 为 3 时显示实时搜索结果 -->
        <block v-else-if='currentIndex === 3'>
          <view class="search-suggest-wrap">
            <view class="search-suggest-head">搜索“{{hotWord}}”</view>
            <view class="search-suggest-content">
              <view class="suggest-item"
              v-for="(item, index) in suggestList"
              :key="index"
              @click="handleToSearch(item.keyword)">
                <text class="iconfont icon-icon-"></text>{{item.keyword}}
              </view>
            </view>
          </view>
        </block>


      </scroll-view>
    </view>
  </view>
</template>

<script>
import musicHead from "@/components/musicHead";
import {searchHot, searchWord, searchSuggest} from '@/common/request';

export default {
  components: {
    musicHead,
  },
  data() {
    return {
      // 是否显示返回图标
      isBack: true,
      // 热搜榜列表
      hotList: [],
      // 搜索文字
      hotWord: '',
      // 历史记录列表
      historyList: [],
      // 显示哪部分内容 1 显示原始页面   2显示搜索结果  3显示实时搜索提示
      currentIndex: 1,
      // 结果列表
      resultList: [],
      // 实时搜索结果提示
      suggestList: []
    };
  },
  onLoad(){
    // 显示历史记录
    uni.getStorage({
      key: 'historyList',
      success: (res) => {
        this.historyList = res.data
      }
    })
    console.log(this.historyList)

    searchHot().then(res => {
      // console.log(res)
      this.hotList = res.data.data
      // console.log(this.hotList)
    })
  },
  methods: {
    // 点击拿到热词
    handleToWord(word){
      this.hotWord = word
      this.handleToSearch(word)
    },

    //当在输入框中按下回车（输入完毕）时触发 
    handleToSearch(word){ 
      // 将传入的参数设置为输入框中
      this.hotWord = word

      this.historyList.unshift(word)
      // 去重
      this.historyList = [...new Set(this.historyList)]
      // 只设置长度为 10
      if(this.historyList.length > 10){
        this.historyList.length = 10
      }
      // 存入到本地存储中
      uni.setStorage({
        key: 'historyList',
        data: this.historyList
      });

      this.getSearchResult(word)

    },

    // 回车之后请求数据
    getSearchResult(word){
      searchWord(word).then(res => {
        this.resultList = res.data.result.songs
      })
      this.currentIndex = 2
    },

    // 点击垃圾桶清除历史记录
    clearHistory(){
      uni.clearStorage();
      this.historyList = []

       uni.getStorage({
        key: 'historyList',
        success: (res) => {
          this.historyList = res.data
        }
      })
    },

    // 当点击关闭按钮，返回搜索主页并且清除input的值
    handleClear(){
      this.currentIndex = 1
      this.hotWord = ''
      // console.log('-----')
    },

    // 点击对于的搜索结果跳转到详情页面
    handleToDetail(id){
      uni.navigateTo({
         url: '/pages/detail/index?songId=' + id
      });
    },

    // 当在输入框中输入文字时发送请求获取实时搜索提示
    handleToSuggest(event){
      // console.log(event)
      // let value = event.detail.value
      // 如果 输入框中是 空值，就直接跳出
      if(!this.hotWord){
        this.currentIndex = 1
        return
      }
      // console.log(searchSuggest)
      searchSuggest(this.hotWord).then(res => {
        this.suggestList = res.data.result.allMatch
        this.currentIndex = 3
        console.log(this.suggestList)
      })
      // searchSuggest(value).then(res => {
      //   this.suggestList = res.data.result.allMatch
      //   this.currentIndex = 3
      //   console.log(this.suggestList)
      // })
    }
  },
};
</script>
<style scoped lang='scss'>
.container {
  .search-wrap {
    background-color: #f1f1f1;
    margin: 30rpx 30rpx 20rpx 30rpx;
    display: flex;
    height: 70rpx;
    align-items: center;
    border-radius: 50rpx;
    .icon-icon- {
      margin: 0 20rpx;
      font-size: 36rpx;
    }
    input {
      font-size: 28rpx;
      flex: 1;
    }
    .icon-guanbi{
      font-size: 28rpx;
      margin-right: 20rpx;
      font-size: 36rpx;
      height: 36rpx;
      padding: 12rpx;
      align-items: center;
    }
  }
}

/* 历史记录 */
.search-history-wrap {
  margin: 30rpx;
  margin-top: 40rpx;
  font-size: 28rpx;
  .search-history-head {
    display: flex;
    justify-content: space-between;
    margin-bottom:  30rpx;
    text {

    }
    .icon-rest {
      font-size: 40rpx;
    }
  }

  .search-history-list {
    display: flex;
    flex-wrap: wrap;
    view{
      font-size: 26rpx;
      padding: 14rpx 26rpx;
      background-color: #f1f1f1;
      border-radius: 40rpx;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
    }
  }
}

/* 热搜榜 */
.search-hot-wrap {
  margin: 40rpx 30rpx;
  font-size: 26rpx;
  .search-hot-head {
    margin-bottom: 30rpx;
    font-size: 30rpx;
  }

  .search-hot-content {
    .search-hot-item {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      .search-hot-top {
        color: #fb2222;
        margin-left: 8rpx;
        width: 60rpx;
      }

      .search-hot-text {
        flex: 1;
        view:nth-child(1){
          font-size: 30rpx;
          margin-bottom: 6rpx;
          color: black;
        }
        view:nth-child(2){
          font-size: 24rpx;
          color: #878787;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 70vw;
        }
          image {
            width: 48rpx;
            height: 22rpx;
            margin-left: 10rpx;
          }
      }

      .search-hot-count {
        color: #878787;
      }
    }
  }
}

/* 搜索结果 */
.search-result-wrap {
  margin-top: 30rpx;
  border-top: 2px solid #e4e4e4;
  padding-top: 30rpx;
  .search-result-item {
    margin: 0 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    border-bottom: 2px solid #e4e4e4;
    padding-bottom: 20rpx;
    .search-result-content {
      .search-result-name {
        font-size: 28rpx;
        color: #4264b9;
      }

      .search-result-author {
        font-size: 22rpx;
        color: #9b9b9b;
        text {
          color: #4264b9;
          margin-left: 8rpx;
        }
      }
    }

    .search-result-play {
      .icon-bofang {
        font-size: 50rpx;
        color: #9b9b9b;
      }
    }
  }
}

/* 实时显示搜索结果 */
.search-suggest-wrap{
  margin: 30rpx;
  margin-top: 30rpx;
  border-top: 2px solid #e4e4e4;
  padding-top: 30rpx;
  font-size: 26rpx;
  .search-suggest-head{
    color: #4264b9;
    margin-bottom: 40rpx;
  }
  .search-suggest-content{
    .suggest-item{
      margin-bottom: 40rpx;
      text{
        margin-right: 18rpx;
      }
    }
  }
}
</style>
