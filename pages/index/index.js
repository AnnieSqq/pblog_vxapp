// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    // 默认属性
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData:
      wx.canIUse('open-data.type.userAvatarUrl') &&
      wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false // 自定义属性
    // 分类列表
    categoryList: [],
    // 搜索框内容
    searchInput: ''
  },
  // 默认事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    // 默认获取用户信息
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // 自定义行为
    this.getCategoryList()
  },
  // 获取文章分类列表
  getCategoryList(query) {
    let content = query ? query : ''
    var reqTask = wx.request({
      url:
        'http://api.pblog.anniesqq.com/visitor/browse/articles?content=' +
        content,
      success: (result) => {
        this.setData({
          categoryList: result.data.data
        })
      }
    })
  },
  // 搜索框的值改变
  handleSearchInput(e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  // 搜索按钮点击处理
  handleSearchTap(e) {
    this.getCategoryList(this.data.searchInput)
  },
  // 文章点击处理
  handleArticleTap(e) {
    let articleid = e.currentTarget.dataset.articleid
    wx.navigateTo({
      url: '/pages/article/article?articleid=' + articleid
    })
  },
  // 默认函数
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  // 默认函数
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
