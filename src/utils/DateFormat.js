export function formatDate(fmt, date) {
  if (date===null || date==="") {
      return ''
  }
  date = new Date(date)

  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}
/**
 * desc   :  把时间戳转换成yyyy-mm-dd HH:mm:ss
 * use    :  dateFormat(时间戳)
 * return :  yyyy-mm-dd HH:mm:ss
 */
export function dateFormat(time) {
  if (!time) return
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}
/**
 * desc   :  获取两个时间的时间差 开始时间和结束时间需要是 yyyy-mm-dd HH:mm:ss
 * use    :  getTimeSalc(startTime, endTime)
 * return :  0 天 0 小时 0 分钟
 */
export function getTimeSalc(startTime, endTime) {
  if (!startTime || !endTime) {
    return
  }
  startTime = startTime.replace(new RegExp("-", "gm"), "/");
  let startTimeFormat = (new Date(startTime)).getTime(); //开始时间毫秒数

  endTime = endTime.replace(new RegExp("-", "gm"), "/");
  let endTimeFormat = (new Date(endTime)).getTime(); //结束时间毫秒数

  let millisecond1 = endTimeFormat - startTimeFormat; //获取相减的毫秒数；

  let days = Math.floor(millisecond1 / (24 * 3600 * 1000)); //获取天数；
  //如果天数小于0，则给其赋值00
  if (days < 0) days = "00"
  let millisecond2 = millisecond1 % (24 * 3600 * 1000);
  let hours = Math.floor(millisecond2 / (3600 * 1000)); //获取小时 //判断小时小于0  则赋值00 if(hours < 0){        hours="00" ; }
  let millisecond3 = millisecond2 % (3600 * 1000);
  let minutes = Math.floor(millisecond3 / (60 * 1000)); //获取分钟数
  if (minutes < 0) minutes = "00"
  return `${days}天 ${hours}小时 ${minutes}分钟`
}
