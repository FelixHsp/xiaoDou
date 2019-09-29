var rq = require('request-promise')
exports.main = (event, context) => {
  var res = rq('https://www.tianqiapi.com/api/?version=v6&cityid=' + event.code + '&appid=[' + event.appid + ']&appsecret=[' + event.secret+']').then(html => {
    return html;
  })
  console.log(event);
  return res
}