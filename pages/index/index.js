//index.js
//获取应用实例
const app = getApp()
//请求的url
const request_url = 'https://www.codeboy.me/search/cb-search.json';
const pageMap = {};

Page({
  data: {
    blogData: {},
    dataSuccess: false,
    loading: true
  },
  onLoad: function() {
    const that = this;
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: request_url, //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.code == 0) {
          var title;
          var path;
          var position;
          //去除分类标签
          for (var i = 0; i < res.data.data.length; i++) {
            title = res.data.data[i].title;
            path = res.data.data[i].url.substr(1);
            position = title.lastIndexOf('-');
            if (position != -1) {
              title = title.substring(0, position).trim();
            }
            var reg = new RegExp('\/', "g")
            path = path.replace(reg, '-');
            path = path.substring(0, path.length - 1);
            pageMap[title] = path;
          }
          that.setData({
            blogData: res.data.data,
            dataSuccess: true,
            loading: false
          });
        } else {
          that.setData({
            dataSuccess: false,
            loading: false
          });
        }
        wx.hideLoading();
      },
      fail: function() {
        wx.hideLoading();
      }
    })
  },
  //事件处理函数
  openBlog: function(event) {
    try {
      var id = event.currentTarget.dataset.id;
      var title = event.currentTarget.dataset.title;
      title = title.replace(/-.*/, '').trim();
      var path = pageMap[title]
      wx.navigateTo({
        url: '/pages/content/content?path=' + path + '&title=' + title
      })
      // wx.navigateTo({
      //   url: '/pages/webview/webview'
      // })
    } catch (e) {
      wx.showToast({
        title: '加载失败',
        icon: 'failed',
        duration: 2000,
        mask: true
      })
    }
  }
})