// pages/article/article.js
const { promiseAPI } = require('../../utils/util')
const http = promiseAPI(wx.request)
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    articleData: {},
    article: {},
    commentList: [],
    commentInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleData(options)
    this.getCommentList(options)
  },
  // 点击回到顶部按钮
  handleUpTap: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  // 获取文章内容
  getArticleData: function (options) {
    wx.request({
      url:
        'http://api.pblog.anniesqq.com/visitor/read/article/' +
        options.articleid,
      success: (result) => {
        this.setData({
          articleData: result.data.data
        })
        // 设置towxml渲染内容节点
        let obj = app.towxml(this.data.articleData.content, 'markdown', {
          // theme:'dark',
          events: {
            tap: (e) => {
              // console.log('tap', e)
            },
            change: (e) => {
              // console.log('todo', e)
            }
          }
        })
        this.setData({
          article: obj
        })
      }
    })
  },
  // 获取文章评论
  getCommentList: function (options) {
    wx.request({
      url:
        'http://api.pblog.anniesqq.com/visitor/read/comments?action=comment&article=' +
        options.articleid,
      success: (result) => {
        this.setData({
          commentList: this.data.commentList.concat(result.data.data.comments)
        })
      }
    })
  },
  // 点击移到底部按钮
  handleDownTap: function (e) {
    wx.createSelectorQuery()
      .select('#foot_bottom')
      .boundingClientRect(function (rect) {
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      })
      .exec()
  },
  // 点赞按钮
  handleLike: function (e) {
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
        // 点赞
        http({
          url: 'http://api.pblog.anniesqq.com/visitor/interact/like',
          method: 'POST',
          header: { visitortoken: token },
          data: {
            visitor: id,
            article: that.data.articleData.id
          }
        }).then((res) => {
          wx.showToast({
            title: res.data.msg,
            image: '/images/like.png'
          })
        })
      })
    } else {
      // 点赞
      http({
        url: 'http://api.pblog.anniesqq.com/visitor/interact/like',
        method: 'POST',
        header: { visitortoken: token },
        data: {
          visitor: id,
          article: this.data.articleData.id
        }
      }).then((res) => {
        wx.showToast({
          title: res.data.msg,
          image: '/images/like.png'
        })
      })
    }
  },
  // 收藏按钮
  handleCollect: function (e) {
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
        // 点赞
        http({
          url: 'http://api.pblog.anniesqq.com/visitor/interact/collect',
          method: 'POST',
          header: { visitortoken: token },
          data: {
            visitor: id,
            article: that.data.articleData.id
          }
        }).then((res) => {
          wx.showToast({
            title: res.data.msg,
            image: '/images/collect.png'
          })
        })
      })
    } else {
      // 点赞
      http({
        url: 'http://api.pblog.anniesqq.com/visitor/interact/collect',
        method: 'POST',
        header: { visitortoken: token },
        data: {
          visitor: id,
          article: this.data.articleData.id
        }
      }).then((res) => {
        wx.showToast({
          title: res.data.msg,
          image: '/images/collect.png'
        })
      })
    }
  },
  // 评论输入框变化处理
  handleCommentInput: function (e) {
    this.setData({
      commentInput: e.detail.value
    })
  },
  // 发送评论按钮点击
  handleCommentSend: function (e) {
    // 如果内容为空，则不发起请求
    if (this.data.commentInput == '') {
      return wx.showToast({
        title: '评论不能为空',
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
        // 进行评论
        http({
          url: 'http://api.pblog.anniesqq.com/visitor/interact/comment',
          method: 'POST',
          header: { visitortoken: token },
          data: {
            visitor: id,
            action: 'comment',
            content: that.data.commentInput,
            article: that.data.articleData.id
          }
        }).then((res) => {
          wx.showToast({
            title: '评论成功',
            icon: 'success'
          })
          this.setData({
            commentInput: ''
          })
          // 刷新页面
          that.setData({ commentList: [] })
          that.getCommentList()
        })
      })
    } else {
      // 进行评论
      http({
        url: 'http://api.pblog.anniesqq.com/visitor/interact/comment',
        method: 'POST',
        header: { visitortoken: token },
        data: {
          visitor: id,
          action: 'comment',
          content: this.data.commentInput,
          article: this.data.articleData.id
        }
      }).then((res) => {
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
        this.setData({
          commentInput: ''
        })
        // 刷新页面
        this.setData({ commentList: [] })
        this.getCommentList({ articleid: this.data.articleData.id })
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
