const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xiaodou-jtc8g'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('parents').orderBy('date', 'asc').where({
      noticeId: event.id
    }).get()
  } catch (e) {
    console.log(e)
  }
}