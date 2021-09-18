import {baseUrl} from './config.js'

export function getList(){
    return new Promise((reslove, reject) => {
        wx.request({
          url: `${baseUrl}toplist/detail`,
          success: res => {
            //   console.log(res)
              let result = res.data.list
            //   只获取前四项
              result.length = 4
            //   console.log(result)
              reslove(result)
          }
        })
    })
}

export function getLists(id){
  return new Promise((reslove, reject) => {
    wx.request({
      url: `${baseUrl}playlist/detail?id=${id}`,
      success: res => {
        reslove(res)
      }
    })
  })
}


// 获取歌曲详情数据
export function getSongDetail(songId){
  return new Promise((reslove, reject) => {
    wx.request({
      url: `${baseUrl}song/detail?ids=${songId}`,
      success: res => {
        reslove(res)
      }
    })
  })
}

// 相似歌曲
export function getSimiSongs(songId){
  return new Promise((reslove, reject) => {
    wx.request({
      url: `${baseUrl}simi/song?id=${songId}`,
      success: res => {
        reslove(res)
      }
    })
  })
}

// 歌曲评论
export function getSongComment(songId){
  return new Promise((reslove, reject) => {
    wx.request({
      url: `${baseUrl}comment/music?id=${songId}`,
      success: res => {
        reslove(res)
      }
    })
  })
}

// 歌词
export function getSongLyric(songId){
  return new Promise((reslove, reject) => {
    wx.request({
      url: `${baseUrl}lyric?id=${songId}`,
      success: res => {
        reslove(res)
      }
    })
  })
}

// 获取歌曲地址
export function getSongUrl(songId){
  return new Promise((reslove, reject) => {
    wx.request({
      url: `${baseUrl}song/url?id=${songId}`,
      success: res => {
        reslove(res)
      }
    })
  })
}


// 搜索列表
export function searchHot(){
  return new Promise((reslove, reject) => {
    wx.request({
      url: `${baseUrl}search/hot/detail`,
      success: res => {
        reslove(res)
      }
    })
  })
}

// 搜索结果
export function searchWord(word){
  return new Promise((reslove, reject) => {
    wx.request({
      url: `${baseUrl}search?keywords=${word}`,
      success: res => {
        reslove(res)
      }
    })
  })
}


// 搜索结果
export function searchSuggest(word){
  return new Promise((reslove, reject) => {
    wx.request({
      url: `${baseUrl}search/suggest?keywords=${word}&type=mobile`,
      success: res => {
        reslove(res)
      }
    })
  })
}