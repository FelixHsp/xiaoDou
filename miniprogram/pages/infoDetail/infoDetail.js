// pages/infoDetail/infoDetail.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    openid: '',
    info:[],
    children:[],
    notInfoList:[],
    infoList:[],
    infoNumber:'',
    number:'',
    currentData: 0,
    scrollHeight:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.currentData)
    // console.log(options.id);
    this.setData({
      id:options.id
    })
    console.log(this.data.id)
    db.collection('parents').orderBy('date','asc').where({
      noticeId: this.data.id
    }).get().then(res => {
      if(res.data){
        this.setData({
          info: res.data,
          scrollHeight:res.data.length*100
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
        
      }else{
        this.setData({
          info:[]
        })
      }
      // console.log(this.data.info)
      wx.cloud.callFunction({
        name: 'getStudents',
        data: {
          
        }, 
        success:(res)=> {
          this.setData({
            children:res.result.data
          })
          for(var i = 0 ; i < this.data.children.length;i++ ){
            if (this.data.children[i].name!=""){
              this.data.notInfoList.push(this.data.children[i])
            }
          }
          // console.log(this.data.notInfoList)
          this.setData({
            number: this.data.notInfoList.length
          })
          for(var k = 0 ; k < this.data.info.length ; k++){
            for(var j = 0 ; j < this.data.notInfoList.length;j++){
              if(this.data.info[k].name === this.data.notInfoList[j].name){
                // console.log(this.data.info[k].name, this.data.notInfoList[j])
                this.data.notInfoList.splice(j,1)
              }
              // console.log(this.data.info[k].name,this.data.notInfoList[j].name)
            }
          }
          var notInfoList = this.data.notInfoList
          console.log(notInfoList)
          // console.log(this.data.info)
          this.setData({
            notInfoList:notInfoList
          })
          this.setData({
            infoNumber: this.data.notInfoList.length
          })
        }
      })
    })
  },
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
    if(this.data.currentData*1 == 0){
      // console.log(1)
      this.setData({
        scrollHeight:this.data.info.length*100
      })
    }else if(this.data.currentData*1 == 1){
      // console.log(2)
      this.setData({
        scrollHeight:this.data.notInfoList.length*100
      })
    }
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

  }
})