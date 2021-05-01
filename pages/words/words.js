// pages/words/words.js
const { promiseAPI } = require('../../utils/util')
const http = promiseAPI(wx.request)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wordList: [],
    wordInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWrodList()
  },
  // 获取留言列表
  getWrodList: function () {
    wx.request({
      url:
        'http://api.pblog.anniesqq.com/visitor/read/comments?action=leaveword',
      success: (result) => {
        this.setData({
          wordList: this.data.wordList.concat(result.data.data.comments)
        })
      }
    })
  },
  // 留言输入
  handleWordInput: function (e) {
    this.setData({
      wordInput: e.detail.value
    })
  },
  // 留言发送
  handleWordSend: function (e) {
    // 如果内容为空，则不发起请求
    if (this.data.wordInput == '') {
      return wx.showToast({
        title: '留言不能为空',
        icon: 'error'
      })
    }
    // 验证用户信息
    let token = wx.getStorageSync('visitortoken')
    let id = wx.getStorageSync('visitorid')
    // 如果token为空，则申请注册
    if (token == '') {
      let that = this
      http({
        url: 'http://api.pblog.anniesqq.com/visitor/user/register',
        method: 'POST'
      }).then((res) => {
        token = res.data.data.token
        id = res.data.data.id
        wx.setStorageSync('visitortoken', res.data.data.token)
        wx.setStorageSync('visitorname', res.data.data.name)
        wx.setStorageSync('visitorid', res.data.data.id)
        // 进行留言
        http({
          url: 'http://api.pblog.anniesqq.com/visitor/interact/comment',
          method: 'POST',
          header: { visitortoken: token },
          data: {
            visitor: id,
            action: 'leaveword',
            content: that.data.wordInput
          }
        }).then((res) => {
          wx.showToast({
            title: '留言成功',
            icon: 'success'
          })
          this.setData({
            wordInput: ''
          })
          // 刷新页面
          that.setData({ wordList: [] })
          that.getWrodList()
        })
      })
    } else {
      // 进行留言
      http({
        url: 'http://api.pblog.anniesqq.com/visitor/interact/comment',
        method: 'POST',
        header: { visitortoken: token },
        data: {
          visitor: id,
          action: 'leaveword',
          content: this.data.wordInput
        }
      }).then((res) => {
        wx.showToast({
          title: '留言成功',
          icon: 'success'
        })
        this.setData({
          wordInput: ''
        })
        // 刷新页面
        this.setData({ wordList: [] })
        this.getWrodList()
      })
    }
    // wx.removeStorageSync('visitortoken')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
