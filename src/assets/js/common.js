import C from './config'
var Rxports = {
  install(Vue, options) {
    //   时间展示规则函数
    Vue.prototype.dateFormat = function (timestamp) {
      var nowTimeStamp = Date.parse(new Date()),
        str = '';
      // 三分钟内，显示刚刚 3*60*1000
      const threenMintes = 3 * 60 * 1000;
      // 1小时以内
      const wthinOneHour = 60 * 60 * 1000;
      // 24小时以内
      const oneDay = 24 * 60 * 60 * 1000;
      let realShowTime = ''
      if (nowTimeStamp - timestamp <= threenMintes) {
        realShowTime = '刚刚'
        return realShowTime
      } else if (nowTimeStamp - timestamp <= wthinOneHour) {
        let showTimeStamp = nowTimeStamp - timestamp;
        realShowTime = showTimeStamp/1000/60 // 获取分钟数
        realShowTime = Math.floor(realShowTime)
        return realShowTime+'分钟前'
      } else if (nowTimeStamp - timestamp < oneDay) {
        let showTimeStamp = nowTimeStamp - timestamp;
        realShowTime = showTimeStamp/1000/60/60

        realShowTime =Math.floor(realShowTime)
      
        return realShowTime+'小时前';
      } else {
        var time = new Date(parseInt(timestamp));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        m <10? m='0'+m: m=m;
        d <10? d='0'+d: d=d;
        h <10? h='0'+h: h=h;
        mm <10? mm='0'+mm: mm=mm;
        realShowTime =  y+'-'+m+'-'+d+' '+h+':'+mm;
        return realShowTime;
      }
    }
      Vue.prototype.toArtcleDetail = function (type,id) { // 跳主站的文章和视频详情
        window.open(C.KGHost + type +'/'+ id)
      }
     
  }
}
export default Rxports
