/* 数字金额逢三加， 比如 123,464.23 */
export function numberToCurrency(value) {
  if (value=== undefined) return
  //  数据格式是存在小数点的
  if (String(value).indexOf(".") != -1) {
    if (!value) return '0.00'
    // 将数值截取，保留两位小数
    value = Number(value).toFixed(2)
    // 获取整数部分
    const intPart = Math.trunc(value)
    // 整数部分处理，增加,
    const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    // 预定义小数部分
    let floatPart = '.00'
    // 将数值截取为小数部分和整数部分
    const valueArray = value.toString().split('.')
    if (valueArray.length === 2) { // 有小数部分
      floatPart = valueArray[1].toString() // 取得小数部分
      return intPartFormat + '.' + floatPart
    }
    return intPartFormat + floatPart
  }else {
    const intPart = Math.trunc(value)
    const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    return intPartFormat
  }
}
