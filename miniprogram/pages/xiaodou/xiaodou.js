// pages/xiaodou/xiaodou.js
const db = wx.cloud.database();
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    count: 0,
    currentCount: 0,
    weatherImg: '../../images/yun.png',
    welcome:'',
    isTeacher:false,
    openid:'',
    haveTeacher:true,
    weatherList:[],
    todayWeather:[],
    haveTeacherBar:false,
    routers: [
      {
        name: '',
        value:''
      },
      {
        name: '',
        value: ''
      },
      {
        name: '',
        value: ''
      },
      {
        name: '',
        value: ''
      },
      {
        name: '',
        value: ''
      },
      {
        name: '',
        value: ''
      },
      {
        name: '',
        value: ''
      },
      {
        name: '',
        value: ''
      },
      {
        name: '',
        value: ''
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: appInstance.globalData.titleName || '',
    });
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          openid: res.result.openid
        })
        // console.log(this.data.openid)
        db.collection('teachers').get().then(res => {;
          if(!res.data[0]){
            this.setData({
              haveTeacher:false
            })
          }
        })
        db.collection('tag').get().then(res => {
          if (res.data[0]) {
            this.setData({
              haveTeacherBar: true
            })
            console.log(1)
          }
        })
        db.collection('teachers').where({
          teacherId: this.data.openid,
        }).get().then(res => {
          if(res.data[0]){
            this.setData({
              isTeacher:true
            })
          }
        })
      },
      fail: err => {
      }
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'todayweather',
      // 传给云函数的参数
      data: {
        code: '101050101',
        appid: '21278312',
        secret: '6OUVkDlk'
      },
    }).then(res => {
      console.log(JSON.parse(res.result))
      this.setData({
        ['routers[0].name']: '空气',
        ['routers[0].value']: JSON.parse(res.result).air_level,
        ['routers[1].name']: '风速',
        ['routers[1].value']: JSON.parse(res.result).win_speed,
        ['routers[2].name']: '湿度',
        ['routers[2].value']: JSON.parse(res.result).humidity,
        ['routers[3].name']: '能见度',
        ['routers[3].value']: JSON.parse(res.result).visibility,
        ['routers[4].name']: '气压',
        ['routers[4].value']: JSON.parse(res.result).pressure,
        ['routers[5].name']: '风速',
        ['routers[5].value']: JSON.parse(res.result).win_meter,
        ['routers[6].name']: 'PM2.5',
        ['routers[6].value']: JSON.parse(res.result).air_pm25,
        ['routers[7].name']: '城市',
        ['routers[7].value']: JSON.parse(res.result).city,
        ['routers[8].name']: '更新时间',
        ['routers[8].value']: JSON.parse(res.result).update_time,
      })
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'weather',
      // 传给云函数的参数
      data: {
        code: '101050101',
        appid:'21278312',
        secret:'6OUVkDlk'
      },
    }).then(res => {
      // console.log(JSON.parse(res.result).data[0])
      // console.log(JSON.parse(res.result))
      this.setData({
        weatherList: JSON.parse(res.result).data
      })
      // city = JSON.parse(res.result).weatherinfo.city
      // temp = JSON.parse(res.result).weatherinfo.temp
      if (JSON.parse(res.result).data[0].wea_img == 'qing'){
        this.setData({
          weatherImg: '../../images/qing.png'
        })
      } else if (JSON.parse(res.result).data[0].wea_img == 'yu'){
        this.setData({
          weatherImg: '../../images/yu.png'
        })
      } else if (JSON.parse(res.result).data[0].wea_img == 'yin'){
        this.setData({
          weatherImg: '../../images/yin.png'
        })
      } else if (JSON.parse(res.result).data[0].wea_img == 'lei'){
        this.setData({
          weatherImg: '../../images/lei.png'
        })
      }
      wx.cloud.callFunction({
        // 云函数名称
        name: 'time',
        // 传给云函数的参数
        data: {

        },
      }).then(res => {
        // 计算时间
        var time = Date.parse(new Date(JSON.parse(res.result).sysTime2.replace(/-/g, '/'))) / 1000
        this.setData({
          todayTime: time,
          todayDate: JSON.parse(res.result).sysTime2.split(' ')[0],
          todayDateTime: JSON.parse(res.result).sysTime2
        })
        if (this.data.todayDateTime.split(' ')[1].split(':')[0] * 1 >= 6 && this.data.todayDateTime.split(' ')[1].split(':')[0] * 1 < 12) {
          this.setData({
            welcome: '上午好'
          })
        } else if (this.data.todayDateTime.split(' ')[1].split(':')[0] * 1 >= 12 && this.data.todayDateTime.split(' ')[1].split(':')[0] * 1 < 19) {
          this.setData({
            welcome: '下午好'
          })
        } else if (this.data.todayDateTime.split(' ')[1].split(':')[0] * 1 >= 19 && this.data.todayDateTime.split(' ')[1].split(':')[0] * 1 < 24) {
          this.setData({
            welcome: '晚上好',
            weatherImg: '../../images/ye.png'
          })
        } else {
          this.setData({
            welcome: 'Hi !'
          })
        }
        // console.log(this.data.todayTime)
      })
      this.setData({
        ['weather.tem']: JSON.parse(res.result).data[0].tem,
        ['weather.tem2']: JSON.parse(res.result).data[0].tem2 + '-' + JSON.parse(res.result).data[0].tem1,
        ['weather.title']: JSON.parse(res.result).data[0].index[3].level + '·' + JSON.parse(res.result).data[0].wea,
        ['weather.tip']: JSON.parse(res.result).data[0].index[3].desc,
        // ['weather.wea']: JSON.parse(res.result).data[0].wea
        // ['weather.temp']: JSON.parse(res.result).temp+'℃'
      })
    })
    db.collection('notices').count({
      success: (res) => {
        this.setData({
          count: res.total
        });
        // console.log(this.data.count);
      }
    })
    db.collection('notices').orderBy('date', 'desc').limit(5).get().then(res => {
      // console.log(res.data)
      this.setData({
        list:res.data,
        currentCount: 5
      })
      // console.log(this.data.currentCount);
    })
  },
  add:function(){
    // console.log(1111)
    wx.navigateTo({
      url: '../addOne/addOne'
    })
  },
  goDetail:function(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  watchTeacher:function(){
    wx.showModal({
      title: '教师码',
      content: this.data.openid,
      showCancel:false
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(2)
    db.collection('notices').count({
      success: res => {
        if (res.total > this.data.count) {
          db.collection('notices').orderBy('date', 'desc').limit(5).get().then(res => {
            // console.log(res.data)
            this.setData({
              list: res.data,
              currentCount: 5
            })
          });
        }
      }
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          openid: res.result.openid
        })
        // console.log(this.data.openid)
        db.collection('teachers').get().then(res => {
          if (!res.data[0]) {
            this.setData({
              haveTeacher: false
            })
            console.log(1)
          }
        })
        db.collection('tag').get().then(res => {
          if (res.data[0]) {
            this.setData({
              haveTeacherBar: true
            })
          }
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
      },
      fail: err => {
      }
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
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          openid: res.result.openid
        })
        // console.log(this.data.openid)
        db.collection('teachers').get().then(res => {
          if (!res.data[0]) {
            this.setData({
              haveTeacher: false
            })
            console.log(1)
          }
        })
        db.collection('tag').get().then(res => {
          if (res.data[0]) {
            this.setData({
              haveTeacherBar: true
            })
          }
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
      },
      fail: err => {
      }
    })
    db.collection('notices').orderBy('date', 'desc').limit(5).get().then(res => {
      // console.log(res.data)
      this.setData({
        list: res.data,
        currentCount: 5
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentCount <= this.data.count && this.data.isTeacher) {
      // console.log(this.data.currentCount, this.data.count);
      db.collection('notices').orderBy('date', 'desc').skip(this.data.currentCount).limit(5).get().then(res => {
        let list = this.data.list;
        for (let i = 0; i < res.data.length; i++) {
          list.push(res.data[i]);
        }
        // console.log(list);
        this.setData({
          list: list,
          currentCount: this.data.currentCount + 5
        })
      })
    }
    else {
      wx.showToast({
        title: '没有更多通知了',
        icon: 'none'
      })
    }
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