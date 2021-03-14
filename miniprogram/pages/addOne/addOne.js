// pages/addOne/addOne.js
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    content:'',
    todayTime:'',
    todayDate:'',
    todayDateTime:'',
    imgbox:[],
    fileIDs: '',
    filePath: '',
    array: ['日常通知', '作业通知', '重要通知'],
    index:0,
    beizhuTag:false,
    btnTag:true,
    currentFileName: '',
    currentFilePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: appInstance.globalData.titleName || '',
    });
  },
  typeInput:function(e){
    // console.log(e.detail.value)
    this.setData({
      type: e.detail.value
    })
  },
  contentInput:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  info:function(){
    if(!this.data.content){
      wx.showModal({
        title: '提示',
        content: '请将通知内容填写完整',
        showCancel: false,
      })
    }else{
      wx.showModal({
        title: '确定',
        content: '点击确定发布',
        confirmColor: '#7c7f97',
        success:(res)=> {
          if (res.confirm) {
            if(this.data.btnTag){
              this.setData({
                btnTag:false
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
                wx.showLoading({
                  title: '发布中',
                })
                let promiseArr = [];
                let imgList = [];
                for (let i = 0; i < this.data.imgbox.length; i++) {
                  promiseArr.push(new Promise((reslove, reject) => {
                    let item = this.data.imgbox[i];
                    let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
                    wx.cloud.uploadFile({
                      cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
                      filePath: item, // 小程序临时文件路径
                      success: res => {
                        this.setData({
                          fileIDs: this.data.fileIDs.concat(res.fileID)
                        });
                        imgList.push(res.fileID)
                        // console.log(imgList)
                        reslove();
                        wx.hideLoading();
                      },
                      fail: res => {
                        wx.hideLoading();
                        wx.showToast({
                          title: '上传照片失败',
                          icon: 'none'
                        })
                      }
                    })
                  }));
                }
                if (this.data.currentFilePath) {
                  promiseArr.push(new Promise((reslove, reject) => {
                    let suffix = /\.\w+$/.exec(this.data.currentFilePath)[0];//正则表达式返回文件的扩展名
                    wx.cloud.uploadFile({
                      cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
                      filePath: this.data.currentFilePath, // 小程序临时文件路径
                      success: res => {
                        this.setData({
                          filePath: res.fileID
                        });
                        reslove();
                      },
                      fail: res => {
                        wx.showToast({
                          title: '上传文件失败',
                          icon: 'none'
                        })
                      }
                    })
                  }));
                }
                Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
                  console.log("图片上传完成后再执行")
                  console.log(imgList)
                  this.setData({
                    imgbox: []
                  })
                  const db = wx.cloud.database();
                  db.collection('notices').add({
                    data: {
                      date: this.data.todayDateTime,
                      type: this.data.array[this.data.index],
                      content: this.data.content,
                      tag: this.data.beizhuTag,
                      imgList: imgList,
                      filePath: this.data.filePath,
                      fileName: this.data.currentFileName
                    },
                    success: function (res) {
                      console.log(res);
                      wx.showToast({
                        title: "发布成功",
                      });
                      wx.reLaunch({
                        url: '../xiaodou/xiaodou',
                      });
                    },
                    fail: function (err) {
                      console.log(err)
                    },
                  });
                })
              })
            }
          } else if (res.cancel) {
            
          }
        }
      })
    }
    
  },
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 选择图片 &&&
  addPic1: function (e) {
    var imgbox = this.data.imgbox;
    console.log(imgbox)
    var that = this;
    var n = 9;
    if (9 > imgbox.length > 0) {
      n = 9 - imgbox.length;
    } else if (imgbox.length == 9) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (9 >= imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },

  //图片
  imgbox: function (e) {
    this.setData({
      imgbox: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  switchChange:function(e){
    console.log(e.detail.value)
    this.setData({
      beizhuTag:e.detail.value
    })
  },

  addFile: function() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success:(res) => {
        this.setData({
          currentFileName: res.tempFiles[0].name,
          currentFilePath: res.tempFiles[0].path
        });
      }
    })
  },

  delFile: function() {
    this.setData({
      currentFileName: '',
      currentFilePath: ''
    });
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
    this.setData({
      btnTag:true
    })
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
      title: `${appInstance.globalData.titleName}班通知专用小程序`,
      path: '/pages/xiaodou/xiaodou'
    }
  }
})