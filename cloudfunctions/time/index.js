var rq = require('request-promise')
exports.main = (event, context) => {
  var res = rq('http://quan.suning.com/getSysTime.do').then(html => {
    return html;
  })
  console.log(event);
  return res
}