const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xiaodou-jtc8g'
})
exports.main = (event, context) => {
  console.log(event)
  console.log(context)
  const wxContext = cloud.getWXContext()
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  }
}