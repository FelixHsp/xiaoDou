// pages/infoDetail/infoDetail.js
const db = wx.cloud.database();
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    openid: '',
    info: [],
    children: [],
    notInfoList: [],
    infoList: [],
    infoNumber: '',
    number: '',
    currentData: 0,
    scrollHeight: '',
    isBeizhu: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: appInstance.globalData.titleName || '',
    });
    console.log(this.data.currentData)
    // console.log(options.id);
    this.setData({
      id: options.id
    })
    console.log(this.data.id)
    db.collection('notices').where({
      _id: this.data.id
    }).get().then(res => {
      console.log(res.data)
      if (res.data[0].tag == true) {
        this.setData({
          isBeizhu: true
        })
      }
    })
    wx.cloud.callFunction({
      name: 'getParents',
      data: {
        id:this.data.id
      },
      success: (res) => {
        console.log(res.result.data)
        if (res.result.data) {
          var arr = res.result.data
          // 数据去重
          var hash = [];
          arr = arr.reduce(function (x, y) {
            hash[y['name']] ? '' : hash[y['name']] = true && x.push(y);
            return x;
          }, []);
          console.log(arr)
          this.setData({
            info: arr,
            scrollHeight: res.result.data.length * 75
          })
          if (this.data.info.length > 0) {
            this.setData({
              ['info[0].img']: '../../images/first.png'
            })
          }
          if (this.data.info.length > 1) {
            this.setData({
              ['info[0].img']: '../../images/first.png',
              ['info[1].img']: '../../images/second.png'
            })
          }
          if (this.data.info.length > 2) {
            this.setData({
              ['info[0].img']: '../../images/first.png',
              ['info[1].img']: '../../images/second.png',
              ['info[2].img']: '../../images/third.png'
            })
          }

        } else {
          this.setData({
            info: []
          })
        }
        // console.log(this.data.info)
        wx.cloud.callFunction({
          name: 'getStudents',
          data: {

          },
          success: (res) => {
            this.setData({
              children: res.result.data
            })
            for (var i = 0; i < this.data.children.length; i++) {
              if (this.data.children[i].name != "") {
                this.data.notInfoList.push(this.data.children[i])
              }
            }
            // console.log(this.data.notInfoList)
            this.setData({
              number: this.data.notInfoList.length
            })
            for (var k = 0; k < this.data.info.length; k++) {
              for (var j = 0; j < this.data.notInfoList.length; j++) {
                if (this.data.info[k].name === this.data.notInfoList[j].name) {
                  // console.log(this.data.info[k].name, this.data.notInfoList[j])
                  this.data.notInfoList.splice(j, 1)
                }
                // console.log(this.data.info[k].name,this.data.notInfoList[j].name)
              }
            }
            var notInfoList = this.data.notInfoList
            console.log(notInfoList)
            // console.log(this.data.info)
            this.setData({
              notInfoList: notInfoList
            })
            this.setData({
              infoNumber: this.data.notInfoList.length
            })
          }
        })
      }
    })
  },
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
    if (this.data.currentData * 1 == 0) {
      // console.log(1)
      this.setData({
        scrollHeight: this.data.info.length * 75
      })
    } else if (this.data.currentData * 1 == 1) {
      // console.log(2)
      this.setData({
        scrollHeight: this.data.notInfoList.length * 75
      })
    }
  },
  childrenBeizhu: function(e) {
    if (this.data.isBeizhu) {
      console.log(e.currentTarget.dataset.id)
      db.collection('parents').where({
        _id: e.currentTarget.dataset.id
      }).get().then(res => {
        console.log(res.data)
        wx.showModal({
          title: res.data[0].name + '同学的备注信息',
          content: res.data[0].beizhu,
          showCancel: false
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: `${appInstance.globalData.titleName}班通知专用小程序`,
      path: '/pages/xiaodou/xiaodou'
    }
  }
})