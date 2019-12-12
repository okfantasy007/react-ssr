/**
 *
 * 对象转URL
 */
function urlEncode(data) {
	var _result = [];
	for (var key in data) {
		var value = data[key];
		if (value.constructor === Array) {
			console.log('get请求参数不支持数组');
		} else {
			_result.push(key + '=' + value);
		}
	}
	return _result.join('&');
}


/**
 * @author William Cui
 * @description 根据URL参数名获取参数值
 * @param name {string} 参数名
 * @returns value {string} 参数值
 **/
function getQueryString(name) {
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	let r = window.location.search.substr(1).match(reg);
	if (r !== null) return unescape(r[2]);
	return null;
}

/**
 * @author William Cui
 * @description 数字不够位数前面自动补零
 * @param number {number} 需要格式化的数字
 * @param n {number} 需要格式化成的位数
 * @returns {string} 格式化后的字符串
 **/
function fillZero(number, n) {
	return (Array(n).join(0) + number).slice(-n);
}

/**
 * @author William Cui
 * @description 根据后端返回的时间戳格式化成指定的格式
 * @param timestamp {number} 需要格式化的时间戳
 * @param patternStr {string} 指定的格式字符串 默认是'YYYY-MM-DD hh:mm:ss'
 * @returns {string} 格式化后的日期时间字符串
 Y: 代表年份， M: 代表月份， D: 代表一个月中的第几天， h: 代表小时， m: 代表分, s: 代表秒
 **/
function stampToDate(timestamp, patternStr) {
	patternStr = patternStr || 'YYYY-MM-DD hh:mm:ss';
	const patternArray = patternStr.match(/\w+/g);
	const date = new Date(timestamp);
	const dateObj = {
		Y: date.getFullYear(),
		M: date.getMonth() + 1,
		D: date.getDate(),
		h: date.getHours(),
		m: date.getMinutes(),
		s: date.getSeconds()
	};
	patternArray.forEach(pattern => {
		let replaceStr = fillZero(dateObj[pattern[0]], pattern.length);
		patternStr = patternStr.replace(pattern, replaceStr);
	});
	return patternStr;
}

/**
 * @author William Cui
 * @description 把日期字符串转成时间戳
 * @param dateStr {string} 需要格式化的日期字符串
 * @returns {number} 时间戳
 **/
function dateToStamp(dateStr) {
	return new Date(dateStr).getTime();
}

export {getQueryString, stampToDate, dateToStamp, urlEncode};
