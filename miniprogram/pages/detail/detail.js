// pages/detail/detail.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    list:{},
    imgSrc:[],
    openid:'',
    isInfo:false,
    childrenName:'',
    isTeacher:false,
    isShare:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id: options.id
      })
    }
    if(options.shareId){
      this.setData({
        id: options.shareId,
        isShare:true
      })
    }
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          openid: res.result.openid
        })
        db.collection('teachers').where({
          teacherId: this.data.openid,
        }).get().then(res => {
          if (res.data[0]) {
            this.setData({
              isTeacher: true
            })
          }
        })
        // console.log(this.data.openid)
        db.collection('parents').where({
          _openid: this.data.openid,
          noticeId: this.data.id
        }).get().then(res => {
          console.log(res)
          if(res.data[0]){
            this.setData({
              isInfo:true
            })
          }
        })
      },
      fail: err => {
      }
    })
    // console.log(this.data.id)
    db.collection('notices').where({
      _id: this.data.id
    }).get().then(res => {
      // console.log(res.data[0])
      this.setData({
        list: res.data[0]
      })
      // console.log(this.data.list.imgList.length)
      // console.log(this.data.list)
      var imgSrc=[];
      for (var i = 0; i < this.data.list.imgList.length; i++) {
        wx.cloud.downloadFile({
          fileID: this.data.list.imgList[i],
          success: res => {
            imgSrc.push(res.tempFilePath)
            // console.log(imgSrc)
            this.setData({
              imgSrc:imgSrc
            })
          },
          fail: err => {
            // handle error
          }
        })
      }
    })
  },
  parentsInfo:function(e){
    this.setData({
      childrenName: e.detail.value
    })
  },
  infoBtn:function(){
    if(!this.data.childrenName){
      wx.showModal({
        title: '提示',
        content: '请填写您孩子的姓名',
        showCancel:false
      })
    }else{
    // console.log(this.data.childrenName)
    db.collection('parents').where({
      name: this.data.childrenName,
      noticeId:this.data.id
    }).get().then(res => {
      // console.log(res.data[0])
      if(!res.data[0]){
        // console.log(1)
        db.collection('students').where({
          name: this.data.childrenName
        }).get().then(res => {
          // console.log(res.data[0])
          if (!res.data[0]) {
            console.log(1)
            wx.showModal({
              title: '提示',
              content: '您填写的名字有误，请重新填写',
              showCancel: false
            })
          }else {
            console.log(res.data[0].img)
            this.setData({
              childrenImg: res.data[0].img
            })
            wx.cloud.callFunction({
              // 云函数名称
              name: 'time',
              // 传给云函数的参数
              data: {

              },
            }).then(res => {
              var time = Date.parse(new Date(JSON.parse(res.result).sysTime2.replace(/-/g, '/'))) / 1000
              this.setData({
                todayTime: time,
                todayDate: JSON.parse(res.result).sysTime2.split(' ')[0],
                todayDateTime: JSON.parse(res.result).sysTime2
              })
              console.log(this.data.todayDateTime)
              db.collection('parents').add({
                data: {
                  name: this.data.childrenName,
                  date: this.data.todayDateTime,
                  noticeId: this.data.id,
                  img: this.data.childrenImg
                }
              }).then(res => {
                wx.redirectTo({
                  url: '../detail/detail?id=' + this.data.id,
                })
              })
            })
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '您孩子的姓名已被他人提交',
          showCancel:false
        })
        this.setData({
          isInfo:true
        })
      }
    })
  }
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgSrc // 需要预览的图片http链接列表  
    })
  },   
  detailBtn:function(){
    wx.navigateTo({
      url: '../infoDetail/infoDetail?id='+this.data.id,
    })
  },
  backHome: function () {
    wx.reLaunch({
      url: '/pages/xiaodou/xiaodou'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '小豆班有新的通知啦',
      desc: this.data.list.type,
      path: '/pages/detail/detail?shareId=' + this.data.id
    }
  }
})